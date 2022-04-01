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

router.route('/').get(protect, userController.getAllUsers);

router.patch('/updatePassword', protect, authController.updatePassword);

router.post('/subscribe', userController.subscribe);

router
  .route('/contact')
  .get(protect, restrictTo('admin'), userController.getContacts)
  .post(userController.createContact);

router
  .route('/faqs')
  .get(userController.getFaqs)
  .post(protect, restrictTo('admin'), userController.createFaq);

router
  .route('/code')
  .get(protect, userController.getCodes)
  .post(protect, userController.shareCode);
// .post(userController.useCode);

router
  .route('/:id')
  .get(protect, userController.getUser)
  .delete(protect, restrictTo('admin'), userController.deleteUser);

router
  .route('/faqs/:id')
  .patch(protect, restrictTo('admin'), userController.updateFaq)
  .delete(protect, restrictTo('admin'), userController.deleteFaq);

module.exports = router;
