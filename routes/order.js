const express = require('express');
const router = express.Router();

const {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrderStatus,
  updateStatus
} = require('../controllers/order');
const { isSignedIn, isAdmin, isAutherised } = require('../controllers/auth');
const { getUserById, updatePurchaseList } = require('../controllers/user');
const { getProductById, updateInventory } = require('../controllers/product');

//params
router.param('userId', getUserById);
router.param('productId', getProductById);
router.param('orderId', getOrderById);

//create
router.post(
  '/order/create/:userId',
  isSignedIn,
  isAutherised,
  updateInventory,
  updatePurchaseList,
  createOrder
);

//read
router.get('/orders/:userId', isSignedIn, isAutherised, isAdmin, getAllOrders);

router.get(
  '/order/status/:userId',
  isSignedIn,
  isAutherised,
  isAdmin,
  getOrderStatus
);

//update
router.put(
  '/order/:orderId/status/:userId',
  isSignedIn,
  isAutherised,
  isAdmin,
  updateStatus
);
module.exports = router;
