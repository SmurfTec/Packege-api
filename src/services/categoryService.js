const Category = require('../models/Category');
const AppError = require('../helpers/appError');

class CategoryServices {
  //*
  static async GetAll() {
    const categories = await Category.find();
    return { categories };
  }

  //*
  static async GetSingle(Id, next) {
    const category = await Category.findById(Id);
    if (!category)
      return next(new AppError(`Can't find category for id ${Id}`, 404));

    return { category };
  }

  //*
  static async Create(userData) {
    const category = await Category.create(userData);
    return { category };
  }

  //*
  static async AddSubCategory(categoryId, subCategoryId, next) {
    const category = await Category.findById(categoryId);
    if (!category) {
      return next(
        new AppError(`Can't find category for id ${categoryId}`, 404)
      );
    }
    const subCategory = await SubCategory.findById(subCategoryId);
    if (!subCategory) {
      return next(
        new AppError(`Can't find subCategory for id ${subCategoryId}`, 404)
      );
    }
    category.subCategories.push(subCategoryId);
    await category.save();

    return { category };
  }

  //*
  static async Update(Id, body, next) {
    const category = await Category.findByIdAndUpdate(Id, body, {
      new: true,
      runValidators: true,
    });

    if (!category)
      return next(new AppError(`Can't find category for id ${Id}`, 404));

    return { category };
  }

  //*
  static async Delete(Id) {
    const category = await Category.findByIdAndDelete(Id);

    if (!category)
      return next(new AppError(`Can't find category for id ${Id}`, 404));
    return { category };
  }
}

module.exports = CategoryServices;
