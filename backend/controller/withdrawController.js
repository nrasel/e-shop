const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const conversationModel = require("../model/conversation");
const express = require("express");
const ErrorHandler = require("../utils/ErrorHandler");
const { isSellerAuthenticated } = require("../middleware/auth");
const withdrawModel = require("../model/withdrawModel");
const router = express.Router();

// create with request --- only for seller
router.post(
  "/create-withdddraw-request",
  isSellerAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { amount } = req.body;
      const data = {
        seller: req.seller._id,
        amount,
      };
      const withdraw = await withdrawModel.create(data);
      res.status(201).json({
        success: true,
        withdraw,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

router.exports = router;
