import prisma from "../config/prismaClient.js";
import { cleanMedicineName } from "../utils/formatter.js";
import { dropPills } from "./boardServices.js";
import { checkMedicineStock, removeStock } from "./medStockServices.js";

export const getSymptoms = async () => {
  const symptoms = await prisma.symptoms.findMany();
  return symptoms;
};

export const getMedicines = async () => {
  const medicines = await prisma.medicines.findMany();

  const result = await Promise.all(
    medicines.map(async (med) => {
      const stock = await prisma.medicine_stocks.aggregate({
        where: { medicine_id: med.id },
        _sum: { stock_amount: true },
      });

      return {
        ...med,
        total_stock: stock._sum.stock_amount || 0,
      };
    })
  );

  return result;
};

export const getMedicalInfo = async (medId) => {
  const medInfo = await prisma.medicine_instructions.findMany({
    where: { id: medId },
  });
  return medInfo;
};

export const setReqStatus = async (code) => {
  return await prisma.requests.updateMany({
    where: { code },
    data: { status: "completed" },
  });
};

export const createRequest = async (formData, userId) => {
  try {
    // Validate user ID
    if (!userId) {
      throw new Error("User ID is required.");
    }
    if (!formData.code) {
      throw new Error("Request code is required.");
    }

    // Check if user exists
    const userExists = await prisma.users.findUnique({
      where: { id: userId }
    });
    
    if (!userExists) {
      throw new Error(`User with ID ${userId} not found.`);
    }

    // Check if request code already exists
    const existingRequest = await prisma.requests.findUnique({
      where: { code: formData.code }
    });
    
    if (existingRequest) {
      throw new Error(`Request with code ${formData.code} already exists.`);
    }

    // Update user information
    await prisma.users.update({
      where: { id: userId },
      data: { phone: formData.phone, age: formData.age, weight: formData.weight, allergies: formData.allergies ? formData.allergies : null },
    });

    // Create the request in the database   
    await prisma.requests.create({
      data: {
        code: formData.code,
        user_id: userId,
        weight: formData.weight || 0,
        additional_notes: formData.additional_notes ? formData.additional_notes : null,
        allergies: formData.allergies ? formData.allergies : null,
      },
    });

    if (formData.symptoms && formData.symptoms.length > 0) {
      const symptomData = formData.symptoms.map((symptomId) => ({
        request_code: formData.code,
        symptom_id: symptomId,
      }));

      await prisma.request_symptoms.createMany({ data: symptomData });
    }
    return { success: true };
  } catch (error) {
    console.error(error.message);
    throw new Error("Failed to create request.");
  }
};

export const createRequestMedicines = async (code, medicines) => {
  try {
    // Validate that medicines is an array and not empty
    if (!Array.isArray(medicines)) {
      console.warn(`medicines parameter is not an array: ${typeof medicines}`, medicines);
      return { success: false, message: "Invalid medicines parameter" };
    }
    
    if (medicines.length === 0) {
      console.log("No medicines to create request for");
      return { success: false, message: "No medicines provided" };
    }

    for (const medicine of medicines) {
      await prisma.request_medicines.create({
        data: {
          request_code: code,
          medicine_id: medicine.id,
        },
      });
    }
    return { success: true };
  } catch (error) {
    console.error(error.message);
    throw new Error("Failed to create request medicines.");
  }
};

export const deleteRequest = async (code) => {
  try {
    await prisma.requests.delete({ where: { code } });
    return { success: true };
  } catch (error) {
    console.error(error.message);
    throw new Error("Failed to delete request.");
  }
};

