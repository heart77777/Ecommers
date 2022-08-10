const mongoose = require("mongoose");
const validator = require("validator");
const bcrpt = require("bcryptjs");
const jwtoken = require("jsonwebtoken");
const crypto = require("crypto");

const userSechema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter your Name"],
    maxLength: [30, "Name Can Not Exceed 30 Characters"],
    minLength: [4, "Name Should Have More Than 4 Charcters"],
  },
  email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    unique: true,
    validate: [validator.isEmail, "Please Enter a valid Email"],
  },
  password: {
    type: String,
    required: [true, "Please Enter Your Password"],
    minLength: [8, "Passowrd Should Not Less Than 8 Charcter"],
    select: false, // use of "select " -> it show all user detial except password
  },
  aavtar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    defult: "user", //can be admin
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});
//  use of Pre===> by use of pre you can do anyhing before saving the documetn in database
userSechema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrpt.hash(this.password, 10);
});

// JW tokken
userSechema.methods.getJWTtoken = function () {
  return jwtoken.sign({ id: this._id }, process.env.JWT_SECRET, {
    // expiresIn =>login in time expires
    expiresIn: process.env.JWT_EXPIRE,
  });
};
// Compare password for log in
userSechema.methods.comparePassword = async function (enterdPassword) {
  return await bcrpt.compare(enterdPassword, this.password);
};
// reset Passward
userSechema.methods.getresetPasswordToken = function () {
  // genrates 20 bites code
  const resetToken = crypto.randomBytes(20).toString("hex");

  // hashing and adding to user schema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordToken = Date.now() + 15 + 60 * 1000;
  return resetToken;
};
module.exports = mongoose.model("user", userSechema);
