const express = require("express");
const { uploadProductImages } = require("../../middlewares/upload.middleware");
const productController = require("../../controllers/vendor/product.controller");

const router = express.Router();

router.post(
  "/upload",
  uploadProductImages,
  productController.uploadProductImages
);

router.post("/add_product", productController.addProduct);

router.get("/get_products", productController.getProducts);

router.get("/get_product/:id", productController.getProductById);

router.get("/search", productController.searchProducts);

router.delete("/delete_product/:id", productController.deleteProduct);

router.put("/edit_product/:id", productController.editProduct);

router.delete("/delete_image/:publicId", productController.deleteImage);


module.exports = router;
