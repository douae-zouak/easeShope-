const express = require("express");
const orderController = require("../../controllers/vendor/orders.controller");

const router = express.Router();

router.get("/seller-orders", orderController.getSellerOrders);

router.get("/client-orders", orderController.getClientOrders);

router.put("/order-update", orderController.updateOrderItemStatus);

module.exports = router;
