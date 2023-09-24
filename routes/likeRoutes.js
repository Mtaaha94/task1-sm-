const express = require('express');
const likeController = require('../controllers/likeController');

const router = express.Router();

// Like a post
router.post('/like',likeController.likePost);

// Unlike a post
router.delete('/unlike/:postId',likeController.unlikePost);

module.exports = router;
