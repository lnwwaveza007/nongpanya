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
  const result = await prisma.request_medicines.groupBy({
    by: ["medicine_id"],
    _count: {
      medicine_id: true,
    },
    orderBy: {
      _count: {
        medicine_id: "desc",
      },
    },
  });

  const medicines = await prisma.medicines.findMany({
    where: {
      id: {
        in: result.map((r) => r.medicine_id),
      },
    },
    select: {
      id: true,
      name: true,
    },
  });

  const final = result.map((entry) => {
    const medicine = medicines.find((m) => m.id === entry.medicine_id);
    return {
      medicine_id: entry.medicine_id,
      medicine_name: medicine?.name || "Unknown",
      total: entry._count.medicine_id,
    };
  });

  return final;
};

export const getRequestHistoryByDate = async (date) => {
  const start = date ? new Date(`${date}T01:00:00Z`) : new Date();
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  const result = await prisma.requests.findMany({
    where: {
      created_at: {
        gt: start,
        lte: end,
      },
    },
    orderBy: {
      created_at: "asc",
    },
    include: {
      request_medicines: {
        include: {
          medicines: {
            select: {
              id: true,
              name: true,
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
    weight: req.weight,
    additional_notes: req.additional_notes,
    allergies: req.allergies,
    status: req.status,
    created_at: req.created_at.toISOString(),
    updated_at: req.updated_at.toISOString(),
    medicines: req.request_medicines.map((med) => ({
      id: med.medicine_id,
      name: med.medicines.name,
    })),
    symptoms: req.request_symptoms.map((sym) => ({
      id: sym.symptom_id,
      name: sym.symptoms.name,
    })),
  }));
};
