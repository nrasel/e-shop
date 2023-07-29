const express = require("express");
const router = express.Router();
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const coupounCode = require("../model/coupounCodeModel");
const coupounCodeModel = require("../model/coupounCodeModel");
const { isSellerAuthenticated } = require("../middleware/auth");

// create coupoun code
router.post(
  "/create-coupon-code",
  isSellerAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const isCoupounCodeExists = await coupounCodeModel.find({
        name: req.body.name,
      });

      if (isCoupounCodeExists.length !== 0) {
        return next(new ErrorHandler("Coupoun code already exists!", 400));
      }
      const coupouncode = await coupounCodeModel.create(req.body);

      res.status(201).json({
        success: true,
        coupounCode,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// get all coupons of a shop
router.get(
  "/get-coupon/:id",
  isSellerAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const couponCodes = await coupounCodeModel.find({
        shopId: req.params.id,
      });
      res.status(201).json({
        success: true,
        couponCodes,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);
// delete coupons
router.delete(
  "/delete-coupon/:id",
  isSellerAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const couponCode = await coupounCodeModel.findByIdAndDelete(
        req.params.id
      );
      if (!couponCode) {
        return next(new (ErrorHandler("Coupon code doesn't exists!", 400))());
      }
      res.status(201).json({
        success: true,
        message: "Coupon code deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// get coupon code value by its name
router.get(
  "/get-coupon-value/:name",
  catchAsyncErrors(async (req, res, next) => {
    console.log(req.params);
    try {
      const couponCode = await coupounCodeModel.findOne({
        name: req.params.name,
      });

      console.log(couponCode);
      res.status(200).json({
        success: true,
        couponCode,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

module.exports = router;
