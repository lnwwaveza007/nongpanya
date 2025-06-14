import prisma from "../config/prismaClient.js";
import { dropPills } from "./boardServices.js";
import { removeStock } from "./medstockServices.js";

export const getPillsData = async (pills) => {
  const medicine = await prisma.medicines.findUnique({
    where: { id: pills.medicine_id },
  });

  const instructions = await prisma.medicine_instructions.findMany({
    where: { medicine_id: pills.medicine_id },
  });

  pillsData = {
    name: medicine.name,
    quantity: pills.amount,
    frequency: pills.dose.dose_frequency,
    type: medicine.type,
    imageSize: { width: 150, height: 200 },
    imageUrl: medicine.image_url,
    instructions: instructions
      .filter((e) => e.type === "Instruction")
      .map((e) => e.content),
    warnings: instructions
      .filter((e) => e.type === "Warning")
      .map((e) => e.content),
  };
  return pillsData;
};

export const getSymptoms = async () => {
  return await prisma.symptoms.findMany();
};

export const setReqStatus = async (code) => {
  return await prisma.requests.updateMany({
    where: { code },
    data: { status: "completed" },
  });
};

export const createRequest = async (formData, userId) => {
  try {
    await prisma.requests.create({
      data: {
        code: formData.code,
        user_id: userId,
        weight: formData.weight,
        additional_notes: formData.additional_notes,
        allergies: formData.allergies,
      },
    });

    const symptomData = formData.symptoms.map((symptomId) => ({
      request_code: formData.code,
      symptom_id: symptomId,
    }));

    await prisma.request_symptoms.createMany({ data: symptomData });

    return { success: true };
  } catch (error) {
    console.error(error.message);
    throw new Error("Failed to create request.");
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


const cleanMedicineName = (name) => {
  return name.replace(/\s\d+\s*(mg|ml|g|mcg|kg|l|mg\/ml|IU|units)$/i, '');
};

export const giveMedicine = async (symptoms, weight, allergies) => {
  const pills = [];
  const pillsOutcome = [];
  const allergyList = allergies
    ? allergies.split(",").map((a) => a.trim().toLowerCase())
    : [];
  for (const e of symptoms) {
    const matchs = await matchSymptoms(e);
    for (const m of matchs) {
      const [medicineInfo] = await connection
        .promise()
        .query(`SELECT name FROM medicines WHERE id = ?`, [m.medicine_id]);
      const medicineName = cleanMedicineName(medicineInfo[0]?.name?.toLowerCase());
      console.log(medicineName, allergyList);
      if (allergyList.includes(medicineName)) {
        console.log(`Skipping ${medicineName} due to allergy.`);
        continue;
      }

      const dose = await doseCheck(m.medicine_id, weight);
      const amount = await doseToAmount(m.medicine_id, dose.dose_amount);
      if (pills.every((e) => e.medicine_id !== m.medicine_id)) {
        pills.push({ medicine_id: m.medicine_id, amount: amount, dose: dose });
      }
    }
  }

  for (const p of pills) {
    await dropPills(p.medicine_id, p.amount);
    removeStock(p.medicine_id, p.amount);
    pillsOutcome.push(await getPillsData(p));
  }

  return pillsOutcome;
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
export const doseCheck = async (medicineId, weight) => {
  const result = await prisma.medicine_doses.findFirst({
    where: {
      medicine_id: medicineId,
      AND: [
        { OR: [{ min_weight: { lte: weight } }, { min_weight: null }] },
        { OR: [{ max_weight: { gte: weight } }, { max_weight: null }] },
      ],
    },
    select: { dose_frequency: true, dose_amount: true },
  });

  if (result) return result;

  return await prisma.medicine_doses.findFirst({
    where: {
      medicine_id: medicineId,
      dose_amount: {
        lt: await prisma.medicine_doses
          .aggregate({
            where: { medicine_id: medicineId },
            _max: { dose_amount: true },
          })
          .then((res) => res._max.dose_amount),
      },
    },
    select: { dose_frequency: true, dose_amount: true },
  });
};

// Get Pills Amount from Perfect Dose
export const doseToAmount = async (medicineId, okDose) => {
  const medicine = await prisma.medicines.findUnique({
    where: { id: medicineId },
    select: { strength: true },
  });

  return (okDose / medicine.strength) * 2;
};

