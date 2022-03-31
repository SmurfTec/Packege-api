const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const catchAsync = require('../helpers/catchAsync');
const AppError = require('../helpers/appError');
const {
  signUpValidation,
  loginValidation,
} = require('../validations/userValidations');
const AuthServices = require('../services/authServices');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    // payload + secret + expire time
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createsendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  // Remove the password from output
  let resUser = user.toObject();
  resUser.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    user: resUser,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const validate = signUpValidation.validate(req.body);
  if (validate.error) {
    return next(new AppError(validate.error, 400));
  }

  // const { user } = await AuthServices.signup(req.body, req.params);
  // createsendToken(user, 201, res);
  const { user } = await AuthServices.signup(req.body, req.query, next);

  res.status(200).json({
    status: 'success',
    user,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const validate = loginValidation.validate(req.body);
  if (validate.error) {
    return next(new AppError(validate.error, 400));
  }
  const { user } = await AuthServices.login(req.body, next);
  createsendToken(user, 200, res);
});

exports.confirmMail = catchAsync(async (req, res, next) => {
  // 1 Hash The Avtivation Link

  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.activationLink)
    .digest('hex');

  await AuthServices.confirmMail(hashedToken, next);

  res.status(200).json({
    status: 'Success',
    message: 'Account has been Activated Successfully !',
  });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1 Check if Email Exists
  const { origin } = req.headers;
  console.log('req.headers :>> ', req.headers);

  const { email } = await AuthServices.forgotPassword(req.body, origin, next);

  res.status(200).json({
    status: 'Success',
    message: `Forget password link successfully sent to your email : ${email}`,
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1 Find the  user based on Token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');

  const { user } = await AuthServices.resetPassword(
    req.body,
    hashedToken,
    next
  );

  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});

//    Update Password for only logged in user

exports.updatePassword = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { user } = await AuthServices.updatePassword(req.body, userId, next);
  // 4) Log user in , send JWT
  createsendToken(user, 200, res);
});
