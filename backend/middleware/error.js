//  const Errorhandler = require("../utils/errorhandler");
const ErrorHandler = require("../utils/errorhandler");

 module.exports = (err,req,res,next) =>{
    err.statusCode = err.statusCode || 500;
           err.message = err.message || "internal Server Error";


         //   wrong id error or castError
         if(err.name == "CastError"){
            const message = `resource not found .Invalid ${err.path}`
            err = new ErrorHandler(message,400);
         }

         // mongoose dublicate key eror
         if(err.code == 11000){
            const message =`Duplicate ${Object.keys(err.keyValue)} Entered`;
            err = new ErrorHandler(message,400)
         }

         // wromg JWT token
         if(err.name === "jsonWebTokenError"){
            const message = `JSON web token is invalid, try again`;
            err = new ErrorHandler(message,400)
         }
         // jwt expire err
         if(err.name === "TokenExpireError"){
            const message = `token is expire ,try again`;
            err = new ErrorHandler(message,400);
         }
           res.status(err.statusCode).json({
            success:false,
            message:err.message,
           })
 }