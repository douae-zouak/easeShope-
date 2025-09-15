const Order = require("../../models/Order.model");
const mongoose = require("mongoose");

const { cloudinary } = require("../../config/cloudinary.config");

exports.requestReturn = async (req, res, next) => {
  try {
    const productId = req.body.productId;
    const reason = req.body.reason;
    const orderId = req.body.orderId;
    const userId = req.user._id;

    console.log("body :", req.body);
    console.log("order :", orderId);
    console.log(productId);
    console.log("user : ", userId);
    console.log(reason);

    if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ error: "Invalid order ID format" });
    }

    const uploadedImages = req.files
      ? req.files.map((file) => ({
          url: file.path,
          publicId: file.filename || file.public_id,
        }))
      : [];

    // Trouver une seule commande
    const order = await Order.findOne({ _id: orderId, userId: userId });

    if (!order) {
      // Supprimer images uploadées si pas d'ordre trouvé
      if (uploadedImages.length > 0) {
        for (const image of uploadedImages) {
          try {
            await cloudinary.uploader.destroy(image.publicId);
          } catch (error) {
            console.error(
              "Error deleting image after validation failure:",
              error
            );
          }
        }
      }
      return res.status(404).json({ error: "No order found!" });
    }

    const item = order.items.find(
      (item) => item.productId.toString() === productId
    );

    if (!item) {
      // Supprimer images si produit non trouvé
      if (uploadedImages.length > 0) {
        for (const image of uploadedImages) {
          try {
            await cloudinary.uploader.destroy(image.publicId);
          } catch (error) {
            console.error(
              "Error deleting image after validation failure:",
              error
            );
          }
        }
      }
      return res.status(404).json({ error: "Product not found in order!" });
    }

    // Mettre à jour l'item
    item.returnRequested = true;
    item.returnReason = reason;
    item.returnDate = new Date();
    item.returnStatus = "requested";
    item.images = uploadedImages;

    await order.save();

    res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};
