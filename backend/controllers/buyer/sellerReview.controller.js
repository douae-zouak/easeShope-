const Order = require("../../models/Order.model");
const SellerReview = require("../../models/SellerReviews");

exports.addReview = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { sellerId, rating, comment } = req.body;

    if (!rating) {
      return res.status(400).json({
        error: "please add at least rating",
      });
    }

    const order = await Order.find({ userId: userId });

    console.log("order found : ", order);

    if (!order || order.length === 0) {
      return res.satus(400).json({
        error: "your didn't make any order for this seller to rate him",
      });
    }

    console.log("items : ", order[0].items);

    const hasSellerProducts = order[0].items.some(
      (item) => item.sellerId && item.sellerId.toString() === sellerId
    );

    console.log("hasSellerProducts : ", hasSellerProducts);

    if (!hasSellerProducts) {
      return res.satus(400).json({
        error: "your didn't make any order for this seller to rate him",
      });
    }

    const existingReview = await SellerReview.findOne({
      userId: userId,
      sellerId: sellerId,
    });

    if (existingReview) {
      return res.status(400).json({
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
      .populate("userId", "fullName profilePhoto") // Infos de l'utilisateur
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(); // Pour de meilleures performances

    // Compter le total pour la pagination
    const totalReviews = await SellerReview.countDocuments({
      sellerId: sellerId,
    });
    const totalPages = Math.ceil(totalReviews / limit);

    // Calculer la note moyenne
    const averageRating = await SellerReview.aggregate([
      { $match: { sellerId: new mongoose.Types.ObjectId(sellerId) } },
      { $group: { _id: null, average: { $avg: "$rating" } } },
    ]);

    res.status(200).json({
      reviews: reviews,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalReviews: totalReviews,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      averageRating: averageRating[0]?.average || 0,
    });
  } catch (error) {
    next(error);
  }
};
