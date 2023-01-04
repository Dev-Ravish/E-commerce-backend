const express = require("express");
const router = express.Router();

const {getUserById, getUser, updateUser, userPurchaseList} = require("../controllers/user");
const {isSignedIn, isAutherised, isAdmin} = require("../controllers/auth");

router.param("userId", getUserById);

router.get("/user/:userId",isSignedIn, isAutherised, getUser);
router.put("/user/:userId",isSignedIn, isAutherised, updateUser );
router.put("/order/user/:userId",isSignedIn, isAutherised, userPurchaseList );

module.exports = router ;