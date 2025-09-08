const express = require("express");
const sellerReviewController = require("../../controllers/buyer/sellerReview.controller");

const router = express.Router();

router.post("/add", sellerReviewController.addReview);

router.get("/:sellerId", sellerReviewController.getSellerReviews);

module.exports = router;
