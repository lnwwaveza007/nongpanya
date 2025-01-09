import connection from "../config/database.js";

export const findUserById = async (studentId) => {
  const [rows] = await connection
    .promise()
    .query(`SELECT * FROM users WHERE id = ?`, [studentId]);
  return rows;
};

export const createUser = async (studentId, email, firstname, lastname) => {
  const [result] = await connection
    .promise()
    .query(
      `INSERT INTO users (id, email, firstname, lastname) VALUES (?, ?, ?, ?)`,
      [studentId, email, firstname, lastname]
    );
  return result;
};
