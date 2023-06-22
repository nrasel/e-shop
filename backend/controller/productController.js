const express = require("express");
const router = express.Router();
const { upload } = require("../multer");
const productModel = require("../model/productModel");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const shopModel = require("../model/shopModel");
const { isSellerAuthenticated } = require("../middleware/auth");

// create product
router.post(
  "/create-product",
  upload.array("images"),
  catchAsyncErrors(async (req, res, next) => {
    const shopId = req.body.shopId;
    const shop = await shopModel.findById(shopId);
    try {
      if (!shop) {
        return next(new ErrorHandler("Shop Id is invalid!", 500));
      } else {
        const files = req.files;
        const imageUrls = files.map((file) => `${file.filename}`);
        const productData = req.body;
        productData.images = imageUrls;
        productData.shop = shop;
        const product = await productModel.create(productData);

        res.status(201).json({
          success: true,
          product,
        });
      }
    } catch (error) {
      console.log(error);
      return next(new ErrorHandler(error, 400));
    }
  })
);

// get all products of a shop
router.get(
  "/get-all-products-shop/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await productModel.find({ shopId: req.params.id });

      res.status(201).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// delete sproduct of a shop
router.delete(
  "/delete-shop-product/:id",
  isSellerAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const productId = req.params.id;
      const product = await productModel.findByIdAndDelete(productId);
      if (!product) {
        return next(new ErrorHandler("Product not found with this id!", 500));
      }
      res.status(201).json({
        success: true,
        message: "Product Deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// delete product of a shop

module.exports = router;
