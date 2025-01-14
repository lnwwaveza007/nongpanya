import connection from "../config/database.js";
import { dropPills } from "./boardModels.js";
import { removeStock } from "./medstockModels.js";

export const getPillsData = async (pills) => {
  const [response1] = await connection
    .promise()
    .query(`SELECT * FROM medicines where id = ?`, [pills.medicine_id]);
  const [response2] = await connection
    .promise()
    .query(`SELECT * FROM medicine_instructions where medicine_id = ?`, [
      pills.medicine_id,
    ]);

  const pillsData = {
    name: response1[0].name,
    quantity: pills.amount,
    frequency: pills.dose.dose_frequency,
    type: response1[0].type,
    imageSize: { width: 150, height: 200 },
    imageUrl: response1[0].image_url,
    instructions: response2
      .filter((e) => e.type === "Instruction")
      .map((e) => e.content),
    warnings: response2
      .filter((e) => e.type === "Warning")
      .map((e) => e.content),
  };
  return pillsData;
};

export const getSymptoms = async () => {
  const [response] = await connection.promise().query(`SELECT * FROM symptoms`);
  return response;
};

export const setReqStatus = async (code) => {
  const [response] = await connection
    .promise()
    .query(`UPDATE requests SET status = 'completed' WHERE code = ?;`, [code]);
  return response[0];
};

export const createRequest = async (formData, userId) => {
  try {
    await connection
      .promise()
      .query(
        `INSERT INTO requests (code, user_id, weight, additional_notes, allergies) VALUES (?, ?, ?, ?, ?)`,
        [
          formData.code,
          userId,
          formData.weight,
          formData.additional_notes,
          formData.allergies,
        ]
      );

    const symptomPromises = formData.symptoms.map((symptomId) =>
      connection
        .promise()
        .query(
          `INSERT INTO request_symptoms (request_code, symptom_id) VALUES (?, ?)`,
          [formData.code, symptomId]
        )
    );
    await Promise.all(symptomPromises);

    return { success: true };
  } catch (error) {
    console.error(error.message);
    throw new Error("Failed to create request.");
  }
};

export const deleteRequest = async (code) => {
  try {
    await connection
      .promise()
      .query(`DELETE FROM requests WHERE code = ?`, [code]);
    return { success: true };
  } catch (error) {
    console.error(error.message);
    throw new Error("Failed to delete request.");
  }
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
      const medicineName = medicineInfo[0]?.name?.toLowerCase();
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
  const [response] = await connection
    .promise()
    .query(
      `select medicine_symptoms.medicine_id from medicine_symptoms where symptom_id = ? order by effectiveness;`,
      [symptomId]
    );
  return response;
};

// Get Perfect Dose from weight
export const doseCheck = async (medicineId, weight) => {
  const [doseResponse] = await connection.promise().query(
    `select dose_frequency,dose_amount from medicine_doses
  where medicine_id = ?
  and (min_weight <= ? or min_weight is null)
  and (max_weight >= ? or max_weight is null)
  LIMIT 1;`,
    [medicineId, weight, weight]
  );
  if (!doseResponse.length) {
    const [fallbackDose] = await connection.promise().query(
      `SELECT dose_frequency, dose_amount FROM medicine_doses
        WHERE medicine_id = ? AND dose_amount < (SELECT MAX(dose_amount)
        FROM medicine_doses
        WHERE medicine_id = ?)
        LIMIT 1;`,
      [medicineId, medicineId]
    );
    return fallbackDose[0];
  }
  return doseResponse[0];
};

// Get Pills Amount from Perfect Dose
export const doseToAmount = async (medicineId, okDose) => {
  const [response] = await connection
    .promise()
    .query(
      `select sum(?/medicines.strength) as "ans" from medicines where medicines.id = ?;`,
      [okDose, medicineId]
    );
  return response[0].ans * 2;
};
