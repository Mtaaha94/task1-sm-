const express = require('express');
const newsFeedController = require('../controllers/newsFeedController');


const router = express.Router();

// Get the user's news feed
router.get('/feed',  newsFeedController.getUserNewsFeed);

module.exports = router;
