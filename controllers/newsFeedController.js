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

const getUserNewsFeed = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you have a user object in the request

    // Fetch a list of the user's friends
    const friendQuery = `
      SELECT user_id2 FROM friendships WHERE user_id1 = $1
      UNION
      SELECT user_id1 FROM friendships WHERE user_id2 = $1
    `;

    const friendResult = await dbClient.query(friendQuery, [userId]);
    const friendIds = friendResult.rows.map((row) => row.user_id2);

    // Fetch posts from the user's friends, sorted by recent activity
    const newsFeedQuery = `
      SELECT p.* FROM posts p
      WHERE p.user_id IN ($1, $2, ...)  -- Insert friendIds here
      ORDER BY (SELECT MAX(created_at) FROM likes l WHERE l.post_id = p.post_id)
               OR (SELECT MAX(created_at) FROM comments c WHERE c.post_id = p.post_id)
               DESC
    `;

    const newsFeedResult = await dbClient.query(newsFeedQuery, friendIds);

    res.json(newsFeedResult.rows);
  } catch (error) {
    console.error('Error fetching news feed:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getUserNewsFeed,
};
