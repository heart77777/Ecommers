const express = require("express");
const { getAllProducts, createProduct,updateProduct,deleteProduct,getProductDetail } = require("../controller/controller");
const { isAuthantticatedUser,authorizeRoles } = require("../middleware/auth");



const router = express.Router();


router.route("/products").get(getAllProducts);
// now here only admin can creat ,delete and update product no oother one can
router.route("/product/new").post(isAuthantticatedUser ,authorizeRoles("admin"),createProduct);

router.route("/product/:id").put(isAuthantticatedUser ,authorizeRoles("admin"),updateProduct).delete(isAuthantticatedUser,authorizeRoles("admin") ,deleteProduct).get(getProductDetail);

// we can wright as to ||
// router.route("/product/:id").put(deleteProduct)
module.exports = router