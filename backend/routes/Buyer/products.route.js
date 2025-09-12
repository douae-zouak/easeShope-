const express = require("express");
const productsController = require("../../controllers/buyer/products.controller");
const authMiddleware = require("../../middlewares/auth.middleware");

const router = express.Router();

router.get("/get_all_products", productsController.getProducts);

router.get("/get_product/:id", productsController.getProductById);

router.get("/seller/:userId", productsController.getSellerById);

router.get(
  "/getSellerActiveProducts/:sellerId",
  productsController.getSellerActiveProducts
);

router.get(
  "/getSellerExperience/:sellerId",
  productsController.getSellerExperience
);

router.get(
  "/didCommented/:sellerId",
  authMiddleware.ckeckTokens,
  productsController.commented
);

router.get(
  "/didCommentedProduct/:productId",
  authMiddleware.ckeckTokens,
  productsController.commentedProduct
);

router.get("/getLike/:id", productsController.getLike);

module.exports = router;
