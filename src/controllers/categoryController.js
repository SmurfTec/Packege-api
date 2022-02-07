const AppError = require('../helpers/appError');
const catchAsync = require('../helpers/catchAsync');
const CategoryServices = require('../services/categoryService');
const { categoryValidation } = require('../validations/userValidations');

exports.getAllCategories = catchAsync(async (req, res, next) => {
  const { categories } = await CategoryServices.GetAll();

  res.status(200).json({
    status: 'success',
    length: categories.length,
    categories: categories,
  });
});

exports.createCategory = catchAsync(async (req, res, next) => {
  const validate = categoryValidation.validate(req.body);
  if (validate.error) {
    return next(new AppError(validate.error, 400));
  }

  const { category } = await CategoryServices.Create(req.body);

  res.status(201).json({
    status: 'success',

    category: category,
  });
});

exports.getCategory = catchAsync(async (req, res, next) => {
  const { category } = await CategoryServices.GetSingle(req.params.id, next);

  res.status(200).json({
    status: 'success',
    category: category,
  });
});

exports.updateCategory = catchAsync(async (req, res, next) => {
  const validate = categoryValidation.validate(req.body);
  if (validate.error) {
    return next(new AppError(validate.error, 400));
  }
  const { category } = await CategoryServices.Update(
    req.params.id,
    req.body,
    next
  );

  res.status(200).json({
    status: 'success',
    category: category,
  });
});

exports.deleteCategory = catchAsync(async (req, res, next) => {
  const { category } = await CategoryServices.Delete(req.params.id);

  res.status(200).json({
    status: 'success',
    category: category,
  });
});
