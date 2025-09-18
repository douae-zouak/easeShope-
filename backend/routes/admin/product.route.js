const express = require("express");

const adminActivationController = require("../../controllers/admin/product.controller");

const router = express.Router();

// Routes protégées pour l'admin uniquement
router.get("/pending-products", adminActivationController.getPendingProducts);

router.get("/:id", adminActivationController.getProductDetails);

router.put("/approve-product/:id", adminActivationController.approveProduct);

router.put("/reject-product/:id", adminActivationController.rejectProduct);

module.exports = router;
