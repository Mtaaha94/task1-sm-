const express = require('express');
const { Client } = require('pg');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const commentRoutes = require('./routes/commentRoutes');
const LikeRoutes = require('./routes/likeRoutes')
const NewsFeedRoutes = require("./routes/newsFeedRoutes")
const searchRoutes = require('./routes/searchRoutes')

// Database connection configuration
const dbConfig = {
  user: 'postgres',
  password: 'taaha12',
  host: 'localhost',
  port: 5432, // Default PostgreSQL port
  database: 'sm',
};

// Create a new PostgreSQL client
const dbClient = new Client(dbConfig);

dbClient.connect()
  .then(() => {
    console.log('Connected to PostgreSQL database');
  })
  .catch((error) => {
    console.error('Error connecting to PostgreSQL database:', error);
  });

// Initialize Express
const app = express();

dotenv.config();

app.use(bodyParser.json());
app.use(cookieParser());


// Middleware to verify and extract JWT tokens from "Bearer" format
const verifyTokenMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
  
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7); // Remove 'Bearer ' from the token
      jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
        if (error) {
          return res.sendStatus(403); // Forbidden
        }
        req.user = user;
        next();
      });
    } else {
      res.sendStatus(401); // Unauthorized
    }
  };
  app.get('/profile', verifyTokenMiddleware, (req, res) => {
    // This route is protected and can only be accessed with a valid token
    res.status(200).json(req.user);
  });
    

app.use('/auth', authRoutes);
app.use('/post',  postRoutes);
// Use commentRoutes for comment creation and retrieval
app.use('/comment',  commentRoutes);
app.use('/likes', LikeRoutes)
app.use('/newsFeed', NewsFeedRoutes)
app.use('/search', searchRoutes)
// Define a route for testing the database connection
app.get('/', (req, res) => {
  dbClient.connect()
    .then(() => {
      console.log('Connected to PostgreSQL database');
      res.send('Connected to PostgreSQL database');
    })
    .catch((error) => {
      console.error('Error connecting to PostgreSQL database:', error);
      res.status(500).send('Error connecting to PostgreSQL database');
    });
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
