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

export const getQouta = async (id) => {
  const [response] = await connection
    .promise()
    .query(`SELECT COUNT(requests.user_id) AS total_requests
FROM requests
WHERE requests.user_id = ?
  AND requests.status = 'completed'
  AND EXTRACT(MONTH FROM requests.created_at) = ?;`, [id, new Date().getMonth()]);
  return response[0].total_requests;
}