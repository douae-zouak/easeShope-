const express = require("express");
const productsController = require("../../controllers/buyer/products.controller");

const router = express.Router();

router.get("/get_all_products", productsController.getProducts);

router.get("/get_product/:id", productsController.getProductById);

module.exports = router;
