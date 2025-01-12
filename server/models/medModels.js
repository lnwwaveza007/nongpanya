import connection from "../config/database.js";

export const getSymptoms = async () => {
  const [response] = await connection.promise().query(`SELECT * FROM symptoms`);
  return response;
};

export const createRequest = async (formData, userId) => {
  try {
    await connection
      .promise()
      .query(
        `INSERT INTO requests (code, user_id, weight, additional_notes, allergies) VALUES (?, ?, ?, ?, ?)`,
        [formData.code, userId, formData.weight, formData.additional_notes, formData.allergies]
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
  const [response] = await connection.promise().query(
    `select medicine_doses.dose_amount from medicine_doses
where medicine_id = ?
  and (min_weight < ? or min_weight is null)
  and (max_weight > ? or max_weight is null);`,
    [medicineId, weight, weight]
  );
  return response[0].dose_amount;
};

// Get Pills Amount from Perfect Dose
export const doseToAmount = async (medicineId, okDose) => {
  const [response] = await connection
    .promise()
    .query(
      `select sum(?/medicines.strength) as "ans" from medicines where medicines.id = ?;`,
      [okDose, medicineId]
    );
  return response[0].ans;
};
