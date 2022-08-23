const Order = require("../models/oderModels");
const Product = require("../models/productModal");
const Errorhandler = require("../utils/errorhandler");
const catchAsyncError = require("../middleware/catchAsyncError");


// craeate odere
exports.newOrder  = catchAsyncError(async(req,res,next)=>{
    const { shippingInfo, orderItems,paymentInfo,itemsprice,taxPrice,shippingPrice,totalInfo} = req.body;

    const order = await Order.create({
        shippingInfo, orderItems,paymentInfo,itemsprice,taxPrice,shippingPrice,totalInfo,paidAt:Date.now(),user:req.user._id,
    });
    res.status(201).json({
        success:true,
        order,
    });
});
// get single Order
exports.getSingleOrder = catchAsyncError(async(req,res,next)=>{
    const order = await Order.findById(req.params.id).populate("user","name, eamil");


    if(!order){
        return next (new Errorhandler("order not found with this ID " ,404));
    }
    res.status(200).json({
        success:true,
        order
    });
});
exports.getSingleOrder = catchAsyncError(async(req,res,next)=>{
    const order = await Order.findById(req.params.id).populate("user","name, eamil");


    if(!order){
        return next (new Errorhandler("order not found with this ID " ,404));
    }
    res.status(200).json({
        success:true,
        order
    });
});