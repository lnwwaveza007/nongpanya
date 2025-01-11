import connection from "../config/database.js";

export const getSymptoms = async () => {
  const [response] = await connection.promise().query(`SELECT * FROM symptoms`);
  return response;
};

export const createRequest = async (userId, weight, note) => {
  const [response] = await connection
    .promise()
    .query(
      `INSERT INTO request (user_id, weight, additional_notes) VALUES (?, ?, ?, ?)`,
      [userId, weight, note]
    );
  const [response3] = await connection
    .promise()
    .query(`INSERT INTO request (request_id, symptom_id) VALUES (?, ?, ?, ?)`, [
      userId,
      weight,
      note,
    ]);
  return response;
};

// Get Perfect Dose from weight
export const doseCheck = async (medicineId,weight) => {
  const [response] = await connection
    .promise()
    .query(
      `select medicine_doses.dose_amount from medicine_doses
where medicine_id = ?
  and (min_weight < ? or min_weight is null)
  and (max_weight > ? or max_weight is null);`,
      [medicineId, weight, weight]
    );
  return response[0].dose_amount;
}

// Get Pills Amount from Perfect Dose
export const doseToAmount = async (medicineId, okDose) => {
  const [response] = await connection
    .promise()
    .query(
      `select sum(?/medicines.strength) as "ans" from medicines where medicines.id = ?;`,
      [okDose, medicineId]
    );
  return response[0].ans;
}