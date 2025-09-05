const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },
  },
  {
    timestamps: true, // ajoute automatiquement createdAt et updatedAt
  }
);

// Pour éviter qu'un utilisateur like deux fois le même produit
favoriteSchema.index({ userId: 1, productId: 1 }, { unique: true });

module.exports = mongoose.model("Favorite", favoriteSchema);
