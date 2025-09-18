const mongoose = require("mongoose");

const Product = require("../../models/product.model");
const User = require("../../models/user.model");
const SellerReview = require("../../models/SellerReviews");
const ProductReview = require("../../models/ProductReviews");
const Order = require("../../models/Order.model");

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find().populate({
      path: "seller",
      select: "fullName email isActive",
    });

    // Filtrer les produits où le vendeur existe ET est actif
    const activeProducts = products.filter(
      (product) => product.seller && product.seller.isActive === true
    );

    res.status(200).json({
      products: activeProducts,
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

exports.getSellerActiveProducts = async (req, res, next) => {
  try {
    const { sellerId } = req.params;

    const products = await Product.find({ seller: sellerId, status: "active" });

    res.status(200).json({ activatedSellerProducts: products });
  } catch (error) {
    next(error);
  }
};

exports.getSellerExperience = async (req, res, next) => {
  try {
    const { sellerId } = req.params;

    if (!sellerId || !mongoose.Types.ObjectId.isValid(sellerId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    const seller = await User.findById(sellerId);

    if (!seller) return res.status(404).json({ error: "Seller not found" });
    const createdAt = new Date(seller.createdAt);
    const now = new Date();

    // Calcul total en mois
    let months = (now.getFullYear() - createdAt.getFullYear()) * 12;
    months += now.getMonth() - createdAt.getMonth();

    // Ajuster si le jour du mois n’est pas encore passé
    let days = now.getDate() - createdAt.getDate();
    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
    }

    let experienceStr = "";
    if (months < 1) {
      // Moins d’un mois → renvoyer le nombre de jours
      experienceStr = `${days} day${days > 1 ? "s" : ""}`;
    } else if (months < 12) {
      experienceStr = `${months} month${months > 1 ? "s" : ""}`;
    } else {
      const years = Math.floor(months / 12);
      const remainingMonths = months % 12;
      experienceStr = `${years} year${years > 1 ? "s" : ""}`;
      if (remainingMonths > 0) {
        experienceStr += ` and ${remainingMonths} month${
          remainingMonths > 1 ? "s" : ""
        }`;
      }
    }

    res.json({ experience: experienceStr });
  } catch (error) {
    next(error);
  }
};

exports.commented = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { sellerId } = req.params;

    const comment = await SellerReview.findOne({
      userId: userId,
      sellerId: sellerId,
    });

    console.log("comment : ", comment);

    if (!comment) {
      return res.json({
        commentId: null,
      });
    }

    res.status(200).json({ commentId: comment?._id });
  } catch (error) {
    next(error);
  }
};

exports.commentedProduct = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

    const comment = await ProductReview.findOne({
      userId: userId,
      productId: productId,
    });

    console.log("comment : ", comment);

    if (!comment) {
      return res.json({
        commentProductId: null,
      });
    }

    res.status(200).json({ commentId: comment?._id });
  } catch (error) {
    next(error);
  }
};

exports.orderedProduct = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

    const orderByClient = await Order.findOne({
      userId: userId,
      "items.productId": productId,
    });

    if (!orderByClient) {
      return res.json({
        error: "This user had never ordered",
      });
    }

    res.status(200).json({ orderedProductId: orderByClient._id });
  } catch (error) {
    next(error);
  }
};

exports.getLike = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.json({ error: "No product found with that ID" });
    }

    const similarProducts = await Product.find({
      _id: { $ne: id },
      $or: [{ gender: product.gender }, { category: product.category }],
    });

    res.status(200).json({
      similarProducts: similarProducts,
    });
  } catch (error) {
    next(error);
  }
};

exports.getSpecificProducts = async (req, res, next) => {
  try {
    const { gender, category } = req.params;

    let products;

    if (gender === "Woman" || gender === "Men") {
      products = await Product.find({
        gender: gender,
        category: category,
      });
    } else {
      products = await Product.find({
        category: category,
      });
    }

    if (!products || products.length === 0) {
      return res.json({ error: "No product found for this category" });
    }

    res.status(200).json({
      specificProducts: products || [],
    });
  } catch (error) {
    next(error);
  }
};
