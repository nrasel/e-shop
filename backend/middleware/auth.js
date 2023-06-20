const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const userModel = require("../model/userModel");
const shopModel = require("../model/shopModel");

exports.isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;
  // console.log(token);

  if (!token) {
    return next(new ErrorHandler("Please login to continue"));
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  req.user = await userModel.findById(decoded.id);
  next();
});

exports.isSellerAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { seller_token } = req.cookies;
  // console.log(seller_token);
  if (!seller_token) {
    return next(new ErrorHandler("Please login to continue"));
  }
  const decoded = jwt.verify(seller_token, process.env.JWT_SECRET_KEY);
  console.log(decoded);
  req.seller = await shopModel.findById(decoded?.id);
  next();
});
