const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const protect = require('../middlewares/protect');
const restrictTo = require('../middlewares/restrictTo');

const router = express.Router();

router
  .route('/me')
  .get(protect, userController.getMe)
  .patch(protect, userController.updateMe);

router.route('/').get(protect, restrictTo('admin'), userController.getAllUsers);

router.patch('/updatePassword', protect, authController.updatePassword);

router.post('/subscribe', userController.subscribe);

router
  .route('/contact')
  .get(protect, restrictTo('admin'), userController.getContacts)
  .post(userController.createContact);

router
  .route('/:id')
  .get(protect, userController.getUser)
  .delete(protect, restrictTo('admin'), userController.deleteUser);

module.exports = router;
