const Order = require("../../models/Order.model");
const Product = require("../../models/product.model");
const brevoConfig = require("../../config/brevo.config");
const mongoose = require("mongoose");

exports.getReturnedProducts = async (req, res, next) => {
  try {
    const orders = await Order.find({
      "items.returnStatus": { $in: ["requested", "approved", "rejected"] },
    });

    if (!orders) {
      return res.json({ message: "No products requested to return" });
    }

    res.json({ order: orders });
  } catch (error) {
    next(error);
  }
};

exports.updateRequestedProductStatus = async (req, res, next) => {
  try {
    const { productId, status, rejectionReason } = req.body;

    const order = await Order.findOne({
      "items.productId": productId,
    }).populate({
      path: "userId",
      select: "fullName email",
      model: mongoose.model("user"),
    });

    if (!order) {
      return res.json({ success: false, message: "No order found!" });
    }

    const requestedProduct = order.items.find(
      (pr) => pr.productId.toString() === productId
    );

    if (!requestedProduct) {
      return res.json({
        success: false,
        message: "Product not found in order!",
      });
    }

    const product = await Product.findById(requestedProduct.productId);

    requestedProduct.returnStatus = status;
    requestedProduct.rejectionReason = rejectionReason || "";
    await order.save();

    // Envoi de l’email selon le status
    if (status === "rejected") {
      await brevoConfig.ReturnRequestRejected(
        order.userId.email,
        order.userId.fullName,
        order.orderNumber,
        requestedProduct.returnDate,
        requestedProduct,
        product.name,
        requestedProduct.returnReason,
        rejectionReason
      );
    } else if (status === "approved") {
      await brevoConfig.ReturnRequestApproved(
        order.userId.email,
        order.userId.fullName,
        order.orderNumber,
        requestedProduct.returnDate,
        requestedProduct,
        product.name,
        requestedProduct.returnReason
      );
    }

    const orders = await Order.find({
      "items.returnStatus": { $in: ["requested", "approved", "rejected"] },
    });

    console.log("ord : ", orders);

    return res.json({
      orders: orders,
    });
  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: "An unexpected error occurred.",
    });
  }
};

