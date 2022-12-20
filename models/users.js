const db = require("../db");

const getAllUser = async (params) => {
  const { limit, page } = params;
  return await db`SELECT * FROM users ${
    sort ? db`ORDER BY id DESC` : db`ORDER BY id ASC`
  } LIMIT ${limit} OFFSET ${limit * (page - 1)} `;
};

module.exports = { getAllUser };
