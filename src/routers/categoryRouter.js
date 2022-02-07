const express = require('express');

const categoryController = require('../controllers/CategoryController');
const protect = require('../middlewares/protect');
const restrictTo = require('../middlewares/restrictTo');

const router = express.Router();

router.route('/').get(categoryController.getAllCategories);

router.use(protect);
router.use(restrictTo('admin'));

router.route('/').post(categoryController.createCategory);
router
  .route('/:id')
  .get(categoryController.getCategory)
  .patch(categoryController.updateCategory)
  .delete(categoryController.deleteCategory);

module.exports = router;
