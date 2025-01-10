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
