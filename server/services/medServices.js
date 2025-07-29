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
  // Ensure medId is an integer
  const medIdInt = parseInt(medId, 10);
  
  const medInfo = await prisma.medicine_instructions.findMany({
    where: { medicine_id: medIdInt },
  });
  return medInfo;
};

export const getMedicineDescriptions = async (medId) => {
  // Ensure medId is an integer
  const medIdInt = parseInt(medId, 10);
  
  const descriptions = await prisma.medicine_descriptions.findMany({
    where: { medicine_id: medIdInt },
  });
  return descriptions;
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
        symptom_id: parseInt(symptomId, 10),
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
          medicine_id: parseInt(medicine.id, 10),
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
    allMedicineMatches = medicineIds.map((id) => ({ medicine_id: parseInt(id, 10) }));
  }
  
  if (symptomIds.length > 0) {
    for (const symptomId of symptomIds) {
      const matches = await matchSymptoms(symptomId);
      allMedicineMatches.push(...matches);
    }
  }

  for (const match of allMedicineMatches) {
    // Convert medicine_id to integer to ensure type compatibility
    const medicineId = parseInt(match.medicine_id, 10);
    const medicine = await prisma.medicines.findUnique({
      where: { id: medicineId },
      select: { name: true },
    });

    const medicineName = cleanMedicineName(medicine?.name?.toLowerCase());

    if (allergyList.includes(medicineName)) {
      console.log(`Skipping ${medicineName} due to allergy.`);
      continue;
    }

    // Check if medicine has available stock
    const availableStock = await checkMedicineStock(medicineId);
    if (availableStock <= 0) {
      console.log(`Skipping ${medicineName} due to insufficient stock.`);
      continue;
    }

    const alreadyAdded = pills.some(
      (pill) => pill.medicine_id === medicineId
    );

    if (!alreadyAdded) {
      pills.push({ medicine_id: medicineId, amount: 1 });
    }
  }

  if (pills.length === 0) {
    throw new Error("No medicines available.");
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
  // Ensure medicine_id is an integer
  const medicineId = parseInt(pill.medicine_id, 10);
  const medicine = await prisma.medicines.findUnique({
    where: { id: medicineId },
  });

  const instructions = await prisma.medicine_instructions.findMany({
    where: { medicine_id: medicineId },
  });

  const descriptions = await prisma.medicine_descriptions.findMany({
    where: { medicine_id: medicineId },
  });

  const pillsData = {
    id: medicineId,
    name: medicine.name,
    quantity: pill.amount + " Pack",
    // dose: pill.dose?.dose_amount ? pill.dose.dose_amount + " " + medicine.type : null,
    // frequency: pill.dose?.dose_frequency ?? null,
    imageSize: { width: 150, height: 200 },
    imageUrl: medicine.image_url,
    instructions: instructions
      .filter((e) => e.type === "Instruction")
      .map((e) => e.id),
    warnings: instructions
      .filter((e) => e.type === "Warning")
      .map((e) => e.id),
    descriptions: descriptions.map((e) => e.id),
  };
  return pillsData;
};

//Match Symptoms with Medicine
export const matchSymptoms = async (symptomId) => {
  // Ensure symptom_id is an integer
  const symptomIdInt = parseInt(symptomId, 10);
  return await prisma.medicine_symptoms.findMany({
    where: { symptom_id: symptomIdInt },
    orderBy: { effectiveness: "asc" },
    select: { medicine_id: true },
  });
};

