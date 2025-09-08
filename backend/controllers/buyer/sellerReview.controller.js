const User = require("../../models/user.model");
const SellerReview = require("../../models/SellerReviews");
const Order = require("../../models/Order.model");

const mongoose = require("mongoose");

exports.addReview = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { sellerId, rating, comment } = req.body;

    if (!rating) {
      return res.json({
        error: "please add at least rating",
      });
    }

    const order = await Order.find({ userId: userId });

    if (!order || order.length === 0) {
      return res.json({
        error: "your didn't make any order for this seller to rate him",
      });
    }

    const hasSellerProducts = order.some((o) =>
      o.items.some(
        (item) => item.sellerId && item.sellerId.toString() === sellerId
      )
    );

    if (!hasSellerProducts) {
      return res.json({
        error: "your didn't make any order for this seller to rate him",
      });
    }

    const existingReview = await SellerReview.findOne({
      userId: userId,
      sellerId: sellerId,
    });

    if (existingReview) {
      return res.json({
        error: "You have already rated this seller",
      });
    }

    const sellerReview = await SellerReview.create({
      userId,
      sellerId,
      orderId: order[0]._id,
      rating,
      comment: comment,
    });

    res.status(201).json({
      message: "Review added with success",
      sellerReview: sellerReview,
    });
  } catch (error) {
    next(error);
  }
};

exports.getSellerReviews = async (req, res, next) => {
  try {
    const { sellerId } = req.params;

    // Validation basique
    if (!sellerId || !mongoose.Types.ObjectId.isValid(sellerId)) {
      return res.status(400).json({
        error: "Ivalid seller ID",
      });
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const reviews = await SellerReview.find({ sellerId: sellerId })
      .populate({
        path: "userId",
        select: "fullName profilePhoto email", // Sélectionnez les champs nécessaires
        model: mongoose.model("user"), // Référence directe via mongoose
      }) // Infos de l'utilisateur
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(); // Pour de meilleures performances

    // Compter le total pour la pagination
    const totalReviews = await SellerReview.countDocuments({
      sellerId: sellerId,
    });
    const totalPages = Math.ceil(totalReviews / limit);

    const stats = await SellerReview.getAverageRating(sellerId);

    res.status(200).json({
      reviews: reviews,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalReviews: totalReviews,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      stats: stats,
    });
  } catch (error) {
    next(error);
  }
};
