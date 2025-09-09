const Favorite = require("../../models/favorite.model");
const Product = require("../../models/product.model");
const mongoose = require("mongoose");

exports.toggleToFavorite = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const userId = req.user._id;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid product ID",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    const existingFavorite = await Favorite.findOne({ userId, productId });

    if (existingFavorite) {
      await Favorite.findByIdAndDelete(existingFavorite._id);

      return res.status(200).json({
        success: true,
        message: "Product deleted from favorite with success",
        data: null,
        isFavorite: false,
      });
    }

    const favorite = await Favorite.create({
      userId: userId,
      productId: productId,
    });

    await favorite.populate("productId");

    res.status(201).json({
      success: true,
      message: "Product added to favorite with success",
      data: favorite,
      isFavorite: true,
    });
  } catch (error) {
    console.error("toggleToFavorite ERROR:", error);
    next(error);
  }
};

exports.getFavorite = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Récupérer les favoris avec les produits populés
    const favorites = await Favorite.find({ userId }).populate({
      path: "productId",
      select:
        "name price discount imagesVariant category originalPrice stock status",
    });

    // Même s'il n'y a pas de favoris, c'est une réponse valide
    res.status(200).json({
      success: true,
      count: favorites.length,
      data: favorites || [], // Toujours renvoyer un tableau
    });
  } catch (error) {
    console.error("Erreur dans getFavorite:", error);
    next(error);
  }
};
