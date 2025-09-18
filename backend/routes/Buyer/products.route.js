const express = require("express");
const productsController = require("../../controllers/buyer/products.controller");

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

router.get("/didCommented/:sellerId", productsController.commented);

router.get(
  "/didCommentedProduct/:productId",
  productsController.commentedProduct
);

router.get("/didOrderedProduct/:productId", productsController.orderedProduct);

router.get("/getLike/:id", productsController.getLike);

router.get(
  "/specificProducts/:gender/:category",
  productsController.getSpecificProducts
);

module.exports = router;
