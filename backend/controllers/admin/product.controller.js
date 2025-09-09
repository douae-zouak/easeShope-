const Product = require("../../models/product.model");

// Obtenir tous les produits en attente de validation
exports.getPendingProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.find({ status: "pending" })
      .populate({
        path: "seller",
        select: "fullName email profilePhoto",
        model: "user",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments({ status: "pending" });

    res.status(200).json({
      success: true,
      products,
      pagination: {
        page,
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error:
        "Erreur lors de la récupération des produits en attente: " +
        error.message,
    });
  }
};

// Obtenir les détails d'un produit spécifique
exports.getProductDetails = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "seller",
      "fullName email profilePhoto phoneNumber"
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Produit non trouvé",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erreur lors de la récupération du produit: " + error.message,
    });
  }
};

// Approuver un produit
exports.approveProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        status: "active",
        rejectionReason: undefined, // Effacer la raison de rejet si elle existait
      },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Produit non trouvé",
      });
    }

    res.status(200).json({
      success: true,
      message: "Produit approuvé avec succès",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erreur lors de l'approbation du produit: " + error.message,
    });
  }
};

// Rejeter un produit
exports.rejectProduct = async (req, res) => {
  try {
    const { rejectionReason } = req.body;

    if (!rejectionReason || rejectionReason.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "Veuillez fournir une raison de rejet",
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        status: "rejected",
        rejectionReason: rejectionReason.trim(),
      },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Produit non trouvé",
      });
    }

    res.status(200).json({
      success: true,
      message: "Produit rejeté avec succès",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erreur lors du rejet du produit: " + error.message,
    });
  }
};
