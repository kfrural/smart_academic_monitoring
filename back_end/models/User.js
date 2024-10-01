const db = require('../config/db');

const User = {
  create: async (email, password) => {
    const result = await db.query('INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *', [email, password]);
    return result.rows[0];
  },
  
  findByEmail: async (email) => {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  }
};

module.exports = User;
