const express = require("express");
const paypalController = require("../../controllers/buyer/paypal.controller");

const router = express.Router();


router.post("/create-order", paypalController.createOrder);

router.post("/capture-payment/:orderId", paypalController.capturePayment);

module.exports = router;
