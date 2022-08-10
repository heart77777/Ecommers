const Errorhandler = require("../utils/errorhandler");
const catchAsyncError = require("./catchAsyncError");
const jwtoken = require("jsonwebtoken");
const userModel = require("../models/userModel");

exports.isAuthantticatedUser = catchAsyncError(async (req, res, next) => {
  //   now user will only acees product by login only
  const { token } = req.cookies;
  // if user not log in
  if (!token) {
    return next(new Errorhandler("Please Login To Acess This Resource", 401));
  }
  //  if user log in ,1. token is very and then user can acess data
  const decodedData = jwtoken.verify(token, process.env.JWT_SECRET);
  req.user = await userModel.findById(decodedData.id);
  next();
  // console.log(token)
});

// roles admin or user
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new Errorhandler(
          `Role:${req.user.role} is not allowed to acess this resource`,
          403
        )
      );
    }
    next();
  };
};
