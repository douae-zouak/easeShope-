const Product = require("../../models/product.model");
const { cloudinary } = require("../../config/cloudinary.config");
const createError = require("http-errors");
const {
  deleteMultipleImagesFromCloudinary,
} = require("../../utils/cloudinary.utils");

// @desc    Upload product images
// @route   POST /api/products/upload
// @access  Private/Seller
exports.uploadProductImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      throw createError(400, "Please upload at least one image");
    }

    const uploadedImages = [];

    for (const file of req.files) {
      // upload vers cloudinary
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "products", // facultatif : dossier dans Cloudinary
      });

      // sauvegarder l'url
      uploadedImages.push({
        url: result.secure_url,
        public_id: result.public_id,
      });
    }

    res.status(200).json(uploadedImages);
  } catch (err) {
    next(err);
  }
};

exports.addProduct = async (req, res, next) => {
  try {
    console.log("Request body:", req.body);
    console.log("User:", req.user);

    const {
      name,
      description,
      gender,
      category,
      originalPrice,
      discount,
      discountType,
      imagesVariant,
      variants,
      status,
    } = req.body;

    // Get seller ID from authenticated user
    const seller = req.user._id;
    console.log("Seller ID:", seller);

    // Check if product already exists
    const productExists = await Product.findOne({ name, seller });
    console.log("Product exists check:", productExists);

    if (productExists) {
      return res
        .status(400)
        .json({ error: "You already have a product with this name" });
    }

    // Validation des images
    if (!imagesVariant || imagesVariant.length === 0) {
      return res
        .status(400)
        .json({ error: "At least one image variant is required" });
    }

    const discountedPrice =
      discount > 0 ? originalPrice * (1 - discount / 100) : originalPrice;
    console.log("Discounted price:", discountedPrice);

    // Create new product
    const product = await Product.create({
      name,
      description,
      gender: gender || "Unisex",
      category: category || null,
      originalPrice: parseFloat(originalPrice),
      price: discountedPrice,
      discount: discount ? parseFloat(discount) : 0,
      discountType: discountType || "",
      imagesVariant: imagesVariant.map((iv) => ({
        color: iv.color,
        images: iv.images,
      })),
      variants: variants || [],
      status: status || "pending",
      seller,
    });

    console.log("Product created successfully:", product);

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Add product error details:", error);
    console.error("Error stack:", error.stack);
    next(error);
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const seller = req.user._id;

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Filtrage supplémentaire (optionnel)
    const filter = { seller };
    if (req.query.category) {
      filter.category = req.query.category;
    }
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const products = await Product.find(filter).skip(skip).limit(limit);

    const total = await Product.countDocuments(filter);

    res.status(200).json({
      products,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalProducts: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }

    // Vérification de sécurité
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Non autorisé" });
    }

    res.status(200).json({ product });
  } catch (error) {
    next(error);
  }
};

exports.searchProducts = async (req, res, next) => {
  try {
    const { query } = req.query; // ?query=...

    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: "i" } }, // recherche sur le nom
        { category: { $regex: query, $options: "i" } }, // recherche sur la catégorie
      ],
    });

    res.status(200).json({ products: products });
  } catch (error) {
    next(error);
  }
};

exports.editProduct = async (req, res, next) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Vérification de sécurité - seul le vendeur peut modifier
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Gestion des imagesVariant
    if (updateData.imagesVariant) {
      updateData.imagesVariant = updateData.imagesVariant.map((iv) => ({
        color: iv.color,
        images: iv.images,
      }));
    }

    const discountedPrice =
      updateData.discount > 0
        ? updateData.originalPrice * (1 - updateData.discount / 100)
        : updateData.originalPrice;

    updateData.price = discountedPrice;

    // Mettre à jour le produit
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true } // Retourne le document mis à jour
    );

    res.status(200).json({
      message: "Product updated successfully!",
      product: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params; // /delete_product/:id

    // Vérifiez que l'utilisateur est le propriétaire du produit
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }

    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Non autorisé" });
    }

    // 1. Supprimer les images de Cloudinary
    if (product.images && product.images.length > 0) {
      try {
        await deleteMultipleImagesFromCloudinary(product.images);
        console.log("Images Cloudinary supprimées pour le produit:", id);
      } catch (cloudinaryError) {
        console.error(
          "Erreur Cloudinary, mais on continue la suppression produit:",
          cloudinaryError
        );
        // On continue quand même la suppression du produit même si Cloudinary échoue
      }
    }

    // 2. Supprimer le produit de la base de données
    await Product.findByIdAndDelete(id);

    res.status(200).json({
      message: "Produit supprimé avec succès",
      deletedProductId: id,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteImage = async (req, res, next) => {
  try {
    const { publicId } = req.params;

    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result !== "ok") {
      return res.status(500).json({ error: "Failed to delete image" });
    }

    return res.json({ success: true, publicId });
  } catch (error) {
    next(error);
  }
};
