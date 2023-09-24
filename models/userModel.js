const { Client } = require('pg');
const bcrypt = require('bcrypt');

const dbClient = new Client({
    user: 'postgres',
    password: 'taaha12',
    host: 'localhost',
    port: 5432, // Default PostgreSQL port
    database: 'sm',
});

dbClient.connect();

const createUser = async (username, email, password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO users (username, email, password)
      VALUES ($1, $2, $3)
      RETURNING id;
    `;

    const result = await dbClient.query(query, [username, email, hashedPassword]);
    return result.rows[0].id;
  } catch (error) {
    throw error;
  }
};

const getUserByEmail = async (email) => {
  try {
    const query = `
      SELECT * FROM users
      WHERE email = $1;
    `;

    const result = await dbClient.query(query, [email]);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createUser,
  getUserByEmail,
};
