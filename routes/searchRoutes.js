const express = require('express');
const searchController = require('../controllers/searchController');
const router = express.Router();

// Search for posts
router.get('/search', searchController.searchPosts);

module.exports = router;
