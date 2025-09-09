const express = require("express");
const sellerReviewController = require("../../controllers/buyer/sellerReview.controller");

const router = express.Router();

router.post("/add", sellerReviewController.addReview);

router.get("/:sellerId", sellerReviewController.getSellerReviews);

router.delete("/deleteReview/:reviewId", sellerReviewController.deleteComment);

module.exports = router;
