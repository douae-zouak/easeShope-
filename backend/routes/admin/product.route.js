const express = require("express");

const authMiddleware = require("../../middlewares/auth.middleware");
const adminController = require("../../controllers/admin/product.controller");

const router = express.Router();

// Routes protégées pour l'admin uniquement
router.get(
  "/pending-products",
  authMiddleware.ckeckTokens,
  adminController.getPendingProducts
);

router.get(
  "/product/:id",
  authMiddleware.ckeckTokens,
  adminController.getProductDetails
);

router.put(
  "/approve-product/:id",
  authMiddleware.ckeckTokens,
  adminController.approveProduct
);

router.put(
  "/reject-product/:id",
  authMiddleware.ckeckTokens,
  adminController.rejectProduct
);

module.exports = router;
