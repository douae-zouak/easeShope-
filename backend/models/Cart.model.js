const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    required: true,
  },
  quantity: { type: Number, default: 1, min: 1 },
  priceAtPurchase: { type: Number, required: true },
  size: { type: String, required: true },
  colorTitle: { type: String, required: true },
  colorCode: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  colorImages: { type: [String], required: true },
});

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    items: [cartItemSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", CartSchema);
