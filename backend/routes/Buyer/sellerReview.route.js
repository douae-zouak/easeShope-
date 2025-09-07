const express = require("express");
const sellerReviewController = require("../../controllers/buyer/sellerReview.controller");

const router = express.Router();

router.post("/add", sellerReviewController.addReview);

router.get("/sellerReview/:sellerId", sellerReviewController.addReview);

module.exports = router;
