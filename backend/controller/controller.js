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

// creat new review or udpdate the review
 
exports.createProductReview = catchAsyncError(async(req,res,next)=>{

  const {rating,comment,productID} = req.body;
  const review ={
    user:req.user._id,
    name:req.user.name,
    rating:Number(rating),//rating must be number
    comment,
  };

  const product = await Product.findById(productID);
  const isReviewd  = product.reviews.find( (rev) => rev.user.toString() === req.user._id.toString());

  if(isReviewd){
      product.reviews.forEach((rev)=>{
        if(rev.user.toString() === req.user._id.toString());
       ( rev.rating = rating),(rev.comment=comment)
      });
  }
  else{ // if not revied by user this happens
    product.reviews.push(review);
    product.numOfReviews = Product.reviews.length

  }

  // find average of reviews
  let avg = 0;
  product.reviews =  product.reviews.forEach(rev => {
    avg +=rev.rating
  })
  
  product.ratings = avg/Product.reviews.length;



  await product.save({validateBeforeSave:false});
res.status(200).json({
  success:true
})
});

// get all reviews for singale product 
exports.getAllReviews = catchAsyncError(async(req,res,next)=>{
  const product = await  Product.findById(req.query.id);

  if(!Product){
    return next(new Errorhandler("Product Not Found",404));
  }
 res.status(200).json({
  success:true,
  reviews:product.reviews,
 })
  
});

// delete review
exports.deleteReview = catchAsyncError(async(req,res,next)=>{
  const product = await Product.findById(req.query.productID);

  if(!Product){
    return next(new Errorhandler("Product Not Found",404));
  }
  // reviews which we don't need
  const reviews = product.reviews.filter((rev)=>rev._id.toString() !== req.query.id.toString());

  
  let avg = 0;
  reviews.forEach(rev => {
    avg +=rev.rating
  })
  
  const ratings = avg/reviews.length;
  const numOfReviews = reviews.length;
  await Product.findByIdAndUpdate(req.query.productID,{reviews,ratings,numOfReviews},{
    new:true,
    runValidators:true,
    useFindAndModify:true,
  });
  res.status(200).json({
    success:true,
  });
});