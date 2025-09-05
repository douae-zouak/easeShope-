const express = require("express");
const cartController = require("../../controllers/buyer/cart.controller");

const router = express.Router();

router.post("/add", cartController.addToCart);

router.get("/", cartController.getCart);

router.put("/update/:productId", cartController.updateProductQuantity);

router.delete("/remove/:productId", cartController.deleteProduct);

// router.delete("/clear", cartController.clearCart);

// router.post("/create-checkout", cartController.chechout);

module.exports = router;
