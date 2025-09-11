const mongoose = require("mongoose");

const ProductReviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },

    rating: { type: Number, min: 0, max: 5, required: true, index: true },

    comment: {
      type: String,
      maxlength: [500, "Le commentaire ne peut pas dépasser 500 caractères"],
      trim: true,
    },

    images: [
      {
        url: {
          type: String,
          required: true,
        },
        publicId: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index unique pour éviter plusieurs avis du même utilisateur sur la même commande
ProductReviewSchema.index({ userId: 1, orderId: 1 }, { unique: true });
ProductReviewSchema.index({ createdAt: -1 });

// Virtual pour calculer le temps depuis publication
ProductReviewSchema.virtual("timeAgo").get(function () {
  const now = new Date();
  const diff = now - this.createdAt;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `It's been ${days} days`;
  if (days < 30) return `It's been ${Math.floor(days / 7)} weeks`;
  return `It's been ${Math.floor(days / 30)} months`;
});

// Méthode statique pour calculer note moyenne et distribution
ProductReviewSchema.statics.getAverageRating = async function (productId) {
  const result = await this.aggregate([
    { $match: { productId: new mongoose.Types.ObjectId(productId) } },
    {
      $group: {
        _id: "$productId",
        averageRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
        fiveStars: { $sum: { $cond: [{ $eq: ["$rating", 5] }, 1, 0] } },
        fourStars: { $sum: { $cond: [{ $eq: ["$rating", 4] }, 1, 0] } },
        threeStars: { $sum: { $cond: [{ $eq: ["$rating", 3] }, 1, 0] } },
        twoStars: { $sum: { $cond: [{ $eq: ["$rating", 2] }, 1, 0] } },
        oneStar: { $sum: { $cond: [{ $eq: ["$rating", 1] }, 1, 0] } },
      },
    },
  ]);

  return (
    result[0] || {
      averageRating: 0,
      totalReviews: 0,
      fiveStars: 0,
      fourStars: 0,
      threeStars: 0,
      twoStars: 0,
      oneStar: 0,
    }
  );
};

// Fonction utilitaire pour mettre à jour les stats produit
async function updateProductStats(productId) {
  const ProductReview = mongoose.model("ProductReview");
  const stats = await ProductReview.getAverageRating(productId);

  // Mettre à jour le document Product
  await mongoose.model("Product").findByIdAndUpdate(productId, {
    $set: {
      "productStats.averageRating": stats.averageRating,
      "productStats.totalReviews": stats.totalReviews,
      "productStats.ratingDistribution": {
        fiveStars: stats.fiveStars,
        fourStars: stats.fourStars,
        threeStars: stats.threeStars,
        twoStars: stats.twoStars,
        oneStar: stats.oneStar,
      },
    },
  });
}

// Hooks pour recalculer les stats
ProductReviewSchema.post("save", function () {
  updateProductStats(this.productId);
});
ProductReviewSchema.post("findOneAndUpdate", function (doc) {
  if (doc) updateProductStats(doc.productId);
});
ProductReviewSchema.post("findOneAndDelete", function (doc) {
  if (doc) updateProductStats(doc.productId);
});

module.exports = mongoose.model("ProductReview", ProductReviewSchema);
