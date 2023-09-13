const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const conversationModel = require("../model/conversation");
const express = require("express");
const ErrorHandler = require("../utils/ErrorHandler");
const {
  isSellerAuthenticated,
  isAuthenticated,
} = require("../middleware/auth");
const router = express.Router();

// create a new conversation
router.post(
  "/create-new-conversation",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { groupTitle, userId, sellerId } = req.body;

      const isConversationExist = await conversationModel.findOne({
        groupTitle,
      });

      if (isConversationExist) {
        const conversation = isConversationExist;
        res.status(201).json({
          success: true,
          conversation,
        });
      } else {
        const conversation = await conversationModel.create({
          members: [userId, sellerId],
          groupTitle: groupTitle,
        });

        res.status(201).json({
          success: true,
          conversation,
        });
      }
    } catch (error) {
      return next(new ErrorHandler(error.response.message), 500);
    }
  })
);

// get seller conversation
router.get(
  "/get-all-conversation-seller/:id",
  isSellerAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const conversations = await conversationModel
        .find({
          members: {
            $in: [req.params.id],
          },
        })
        .sort({ updatedAt: -1, createdAt: -1 });

      res.status(201).json({
        success: true,
        conversations,
      });
    } catch (error) {
      return next(new ErrorHandler(error.response.message), 500);
    }
  })
);

// get user conversation
router.get(
  "/get-all-conversation-user/:id",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const conversations = await conversationModel
        .find({
          members: {
            $in: [req.params.id],
          },
        })
        .sort({ updatedAt: -1, createdAt: -1 });

      res.status(201).json({
        success: true,
        conversations,
      });
    } catch (error) {
      return next(new ErrorHandler(error.response.message), 500);
    }
  })
);

module.exports = router;
