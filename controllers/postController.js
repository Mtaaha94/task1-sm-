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

const createPost = async (req, res) => {
  try {
    const { user_id, content } = req.body;

    // Insert a new post into the 'posts' table
    const insertQuery = `
      INSERT INTO posts (user_id, content)
      VALUES ($1, $2)
      RETURNING post_id;
    `;

    const result = await dbClient.query(insertQuery, [user_id, content]);

    const postId = result.rows[0].post_id;

    res.status(201).json({ postId, content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create a post' });
  }
};

const getPosts = async (req, res) => {
  try {
    // Retrieve all posts from the 'posts' table
    const selectQuery = 'SELECT * FROM posts';
    const result = await dbClient.query(selectQuery);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve posts' });
  }
};

const updatePost = async (req, res) => {
  try {
    const { post_id, content } = req.body;

    // Update the post with the new content
    const updateQuery = `
      UPDATE posts
      SET content = $1
      WHERE post_id = $2;
    `;

    await dbClient.query(updateQuery, [content, post_id]);

    res.status(200).json({ message: 'Post updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update the post' });
  }
};

const deletePost = async (req, res) => {
  try {
    const { post_id } = req.params;

    // Delete the post with the given post_id
    const deleteQuery = `
      DELETE FROM posts
      WHERE post_id = $1;
    `;

    await dbClient.query(deleteQuery, [post_id]);

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete the post' });
  }
};

// Controller function to like a post
const likePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.body.userId; // Assuming userId is sent in the request body

    // Check if the user has already liked the post
    const checkQuery = 'SELECT * FROM likes WHERE post_id = $1 AND user_id = $2';
    const checkValues = [postId, userId];
    const checkResult = await dbClient .query(checkQuery, checkValues);

    if (checkResult.rows.length > 0) {
      return res.status(400).json({ error: 'User already liked this post' });
    }

    // If the user hasn't liked the post, add a new like
    const likeQuery = 'INSERT INTO likes (post_id, user_id) VALUES ($1, $2) RETURNING *';
    const likeValues = [postId, userId];
    const likeResult = await dbClient .query(likeQuery, likeValues);

    if (likeResult.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json({ message: 'Post liked successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error liking the post' });
  }
};

module.exports = {
  createPost,
  getPosts,
  updatePost,
  deletePost,
  likePost
};
