// const { json } = require("body-parser")
const productModal = require("../models/productModal");
const Product = require("../models/productModal");
const Errorhandler = require("../utils/errorhandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const ApiFeatures = require("../utils/apifeatures");




// Creat Product ---- only admin
exports.createProduct = catchAsyncError(async (req, res, next) => 
{
  req.body.user = req.user.id
  const Product = await productModal.create(req.body);

  res.status(201).json({
    success: true,
    Product,
  });
});



// get product all

exports.getAllProducts = catchAsyncError(async (req, res) => {
  const resultPerPage = 5;
  const productCount = await productModal.countDocuments();
 const apifeature = new  ApiFeatures(productModal.find(),req.query).search().filter().Pagination(resultPerPage);
  const Products = await apifeature.query;
  res.status(200).json({
    success: true,
    Products,
  });
});



// get produt detail
exports.getProductDetail = catchAsyncError(async (req, res, next) => {
  const Product = await productModal.findById(req.params.id);

  if (!Product) {
    return next(new Errorhandler("Product Not Found", 404));
  }
  res.status(200).json({
    success: true,
    Product,
    productCount,
  });
});




// Update Product---Admin
exports.updateProduct = catchAsyncError(async (req, res, next) => {
  let Product = productModal.findById(req.params.id);

  if (!Product) {
    return res.status(500).json({
      success: false,
      message: "product not Found",
    });
  }
  Product = await productModal.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    Product,
  });
});



// delete Product --- onlyadmin can acess
exports.deleteProduct = catchAsyncError(async (req, res, next) => {
  const Product = productModal.findById(req.params.id);
  if (!Product) {
    return res.status(500).json({
      success: false,
      message: "Product not Found",
    });
  }
  await productModal.remove();
});
