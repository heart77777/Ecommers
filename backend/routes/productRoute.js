const express = require("express");
const { getAllProducts, createProduct,updateProduct,deleteProduct,getProductDetail, createProductReview, getAllReviews, deleteReview } = require("../controller/controller");
const { isAuthantticatedUser,authorizeRoles } = require("../middleware/auth");



const router = express.Router();


router.route("/products").get(getAllProducts);
// now here only a  dmin can creat ,delete and update product no oother one can
router.route("/admin/product/new").post(isAuthantticatedUser ,authorizeRoles("admin"),createProduct);

router.route("/admin/product/:id").put(isAuthantticatedUser ,authorizeRoles("admin"),updateProduct).delete(isAuthantticatedUser,authorizeRoles("admin") ,deleteProduct)

router.route("/product/product/:id").get(getProductDetail)
router.route("/review").put(isAuthantticatedUser,createProductReview)
router.route("/reviews").get(getAllReviews).delete(isAuthantticatedUser,deleteReview)
// we can wright as to ||
// router.route("/product/:id").put(deleteProduct)
module.exports = router