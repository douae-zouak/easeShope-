const mongoose = require("mongoose");

const ProductReview = require("../../models/ProductReviews");
const Order = require("../../models/Order.model");

exports.addReview = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { productId, rating, comment } = req.body;

    if (!rating) {
      return res.json({
        error: "please add at least rating",
      });
    }

    const order = await Order.find({ userId: userId });

    if (!order || order.length === 0) {
      return res.json({
        error: "your didn't make any order for this product to rate it",
      });
    }

    const hasProduct = order.some((o) =>
      o.items.some(
        (item) => item.productId && item.productId.toString() === productId
      )
    );

    if (!hasProduct) {
      return res.json({
        error: "your didn't make any order for this product to rate it",
      });
    }

    const existingReview = await ProductReview.findOne({
      userId: userId,
      productId: productId,
    });

    if (existingReview) {
      return res.json({
        error: "You have already rated this product",
      });
    }

    const productReviews = await ProductReview.create({
      userId,
      productId,
      orderId: order[0]._id,
      rating,
      comment: comment,
    });

    res.status(201).json({
      message: "Review added with success",
      productReviews: productReviews,
    });
  } catch (error) {
    next(error);
  }
};

exports.getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;

    // Validation basique
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        error: "Ivalid product ID",
      });
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const reviews = await ProductReview.find({ productId: productId })
      .populate({
        path: "userId",
        select: "fullName profilePhoto email",
        model: mongoose.model("user"),
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Compter le total pour la pagination
    const totalReviews = await ProductReview.countDocuments({
      productId: productId,
    });
    const totalPages = Math.ceil(totalReviews / limit);

    const stats = await ProductReview.getAverageRating(productId);

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

exports.deleteComment = async (req, res, next) => {
  try {
    const { reviewId } = req.params;

    // Validation de l'ID
    if (!reviewId || !mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ error: "Invalid review ID" });
    }

    const deletedReview = await ProductReview.findByIdAndDelete(reviewId);

    // Vérifier si le document existait
    if (!deletedReview) {
      return res.status(404).json({ error: "Review not found" });
    }

    const reviews = await ProductReview.find();

    res.status(200).json({
      message: "Review deleted with success",
      reviews: reviews,
    });
  } catch (error) {
    next(error);
  }
};
