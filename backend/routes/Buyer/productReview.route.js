const express = require("express");
const productReviewController = require("../../controllers/buyer/productReview.controller");

const router = express.Router();

router.post("/add", productReviewController.addReview);

router.get("/:productId", productReviewController.getProductReviews);

router.delete("/deleteReview/:reviewId", productReviewController.deleteComment);

module.exports = router;
