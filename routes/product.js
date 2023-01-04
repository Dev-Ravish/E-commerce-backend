const express = require('express');
const router = express.Router();
// const { check, validationResult } = require('express-validator');

const {
  getProductById,
  createProduct,
  getProduct,
  getImage,
  getAllProducts,
  updateProduct,
  deleteProduct
} = require('../controllers/product');
const { getUserById } = require('../controllers/user');
const { isSignedIn, isAdmin, isAutherised } = require('../controllers/auth');

//params
router.param('userId', getUserById);
router.param('productId', getProductById);

//create
router.post(
  '/product/create/:userId',
  // [
  //   check('name')
  //     .isLength({ min: 3 })
  //     .withMessage('name must contain atleast 3characters'),
  //   check('description')
  //     .isLength({ min: 10 })
  //     .withMessage('Description is required.'),
  //   check('price').isNumeric().withMessage('Price is a required field.'),
  //   check('stock')
  //     .isNumeric()
  //     .withMessage('Please provide the available stock.'),
  //   check('category')
  //     .isMongoId()
  //     .withMessage('Select the category it falls in.'),
  // ],
  isSignedIn,
  isAutherised,
  isAdmin,
  createProduct
);

//read
router.get('/product/:productId', getProduct);
router.get('/product/image/:productId', getImage);
router.get('/products', getAllProducts);


//update
router.put("/product/:productId/:userId", isSignedIn, isAutherised, isAdmin, updateProduct);

//delete
router.delete("/product/:productId/:userId", isSignedIn, isAutherised, isAdmin, deleteProduct);
module.exports = router;
