const mongoose = require("mongoose");

const ProductSchema = new  mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Product Name"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "please Enter Prouct Description"],
  },
  price: {
    type: Number,
    required: [true, "please Enter Prouct Price"],
    maxLength: [8, "Price cannot exceed 8 character"],
  },
  ratings: { //over all product rating 
    type: Number,
    defult: 0,
  },
  // images are in object
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, "Please Enter Product Category"],
  },
  Stock: {
    type: Number,
    required: [true, "Please Enter product stock"],
    maxLength: [4, "Stock cannot excced 4 Characters"],
    default: 1,
  },
  numOfReviews: {
    type: Number,
    defult: 0,
  },
  // revies are in object
  reviews: [
    {
      user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true,
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      Comment: {
        type: String,
        required: true,
      },
    },
  ],
  user:{
    type:mongoose.Schema.ObjectId,
    ref:"User",
    required:true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("product", ProductSchema);
