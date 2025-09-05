const mongoose = require("mongoose");

const orderItemsSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    required: true,
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1,
    max: 100,
  },
  priceAtPurchase: {
    type: Number,
    required: true,
    min: 0,
  },
  size: {
    type: String,
    required: function () {
      return this.productType === "clothing"; // Conditionnel si besoin
    },
  },
  colorTitle: {
    type: String,
    required: true,
  },
  colorCode: {
    type: String,
    required: true,
  },
  sku: {
    type: String,
    required: true,
  },
  colorImages: {
    type: [String],
    required: true,
    validate: {
      validator: function (images) {
        return images.length > 0;
      },
      message: "At least one image is required",
    },
  },
  // Ajouts recommandés :
  productName: { type: String, required: true },

  itemStatus: {
    type: String,
    enum: [
      "pending", // Commande créée
      "packing",
      "processing", // En préparation
      "shipped", // Expédiée
      "delivered", // Livrée
    ],
    default: "pending",
  },
});

const addressSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  postalCode: {
    type: String, // String pour gérer les codes avec lettres
    required: true,
    trim: true,
  },
  street: {
    type: String,
    required: true,
    trim: true,
  },
  phoneNumber: {
    type: String, // String pour gérer les formats internationaux
    required: true,
    match: [/^\+?[\d\s\-\(\)]{10,}$/, "Please use a valid phone number"],
  },
  //   country: {
  //     type: String,
  //     required: true,
  //     default: "Morocco", // Ou autre selon votre marché
  //   },
});

const OrderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [orderItemsSchema],

    total: {
      type: Number,
      required: true,
      min: 0,
    },

    shippingAddress: addressSchema,

    // Dates importantes
    paidAt: { type: Date },
    deliveredAt: { type: Date },

    // Pour les retours/remboursements
    returnRequested: { type: Boolean, default: false },
    returnReason: { type: String },
    returnStatus: {
      type: String,
      enum: ["requested", "approved", "rejected", "completed", "not requested"],
      default: "not requested",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Middleware pour générer le numéro de commande
OrderSchema.pre("save", async function (next) {
  if (this.isNew && !this.orderNumber) {
    try {
      // Utiliser un compteur séquentiel pour éviter les conflits
      const lastOrder = await this.constructor.findOne(
        {},
        {},
        { sort: { createdAt: -1 } }
      );

      let nextNumber = 1;
      if (lastOrder && lastOrder.orderNumber) {
        const lastNumber = parseInt(lastOrder.orderNumber.split("-").pop());
        nextNumber = lastNumber + 1;
      }

      this.orderNumber = `ORD-${Date.now()}-${nextNumber
        .toString()
        .padStart(4, "0")}`;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Virtual pour le statut de livraison
OrderSchema.virtual("isDelivered").get(function () {
  return this.status === "delivered";
});

// Index pour les recherches courantes
OrderSchema.index({ userId: 1, createdAt: -1 });
OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ status: 1 });

module.exports = mongoose.model("Order", OrderSchema);
