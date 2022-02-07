const express = require('express');
const postController = require('../controllers/postController');
const protect = require('../middlewares/protect');
const restrictTo = require('../middlewares/restrictTo');

const router = express.Router();

router
  .route('/')
  .get(postController.getPosts)
  .post(protect, postController.createPost);

router.route('/my').get(protect, postController.getMyPosts);

router
  .route('/:id')
  .patch(protect, postController.updatePost)
  .delete(protect, postController.deletePost);

module.exports = router;
