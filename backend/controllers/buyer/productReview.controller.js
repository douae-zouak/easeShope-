const mongoose = require("mongoose");
const { cloudinary } = require("../../config/cloudinary.config");

const ProductReview = require("../../models/ProductReviews");
const Order = require("../../models/Order.model");

exports.addReview = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { productId, rating, comment } = req.body;

    // Avec Cloudinary Storage, les fichiers sont déjà uploadés
    // req.files contient les informations de Cloudinary
    const uploadedImages = req.files
      ? req.files.map((file) => ({
          url: file.path, // URL de l'image sur Cloudinary
          publicId: file.filename || file.public_id, // Public ID Cloudinary (sans l'extension)
        }))
      : [];

    if (!rating) {
      // Supprimer les images uploadées si la validation échoue
      if (uploadedImages.length > 0) {
        for (const image of uploadedImages) {
          try {
            await cloudinary.uploader.destroy(image.publicId);
          } catch (error) {
            console.error(
              "Error deleting image after validation failure:",
              error
            );
          }
        }
      }
      return res.json({
        error: "please add at least rating",
      });
    }

    const order = await Order.find({ userId: userId });

    if (!order || order.length === 0) {
      // Supprimer les images uploadées si la validation échoue
      if (uploadedImages.length > 0) {
        for (const image of uploadedImages) {
          try {
            await cloudinary.uploader.destroy(image.publicId);
          } catch (error) {
            console.error(
              "Error deleting image after validation failure:",
              error
            );
          }
        }
      }
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
      // Supprimer les images uploadées si la validation échoue
      if (uploadedImages.length > 0) {
        for (const image of uploadedImages) {
          try {
            await cloudinary.uploader.destroy(image.publicId);
          } catch (error) {
            console.error(
              "Error deleting image after validation failure:",
              error
            );
          }
        }
      }
      return res.json({
        error: "your didn't make any order for this product to rate it",
      });
    }

    const existingReview = await ProductReview.findOne({
      userId: userId,
      productId: productId,
    });

    if (existingReview) {
      // Supprimer les images uploadées si la validation échoue
      if (uploadedImages.length > 0) {
        for (const image of uploadedImages) {
          try {
            await cloudinary.uploader.destroy(image.publicId);
          } catch (error) {
            console.error(
              "Error deleting image after validation failure:",
              error
            );
          }
        }
      }
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
      images: uploadedImages,
    });

    res.status(201).json({
      message: "Review added with success",
      productReviews: productReviews,
    });
  } catch (error) {
    // En cas d'erreur, supprimer les images déjà uploadées
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          await cloudinary.uploader.destroy(file.filename); // Utiliser file.filename comme publicId
        } catch (deleteError) {
          console.error(
            "Error deleting image after operation failure:",
            deleteError
          );
        }
      }
    }
    next(error);
  }
};

// Modifier getProductReviews pour inclure les images
exports.getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;

    // Validation basique
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        error: "Invalid product ID",
      });
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 1;
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

// Modifier deleteComment pour supprimer aussi les images de Cloudinary
exports.deleteComment = async (req, res, next) => {
  try {
    const { reviewId } = req.params;

    // Validation de l'ID
    if (!reviewId || !mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ error: "Invalid review ID" });
    }

    const reviewToDelete = await ProductReview.findById(reviewId);

    if (!reviewToDelete) {
      return res.status(404).json({ error: "Review not found" });
    }

    // Supprimer les images de Cloudinary
    if (reviewToDelete.images && reviewToDelete.images.length > 0) {
      for (const image of reviewToDelete.images) {
        try {
          await cloudinary.uploader.destroy(image.publicId);
        } catch (cloudinaryError) {
          console.error(
            "Error deleting image from Cloudinary:",
            cloudinaryError
          );
        }
      }
    }

    const deletedReview = await ProductReview.findByIdAndDelete(reviewId);

    const reviews = await ProductReview.find();

    res.status(200).json({
      message: "Review deleted with success",
      reviews: reviews,
    });
  } catch (error) {
    next(error);
  }
};


