const express = require('express');
const commentController = require('../controllers/commentController');

const router = express.Router();

// Create a new comment
router.post('/', commentController.createComment);

// Get comments for a specific post
router.get('/:post_id', commentController.getCommentsForPost);

module.exports = router;
