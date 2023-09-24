const { Client } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const dbClient = new Client({
    user: 'postgres',
    password: 'taaha12',
    host: 'localhost',
    port: 5432, // Default PostgreSQL port
    database: 'social media',
});

dbClient.connect();

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Hash the user's password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user data into the 'users' table
    const insertQuery = `
      INSERT INTO users (username, email, password)
      VALUES ($1, $2, $3)
      RETURNING id;
    `;

    const result = await dbClient.query(insertQuery, [username, email, hashedPassword]);

    const userId = result.rows[0].id;

   

    res.status(201).json({ userId,username,email,password });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Fetch user by email from the 'users' table
    const query = `
      SELECT id, username, email, password FROM users
      WHERE email = $1;
    `;

    const result = await dbClient.query(query, [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }



    res.status(200).json({ userId: user.id,username:user.username, email:user.email , password:user.password  });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
};

// Protected route
const protectedRoute = (req, res) => {
    res.json({ message: 'Protected route accessed successfully' });
  };

module.exports = {
  registerUser,
  loginUser,
  protectedRoute
};
