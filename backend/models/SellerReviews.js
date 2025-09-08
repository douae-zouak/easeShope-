const mongoose = require("mongoose");

const SellerReviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: [true, "La commande est requise pour la notation"],
      index: true,
    },

    rating: {
      type: Number,
      min: 0,
      max: 5,
      required: true,
      index: true,
    },

    comment: {
      type: String,
      maxlength: [500, "Le commentaire ne peut pas dépasser 500 caractères"],
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index unique pour éviter que le même utilisateur commente deux fois la même commande
SellerReviewSchema.index({ userId: 1, orderId: 1 }, { unique: true });

// Index pour trier rapidement par date de création
SellerReviewSchema.index({ createdAt: -1 });

// Méthode statique pour calculer la note moyenne et distribution
SellerReviewSchema.statics.getAverageRating = async function (sellerId) {
  const result = await this.aggregate([
    { $match: { sellerId: new mongoose.Types.ObjectId(sellerId) } },
    {
      $group: {
        _id: "$sellerId",
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

// Fonction utilitaire pour mettre à jour les stats du vendeur
async function updateSellerStats(sellerId) {
  const SellerReview = mongoose.model("SellerReview");
  const User = mongoose.model("user"); // ← Récupérer le modèle comme ça

  const stats = await SellerReview.getAverageRating(sellerId);

  await User.findByIdAndUpdate(sellerId, {
    $set: {
      "sellerStats.averageRating": stats.averageRating,
      "sellerStats.totalReviews": stats.totalReviews,
      "sellerStats.ratingDistribution": {
        fiveStars: stats.fiveStars,
        fourStars: stats.fourStars,
        threeStars: stats.threeStars,
        twoStars: stats.twoStars,
        oneStar: stats.oneStar,
      },
    },
  });
}

// Hook post-save pour recalculer les stats après un nouvel avis
SellerReviewSchema.post("save", function () {
  updateSellerStats(this.sellerId);
});

// Hook post-update pour recalculer les stats après modification
SellerReviewSchema.post("findOneAndUpdate", function (doc) {
  if (doc) updateSellerStats(doc.sellerId);
});

// Hook post-delete pour recalculer les stats après suppression
SellerReviewSchema.post("findOneAndDelete", function (doc) {
  if (doc) updateSellerStats(doc.sellerId);
});

module.exports = mongoose.model("SellerReview", SellerReviewSchema);
