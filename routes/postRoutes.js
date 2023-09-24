const express = require('express');
const postController = require('../controllers/postController');

const router = express.Router();

// Create a new post
router.post('/', postController.createPost);

// Get all posts
router.get('/',postController.getPosts);

// Update a post
router.put('/:post_id', postController.updatePost);

// Delete a post
router.delete('/:post_id', postController.deletePost);
router.post('/posts/:postId/like', postController.likePost);

module.exports = router;
