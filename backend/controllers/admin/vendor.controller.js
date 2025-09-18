const User = require("../../models/user.model");
const Product = require("../../models/product.model");
const Order = require("../../models/Order.model");

exports.getVendors = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
      search = "",
      status = "active",
    } = req.query;

    // Filtrage des vendeurs actifs uniquement
    let filter = { role: "vendor" };

    if (status === "active") {
      filter.isActive = true;
    } else if (status === "inactive") {
      filter.isActive = false;
    }
    // si status === "all", on ne filtre pas par isActive

    // Recherche par nom ou email
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { [sortBy]: sortOrder === "desc" ? -1 : 1 },
      select:
        "fullName email profilePhoto isActive totalSales totalProducts joinDate lastActivity",
    };

    const vendors = await User.paginate(filter, options);

    res.status(200).json({
      success: true,
      vendors: vendors.docs,
      totalPages: vendors.totalPages,
      currentPage: vendors.page,
      totalVendors: vendors.totalDocs,
    });
  } catch (error) {
    next(error);
  }
};

exports.getVendorDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    const vendor = await User.findById(id).select("-password");

    if (!vendor || vendor.role !== "vendor") {
      return res.status(404).json({
        success: false,
        error: "Vendor not found",
      });
    }

    // Récupérer les statistiques supplémentaires
    const activeProducts = await Product.countDocuments({
      seller: id,
      status: "active",
    });

    const pendingProducts = await Product.countDocuments({
      seller: id,
      status: "pending",
    });

    const totalOrders = await Order.countDocuments({
      "items.sellerId": id,
    });

    res.status(200).json({
      success: true,
      vendor: {
        ...vendor.toObject(),
        stats: {
          activeProducts,
          pendingProducts,
          totalOrders,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.desactivateVendor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.json({
        success: false,
        error: "Deactivation reason is required",
      });
    }

    const vendor = await User.findByIdAndUpdate(
      id,
      {
        isActive: false,
        deactivationReason: reason,
        deactivationDate: new Date(),
        whoDesactivated: "admin",
      },
      { new: true }
    ).select("-password");

    if (!vendor) {
      return res.json({
        success: false,
        error: "Vendor not found",
      });
    }

    await brevoConfig.VendorDesactivated(
      vendor.email,
      vendor.fullName,
      reason,
      new Date()
    );

    res.status(200).json({
      success: true,
      message: "Vendor account deactivated successfully",
      vendor,
    });
  } catch (error) {
    next(error);
  }
};

exports.activateVendor = async (req, res, next) => {
  try {
    const { id } = req.params;

    const vendor = await User.findByIdAndUpdate(
      id,
      {
        isActive: true,
        deactivationReason: "",
        deactivationDate: null,
      },
      { new: true }
    ).select("-password");

    if (!vendor) {
      return res.status(404).json({
        success: false,
        error: "Vendor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vendor account activated successfully",
      vendor,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteVendor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        error: "Deletion reason is required",
      });
    }

    const vendor = await User.findById(id);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        error: "Vendor not found",
      });
    }

    // Vérifier s'il y a des produits ou commandes associés
    const hasProducts = await Product.exists({ seller: id });
    const hasOrders = await Order.exists({ "items.sellerId": id });

    if (hasProducts || hasOrders) {
      return res.status(400).json({
        success: false,
        error: "Cannot delete vendor with associated products or orders",
      });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Vendor account deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
