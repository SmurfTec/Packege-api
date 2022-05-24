const AppError = require('../helpers/appError');
const catchAsync = require('../helpers/catchAsync');
const PostServices = require('../services/postServices');
const {
  postValidation,
  postUpdateValidation,
} = require('../validations/postValidations');
const Category = require('../models/Category');

exports.getPosts = catchAsync(async (req, res, next) => {
  const { posts } = await PostServices.GetAll(req.query);

  console.log(' here ');
  res.status(200).json({
    status: 'success',
    length: posts.length,
    posts,
  });
});

exports.getMyPosts = catchAsync(async (req, res, next) => {
  const { posts } = await PostServices.GetMyPosts(req.user._id, req.query);

  res.status(200).json({
    status: 'success',
    length: posts.length,
    posts,
  });
});

exports.createPost = catchAsync(async (req, res, next) => {
  const validate = postValidation.validate(req.body);
  if (validate.error) {
    return next(new AppError(validate.error, 400));
  }

  const { post } = await PostServices.Create(req.body, req.user._id);

  await PostServices.populate(post, {
    path: 'categories',
    model: Category,
  });

  res.status(201).json({
    status: 'success',
    post,
  });
});

exports.getPost = catchAsync(async (req, res, next) => {
  const { post } = await PostServices.GetSingle(req.params.id, next);

  res.status(200).json({
    status: 'success',
    post: post,
  });
});

exports.updatePost = catchAsync(async (req, res, next) => {
  const validate = postUpdateValidation.validate(req.body);
  if (validate.error) {
    return next(new AppError(validate.error, 400));
  }
  const { post } = await PostServices.Update(
    req.params.id,
    req.user._id,
    req.body,
    next
  );

  res.status(200).json({
    status: 'success',
    post,
  });
});

exports.deletePost = catchAsync(async (req, res, next) => {
  console.log('req.params', req.params);

  const { post } = await PostServices.Delete(req.params.id, req.user._id, next);

  res.status(200).json({
    status: 'success',
    post,
  });
});
