const { Client } = require('pg');
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

const createComment = async (req, res) => {
  try {
    const { user_id, post_id, content } = req.body;

    // Insert a new comment into the 'comments' table
    const insertQuery = `
      INSERT INTO comments (user_id, post_id, content)
      VALUES ($1, $2, $3)
      RETURNING comment_id;
    `;

    const result = await dbClient.query(insertQuery, [user_id, post_id, content]);

    const commentId = result.rows[0].comment_id;

    res.status(201).json({ commentId, content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create a comment' });
  }
};

const getCommentsForPost = async (req, res) => {
  try {
    const { post_id } = req.params;

    // Retrieve comments for a specific post from the 'comments' table
    const selectQuery = 'SELECT * FROM comments WHERE post_id = $1';
    const result = await dbClient.query(selectQuery, [post_id]);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve comments' });
  }
};

module.exports = {
  createComment,
  getCommentsForPost,
};
