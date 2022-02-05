const express = require('express');
const postController = require('../controllers/postController');
const protect = require('../middlewares/protect');
const restrictTo = require('../middlewares/restrictTo');

const router = express.Router();

router
  .route('/')
  .get(protect, restrictTo('admin'), postController.getFaqs)
  .post(postController.createFaq);

module.exports = router;
