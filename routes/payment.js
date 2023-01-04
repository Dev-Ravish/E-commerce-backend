const express = require('express');
const router = express.Router();

const { isAutherised, isSignedIn } = require('../controllers/auth');
const {getToken, processPayment} = require('../controllers/payment');
const { getUserById } = require('../controllers/user');

router.param('userId', getUserById);

router.get('/payment/getToken/:userId', isSignedIn, isAutherised, getToken);
router.get('/payment/braintree/:userId', isSignedIn, isAutherised, processPayment);


module.exports = router;
