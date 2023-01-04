const express = require('express');
const router = express.Router();

const { getUserById } = require('../controllers/user');
const { isAdmin, isAutherised, isSignedIn } = require('../controllers/auth');
const {
  getCategoryById,
  createCategory,
  getCategory,
  getAllCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/category');

router.param('userId', getUserById);
router.param('categoryId', getCategoryById);

//create routers
router.post(
  '/category/create/:userId',
  isSignedIn,
  isAutherised,
  isAdmin,
  createCategory
);

//read routers
router.get('/category/:categoryId', getCategory);
router.get('/category', getAllCategory);

//update routers
router.put(
  '/category/:categoryId/:userId',
  isSignedIn,
  isAutherised,
  isAdmin,
  updateCategory
);

//delete routers
router.delete(
  '/category/:categoryId/:userId',
  isSignedIn,
  isAutherised,
  isAdmin,
  deleteCategory
);

module.exports = router;