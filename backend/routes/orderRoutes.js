const express = require("express");
const {newOrder} = require("../controller/oderController");
const router = express.Router();
const { isAuthantticatedUser,authorizeRoles } = require("../middleware/auth");


router.route("/order/new").post(isAuthantticatedUser ,newOrder);

module.exports = router