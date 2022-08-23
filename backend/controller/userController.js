const Errorhandler = require("../utils/errorhandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../models/userModel");
const sendToken = require("../utils/jwttoken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
// Register a user

exports.register = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    aavtar: {
      public_id: "This is a sample id",
      url: "PrfilePicUrl",
    },
  });
  // const token = user.getJWTtoken();
  // res.status(201).json({
  //     success:true,
  //     token,
  // })
  sendToken(user, 201, res);
});

// login a user

exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  //  checking if user given password and email both
  if (!email || !password) {
    return next(new Errorhandler("please Enter Email & password", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new Errorhandler("invalid email or password", 401));
  }
  const isPasswordMatched = user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new Errorhandler("invalid Email or password", 401));
  }

  sendToken(user, 200, res);
});



// logout user AND CANNOT ACESS PRODUCT-

exports.logout = catchAsyncError(async(req,res,next)=>{


res.cookie("token",null,{
  expires:new Date(Date.now()),
  httpOnly:true,
})

  res.status(200).json({
    success:true,
    message:"Logged Out"
  })
})
// Forgot password
exports.forgotPassword = catchAsyncError(async(req,res,next)=>{
  const user = await User.findOne({email:req.body.email});


  if(!user){
    return next (new Errorhandler("User Not Found",404));
  }
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false});

  const resetPasswordUrl = `${req.protocol}://req.get("host)/api/password/reset/${resetToken}`;


  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nif you havae not requested this email then, please ignore it`;
  
  try {
    await sendEmail({
         email:user.email,
         subject:"Ecommerce Password Recovery",
         message,
    });
    res.status(200).json({
      success:true,
      message:`email sent to ${user.email} successfully`,
    })
  }catch(error){
    //  if any eror acure token and cookie will undefined
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({validateBeforeSave:false});

    return next (new Errorhandler(error.message,500))
    
    }
});

exports.resetPassword = catchAsyncError(async(req,res,next)=>{

//creating tokem hash
  const resetPasswordToken = crypto
  .createHash("sha256")
  .update(req.params.token)
  .digest("hex");

const user= await User.findOne({
  resetPasswordToken,resetPasswordExpire:{$gt:Date.now()},
}) ;
if(!user){
  return next(new Errorhandler("reset password Token is invalid or has been expired",400));
}
if(req.body.password !==req.body.confirmPassword){
  return next(new Errorhandler("Password does not match",400))
}

user.password = req.body.password;
user.resetPasswordToken = undefined;
user.resetPasswordExpire = undefined;


await user.save();

sendToken(user,200,res)
});


// gete user detail
// this acces by those user who is login 
exports.getUserDetail = catchAsyncError (async(req,res,next) =>{

  const user = await User.findById(req.user.id);

  res.status(200).json({
    success:true,
    user,
  });

});


// update user password
exports.updatePassword = catchAsyncError (async(req,res,next) =>{

  const user = await User.findById(req.user.id).select("+password");
  const isPasswordMatched = await user.comparePassword(req.body.oldpassword);

  // if ols password not correct
  if(!isPasswordMatched){
    return next(new Errorhandler("old password is incorrect",400));
  }
  // if new and confirm password not match 
  if(req.body.newPassword !== req.body.confirmPassword){
    return next(new Errorhandler("passwaord does note match",400))
  }
  // and if both password are match
  user.password = req.body.newPassword;

  await user.save()

  sendToken(user,200,res)
  

});

// update user profile
exports.updateProfile= catchAsyncError (async(req,res,next) =>{

  const newUserData = {
    name:req.body.name,
    email:req.body.email,


  }
  // cloudinary
  const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
    new:true,
    runValidators:true,
    useFindAndModiyf:false,
    
  });

  res.status(200).json({
success:true,
  });
  

});
// all user onlyl admin can acaces
exports.getAllUser = catchAsyncError(async(req,res,next)=>{

  const users = await User.find();
  res.status(200).
    json({
      success:true,
      users
    })
  
});
// get all user dataill only admin can access
exports.getSingleUserDetail = catchAsyncError(async(req,res,next)=>{

  const user = await User.findById(req.params.id);

  if(!user){
    return next(new Errorhandler(`User not exist with id ${req.params.id}`,404))
  }
  res.status(200).
    json({
      success:true,
      user,
    });
  
});

// update user roel only admin can access
exports.updatUsereProfile= catchAsyncError (async(req,res,next) =>{

  const newUserData = {
    name:req.body.name,
    email:req.body.email,
    role:req.body.role,

  }
 
  const user = await User.findByIdAndUpdate(req.params.id,newUserData,{
    new:true,
    runValidators:true,
    useFindAndModiyf:false,
    
  });

  res.status(200).json({
success:true,
  });
  

});

// detele user --only admin access
exports.deleteUser= catchAsyncError (async(req,res,next) =>{

  const user = await User.findById(req.params.id);
  //remove  cloudinary
  if(!user){
    return next(new Errorhandler(`user not found for this ${re.params.id}`,404))
  }
 
await user.remove();
  res.status(200).json({
success:true,
  });
  

});




