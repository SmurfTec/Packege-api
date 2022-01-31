const express = require('express');
const userController = require('../controllers/userController');
const protect = require('../middlewares/protect');
const restrictTo = require('../middlewares/restrictTo');

const router = express.Router();

router
  .route('/')
  .get(protect, restrictTo('admin'), userController.getFaqs)
  .post(userController.createFaq);

module.exports = router;
