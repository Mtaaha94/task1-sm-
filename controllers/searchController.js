const { Client } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const dbClient = new Client({
  user: 'postgres',
  password: 'taaha12',
  host: 'localhost',
  port: 5432, // Default PostgreSQL port
  database: 'sm',
});

dbClient.connect();

const searchPosts = async (req, res) => {
  try {
    const { query } = req.query; // Get the search query from the request

    // Search for posts containing the query keyword
    const searchQuery = `
      SELECT * FROM posts
      WHERE content ILIKE $1
    `;

    const searchResult = await dbClient.query(searchQuery, [`%${query}%`]);

    res.json(searchResult.rows);
  } catch (error) {
    console.error('Error searching posts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  searchPosts,
};
