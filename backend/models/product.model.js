const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema({
  size: {
    type: String,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
  },
  colorTitle: {
    type: String,
    required: true,
  },
  colorCode: {
    type: String,
    required: true,
  },
  sku: { type: String, required: true, unique: true },

  chest: Number,
  length: Number,
  sleeve: Number,
});

const imageVariantSchema = new mongoose.Schema({
  color: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    required: true,
    validate: {
      validator: function (v) {
        return v.length >= 1 && v.length <= 10;
      },
      message: "A product should have between 1 and 10 images",
    },
  },
});

// Middleware pour générer le SKU automatiquement avant la sauvegarde
variantSchema.pre("validate", function (next) {
  if (!this.sku) {
    // Exemple de génération de SKU : NOMDU PRODUIT-Taille-Couleur
    const productName = this.ownerDocument().name || "PRODUCT";
    const productID = parent?._id?.toString().slice(-6) || "ID";
    const color = this.color ? this.color.toUpperCase() : "COLOR";

    this.sku = `${productName
      .toUpperCase()
      .replace(/\s+/g, "")}-${productID}-${color}`;
  }
  next();
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Le nom du produit est obligatoire"],
      trim: true,
      maxlength: [100, "Le nom ne peut pas dépasser 100 caractères"],
    },

    description: {
      type: String,
      required: [true, "La description est obligatoire"],
      trim: true,
      maxlength: [2000, "La description ne peut pas dépasser 2000 caractères"],
    },

    gender: {
      type: String,
      enum: ["Men", "Women", "Unisex"],
      default: "Unisex",
    },

    category: {
      main: {
        type: String,
        required: true,
        enum: [
          "Electronics",
          "Clothing",
          "Shoes",
          "Accessories",
          "Home & Kitchen",
          "Beauty",
          "Sports",
          "Books",
          "Girls",
          "Boys",
          "Toys",
          "Babies",
        ],
      },
      sub: {
        type: String,
        required: true,
        // Le enum sera validé dynamiquement selon la catégorie principale
      },
    },

    originalPrice: {
      type: Number,
      required: true,
      min: [0, "Le prix ne peut pas être négatif"],
      max: [100000, "Le prix ne peut pas dépasser 100000"],
    },

    price: {
      type: Number,
      required: true,
      min: [0, "Le prix ne peut pas être négatif"],
      max: [100000, "Le prix ne peut pas dépasser 100000"],
    },

    stock: {
      type: Number,
      required: true,
      min: [0, "Le stock ne peut pas être négatif"],
      default: 0,
    },

    discount: {
      type: Number,
      min: [0, "La remise ne peut pas être négative"],
      max: [100, "La remise ne peut pas dépasser 100%"],
      default: 0,
    },

    discountType: { type: String, default: "" },

    imagesVariant: [imageVariantSchema],

    variants: [variantSchema],

    status: {
      type: String,
      enum: ["draft", "pending", "active", "rejected"],
      default: "draft",
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", // Nom du modèle référencé
      required: true,
    },

    rejectionReason: {
      type: String,
      trim: true,
      maxlength: [
        500,
        "La raison de rejet ne peut pas dépasser 500 caractères",
      ],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Middleware pour mettre à jour totalStock automatiquement
productSchema.pre("save", function (next) {
  if (this.variants && this.variants.length > 0) {
    this.stock = this.variants.reduce((sum, v) => sum + v.stock, 0);
  } else {
    this.stock = 0;
  }
  next();
});

productSchema.index({ name: 1 }); // 1 = croissant, -1 = décroissant

module.exports = mongoose.model("product", productSchema);
