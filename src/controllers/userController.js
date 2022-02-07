const catchAsync = require('../helpers/catchAsync');
const UserServices = require('../services/userServices');
const {
  updateValidation,
  contactValidation,
  subscribeValidation,
  faqValidation,
} = require('../validations/userValidations');
const AppError = require('../helpers/appError');

exports.setMe = catchAsync(async (req, res, next) => {
  // console.log(`req.headers.origin`, req.headers.origin);
  req.params.id = req.user._id;
  next();
});

// admin
exports.getAllUsers = catchAsync(async (req, res) => {
  const { users } = await UserServices.Users(req.query);

  res.status(200).json({
    status: 'success',
    results: users.length,
    users,
  });
});

exports.getMe = catchAsync(async (req, res) => {
  const { user } = await UserServices.Me(req.user._id, req.user.role);

  res.status(200).json({
    status: 'success',
    user,
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const { user } = await UserServices.User(req.params._id, next);

  res.status(200).json({
    status: 'success',
    user,
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  const validate = updateValidation.validate(req.body);
  if (validate.error) {
    return next(new AppError(validate.error, 400));
  }

  const { updatedUser } = await UserServices.UpdateMe(
    req.user._id,
    req.body,
    next
  );

  res.status(200).json({
    status: 'success',
    user: updatedUser,
  });
});

// admin only

exports.deleteUser = catchAsync(async (req, res, next) => {
  const { deletedUser } = await UserServices.DeleteUser(req.params._id, next);

  res.status(200).json({
    status: 'success',
    user: deletedUser,
  });
});

//* CONTACT

exports.createContact = catchAsync(async (req, res, next) => {
  const validate = contactValidation.validate(req.body);
  if (validate.error) {
    return next(new AppError(validate.error, 400));
  }

  const { contact } = await UserServices.createContact(req.body);

  res.status(200).json({
    status: 'success',
    contact,
  });
});

exports.getContacts = catchAsync(async (req, res, next) => {
  const { contacts } = await UserServices.getContacts();

  res.status(200).json({
    status: 'success',
    length: contacts.length,
    contacts,
  });
});

//* FAQs

exports.createFaq = catchAsync(async (req, res, next) => {
  const validate = faqValidation.validate(req.body);
  if (validate.error) {
    return next(new AppError(validate.error, 400));
  }

  const { faq } = await UserServices.createFaq(req.body);

  res.status(200).json({
    status: 'success',
    faq,
  });
});

exports.getFaqs = catchAsync(async (req, res, next) => {
  const { faqs } = await UserServices.getFaqs();

  res.status(200).json({
    status: 'success',
    length: faqs.length,
    faqs,
  });
});

exports.updateFaq = catchAsync(async (req, res, next) => {
  const { faq } = await UserServices.UpdateFaq(req.params.id, req.body, next);

  res.status(200).json({
    status: 'success',
    faq,
  });
});

exports.deleteFaq = catchAsync(async (req, res, next) => {
  const { faq } = await UserServices.DeleteFaq(req.params.id, next);

  res.status(200).json({
    status: 'success',
    faq,
  });
});

//* Subscription

exports.subscribe = catchAsync(async (req, res, next) => {
  const validate = subscribeValidation.validate(req.body);
  if (validate.error) {
    return next(new AppError(validate.error, 400));
  }

  const { subscribe } = await UserServices.Subscribe(req.body);

  res.status(200).json({
    status: 'success',
    subscribe,
  });
});
