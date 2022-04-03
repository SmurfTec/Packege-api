const express = require('express');
const authController = require('../controllers/authController');
const protect = require('../middlewares/protect');

const router = express.Router();

router.post('/signUp', authController.signup);
router.post('/logIn', authController.login);
router.post('/sociallogin', authController.socialLogin);

router.route('/update-password').patch(protect, authController.updatePassword);

router.route('/forgotPassword').post(authController.forgotPassword);
router.route('/confirmMail/:activationLink').get(authController.confirmMail);
router.route('/resetPassword/:resetToken').patch(authController.resetPassword);

module.exports = router;
