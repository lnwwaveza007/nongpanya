import prisma from "../config/prismaClient.js";

export const getMedicineRequestTimeSeriesByDate = async (date) => {
  const start = date ? new Date(`${date}T01:00:00Z`) : new Date();
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  // Get all medicines
  const medicines = await prisma.medicines.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  // Get raw hourly data
  const raw = await prisma.medicine_request_hourly_summary.findMany({
    where: {
      time: {
        gte: start,
        lte: end,
      },
    },
    orderBy: { time: "asc" },
  });

  // Prepare 24-hour timeline
  const timeSlots = [];
  for (let i = 0; i < 24; i++) {
    const t = new Date(start);
    t.setHours(t.getHours() + i);
    timeSlots.push(t.toISOString());
  }

  // Group raw data by time and medicine
  const result = timeSlots.map((time) => {
    const hourData = raw.filter((r) => r.time.toISOString() === time);

    const medicineStats = medicines.map((med) => {
      const matched = hourData.find((r) => r.medicine_id === med.id);
      return {
        medicine_id: med.id,
        medicine_name: med.name,
        total: matched ? matched.total : 0,
      };
    });

    return {
      time,
      medicine: medicineStats,
    };
  });

  return result;
};

export const getAllTimeMedicineRank = async () => {
  // Get all medicines ordered by ID (default order)
  const medicines = await prisma.medicines.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      id: "asc",
    },
  });

  // Get request counts for medicines that have been requested
  const requestCounts = await prisma.request_medicines.groupBy({
    by: ["medicine_id"],
    _count: {
      medicine_id: true,
    },
  });

  // Create a map for quick lookup of request counts
  const countMap = new Map();
  requestCounts.forEach((entry) => {
    countMap.set(entry.medicine_id, entry._count.medicine_id);
  });

  // Map all medicines with their request counts (0 if never requested)
  const final = medicines.map((medicine) => {
    const requestCount = countMap.get(medicine.id) || 0;
    return {
      medicine_id: medicine.id,
      medicine_name: medicine.name,
      total: requestCount,
      rank: 0, // Will be calculated after sorting
    };
  });

  // Sort by request count (descending) to calculate ranks
  const sortedByCount = [...final].sort((a, b) => b.total - a.total);
  
  // Assign ranks (medicines with same count get same rank)
  let currentRank = 1;
  for (let i = 0; i < sortedByCount.length; i++) {
    if (i > 0 && sortedByCount[i].total !== sortedByCount[i - 1].total) {
      currentRank = i + 1;
    }
    sortedByCount[i].rank = currentRank;
  }

  // Create rank map for quick lookup
  const rankMap = new Map();
  sortedByCount.forEach((item) => {
    rankMap.set(item.medicine_id, item.rank);
  });

  // Apply ranks to the original order (by ID)
  final.forEach((item) => {
    item.rank = rankMap.get(item.medicine_id);
  });

  return final;
};

export const getMedicineRequestHistoryByDate = async (startDate, endDate) => {
  let whereClause = {};
  
  if (startDate && endDate) {
    // Both dates provided - filter by range
    const start = new Date(`${startDate}T00:00:00Z`);
    const end = new Date(`${endDate}T23:59:59Z`);
    whereClause.created_at = {
      gte: start,
      lte: end,
    };
  } else if (startDate) {
    // Only start date provided - filter from start date onwards
    const start = new Date(`${startDate}T00:00:00Z`);
    whereClause.created_at = {
      gte: start,
    };
  } else if (endDate) {
    // Only end date provided - filter up to end date
    const end = new Date(`${endDate}T23:59:59Z`);
    whereClause.created_at = {
      lte: end,
    };
  }
  // If neither date is provided, no date filtering (get all records)

  const result = await prisma.requests.findMany({
    where: whereClause,
    orderBy: {
      created_at: "desc",
    },
    include: {
      request_medicines: {
        include: {
          medicines: {
            select: {
              id: true,
              name: true,
              image_url: true,
              description: true,
            },
          },
        },
      },
      request_symptoms: {
        include: {
          symptoms: {
            select: {
              id: true,
              name: true,
              description: true,
            },
          },
        },
      },
      users: {
        select: {
          id: true,
          fullname: true,
          email: true,
        },
      },
    },
  });
  
  return result.map((req) => ({
    code: req.code,
    user_id: req.user_id,
    fullname: req.users.fullname,
    email: req.users.email,
    additional_notes: req.additional_notes,
    allergies: req.allergies,
    status: req.status,
    created_at: req.created_at.toISOString(),
    updated_at: req.updated_at.toISOString(),
    medicines: req.request_medicines.map((med) => ({
      id: med.medicine_id,
      name: med.medicines.name,
      image_url: med.medicines.image_url,
      description: med.medicines.description,
    })),
    symptoms: req.request_symptoms.map((sym) => ({
      id: sym.symptom_id,
      name: sym.symptoms.name,
      description: sym.symptoms.description || "",
    })),
  }));
};

export const getMedicineRequestHistoryByUserId = async (userId) => {
  const result = await prisma.requests.findMany({
    where: {
      user_id: userId,
    },
    orderBy: {
      created_at: "desc",
    },
    include: {
      request_medicines: {
        include: {
          medicines: {
            select: {
              id: true,
              name: true,
              image_url: true,
              description: true,
            },
          },
        },
      },
      request_symptoms: {
        include: {
          symptoms: {
            select: {
              id: true,
              name: true,
              description: true,
            },
          },
        },
      },
      users: {
        select: {
          fullname: true,
          email: true,
        },
      },
    },
  });
  
  return result.map((req) => ({
    code: req.code,
    user_id: req.user_id,
    fullname: req.users.fullname,
    email: req.users.email,
    additional_notes: req.additional_notes,
    allergies: req.allergies,
    status: req.status,
    created_at: req.created_at.toISOString(),
    updated_at: req.updated_at.toISOString(),
    medicines: req.request_medicines.map((med) => ({
      id: med.medicine_id,
      name: med.medicines.name,
      image_url: med.medicines.image_url,
      description: med.medicines.description,
    })),
    symptoms: req.request_symptoms.map((sym) => ({
      id: sym.symptom_id,
      name: sym.symptoms.name,
      description: sym.symptoms.description || "",
    })),
  }));
};