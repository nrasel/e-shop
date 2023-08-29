const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const messageModel = require("../model/messagesModel");
const express = require("express");
const ErrorHandler = require("../utils/ErrorHandler");
const router = express.Router();

// create new message
router.post(
  "/create-new-message",
  upload.array("image"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const messageData = req.body;
      if (req.files) {
        const files = req.files;
        const imageUrl = files.map((file) => `${file.fileName}`);

        messageData.images = imageUrl;
      }
      messageData.conversationId = req.body.conversationId;
      messageData.sender = req.body.sender;

      const message = new Messages({
        conversationId: messageData.conversationId,
        sender: messageData.sender,
        images: messageData.images ? messageData.images : undefined,
      });
      await message.save(
        res.status(201).json({
          success: true,
          message,
        })
      );
    } catch (error) {
      return next(new ErrorHandler(error.response.message), 500);
    }
  })
);

module.exports = router;
