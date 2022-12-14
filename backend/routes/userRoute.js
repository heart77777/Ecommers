const express = require("express");
const { register, loginUser, logout, forgotPassword, getUserDetail, updatePassword, updateProfile, getAllUser, getSingleUserDetail, updatUsereProfile, deleteUser } = require("../controller/userController");
const {isAuthantticatedUser,authorizeRoles} = require("../middleware/auth")
const router = express.Router();



router.route("/register").post(register);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reser/:token").put(forgotPassword);
router.route("/logout").get(logout);
router.route("/password/update").put(isAuthantticatedUser,updatePassword)
router.route("/me").get( isAuthantticatedUser,getUserDetail)
router.route("/me/update").put( isAuthantticatedUser,updateProfile)
router.route("/admin/users").get(isAuthantticatedUser,authorizeRoles("admin"),getAllUser)
router.route("/admin/user/:id").get(isAuthantticatedUser,authorizeRoles("admin"),getSingleUserDetail).put(isAuthantticatedUser,authorizeRoles("admin"),updatUsereProfile).delete(isAuthantticatedUser,authorizeRoles("admin"),deleteUser)
module.exports = router;