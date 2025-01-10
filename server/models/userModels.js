import connection from "../config/database.js";

export const findUserById = async (id) => {
  const [response] = await connection
    .promise()
    .query(`SELECT * FROM users WHERE id = ?`, [id]);
  return response;
};

export const createUser = async (id, email, fullname) => {
  const [response] = await connection
    .promise()
    .query(
      `INSERT INTO users (id, email, fullname) VALUES (?, ?, ?)`,
      [id, email, fullname]
    );
  return response;
};
