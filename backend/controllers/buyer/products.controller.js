const Product = require("../../models/product.model");
const User = require("../../models/user.model");
const mongoose = require("mongoose");

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

    const sellerId = product.seller;

    const seller = await User.findById(sellerId);

    res.status(200).json({ product: product, seller: seller });
  } catch (error) {
    next(error);
  }
};

exports.getSellerById = async (req, res, next) => {
  try {
    // EXTRACTION CORRECTE de l'ID
    const { userId } = req.params; // ← Destructuring pour obtenir la valeur

    console.log("user ID : ", userId); // Maintenant une string "123abc"

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    const seller = await User.findById(userId);
    console.log("seller back : ", seller);

    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }

    res.status(200).json({ seller: seller });
  } catch (error) {
    next(error);
  }
};
