const Product = require("../../models/product.model");

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();

    res.status(200).json({
      products,
    });
  } catch (error) {
    next(error);
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ product });
  } catch (error) {
    next(error);
  }
};
