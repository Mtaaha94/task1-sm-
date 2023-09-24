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

const likePost = async (req, res) => {
  // Implement liking a post logic
  try {
    const { postId, userId } = req.body;

    // Check if the user has already liked the post
    const existingLike = await Like.findOne({ postId, userId });

    if (existingLike) {
      return res.status(400).json({ error: 'You have already liked this post' });
    }

    // Create a new like record
    const newLike = await Like.create({ postId, userId });
    res.json(newLike);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
};

const unlikePost = async (req, res) => {
  // Implement unliking a post logic
  try {
    const { postId, userId } = req.body;

    // Check if the user has liked the post
    const existingLike = await Like.findOne({ postId, userId });

    if (!existingLike) {
      return res.status(400).json({ error: 'You have not liked this post' });
    }

    // Delete the like record
    await Like.destroy({ where: { postId, userId } });
    res.json({ message: 'Post unliked successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
};

module.exports = {
  likePost,
  unlikePost,
};