export const giveMedicine = async (weight, age, allergies, symptomIds = [], medicineIds = []) => {
  const pills = [];
  const pillsOutcome = [];

  const allergyList = allergies
    ? allergies.split(",").map((a) => a.trim().toLowerCase())
    : [];

  let allMedicineMatches = [];

  if (medicineIds.length > 0) {
    allMedicineMatches = medicineIds.map((id) => ({ medicine_id: id }));
  }
  
  if (symptomIds.length > 0) {
    for (const symptomId of symptomIds) {
      const matches = await matchSymptoms(symptomId);
      allMedicineMatches.push(...matches);
    }
  }

  for (const match of allMedicineMatches) {
    const medicine = await prisma.medicines.findUnique({
      where: { id: match.medicine_id },
      select: { name: true },
    });

    const medicineName = cleanMedicineName(medicine?.name?.toLowerCase());

    if (allergyList.includes(medicineName)) {
      console.log(`Skipping ${medicineName} due to allergy.`);
      continue;
    }

    // Check if medicine has available stock
    const availableStock = await checkMedicineStock(match.medicine_id);
    if (availableStock <= 0) {
      console.log(`Skipping ${medicineName} due to insufficient stock.`);
      continue;
    }

    const dose = await doseCheck(match.medicine_id, weight, age);

    const alreadyAdded = pills.some(
      (pill) => pill.medicine_id === match.medicine_id
    );

    if (!alreadyAdded) {
      pills.push({ medicine_id: match.medicine_id, amount: 1, dose });
    }
  }

  await dropPills(pills.map(pill => pill.medicine_id));
  for (const pill of pills) {
    await removeStock(pill.medicine_id, pill.amount);
    const data = await getPillData(pill);
    pillsOutcome.push(data);
  }

  return pillsOutcome;
};

export const getPillData = async (pill) => {
  const medicine = await prisma.medicines.findUnique({
    where: { id: pill.medicine_id },
  });

  const instructions = await prisma.medicine_instructions.findMany({
    where: { medicine_id: pill.medicine_id },
  });

  const pillsData = {
    id: pill.medicine_id,
    name: medicine.name,
    quantity: pill.amount + " Pack",
    dose: pill.dose?.dose_amount ? pill.dose.dose_amount + " " + medicine.type : null,
    frequency: pill.dose?.dose_frequency ?? null,
    imageSize: { width: 150, height: 200 },
    imageUrl: medicine.image_url,
    instructions: instructions
      .filter((e) => e.type === "Instruction")
      .map((e) => e.id),
    warnings: instructions
      .filter((e) => e.type === "Warning")
      .map((e) => e.id),
  };
  return pillsData;
};

//Match Symptoms with Medicine
export const matchSymptoms = async (symptomId) => {
  return await prisma.medicine_symptoms.findMany({
    where: { symptom_id: symptomId },
    orderBy: { effectiveness: "asc" },
    select: { medicine_id: true },
  });
};

// Get Perfect Dose from weight
export const doseCheck = async (medicineId, weight, age) => {
  const result = await prisma.medicine_doses.findFirst({
    where: {
      medicine_id: medicineId,
      AND: [
        {
          OR: [
            // Weight-based rule (age fields must be null)
            {
              AND: [
                {
                  OR: [
                    {
                      AND: [
                        { min_weight: { lte: weight } },
                        { max_weight: { gte: weight } },
                      ],
                    },
                    {
                      AND: [
                        { min_weight: { lte: weight } },
                        { max_weight: null },
                      ],
                    },
                    {
                      AND: [
                        { min_weight: null },
                        { max_weight: { gte: weight } },
                      ],
                    },
                  ],
                },
                { min_age: null },
                { max_age: null },
              ],
            },
            // Age-based rule (weight fields must be null)
            {
              AND: [
                {
                  OR: [
                    {
                      AND: [
                        { min_age: { lte: age } },
                        { max_age: { gte: age } },
                      ],
                    },
                    {
                      AND: [
                        { min_age: { lte: age } },
                        { max_age: null },
                      ],
                    },
                    {
                      AND: [
                        { min_age: null },
                        { max_age: { gte: age } },
                      ],
                    },
                  ],
                },
                { min_weight: null },
                { max_weight: null },
              ],
            },
          ],
        },
      ],
    },
    select: {
      dose_frequency: true,
      dose_amount: true,
    },
  });

  if (result) return result;

  // Fallback: lowest available dose if no match found
  return await prisma.medicine_doses.findFirst({
    where: { medicine_id: medicineId },
    orderBy: { dose_amount: 'asc' },
    select: { dose_frequency: true, dose_amount: true },
  });
};

