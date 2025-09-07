const Order = require("../../models/Order.model");

exports.getSellerOrders = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Trouver toutes les commandes qui contiennent au moins un produit du vendeur
    const orders = await Order.find({
      "items.sellerId": userId,
    });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ error: "No orders found for this seller" });
    }

    // Filtrer les items pour ne garder que ceux du vendeur, tout en conservant la structure de la commande
    const sellerOrders = orders.map((order) => {
      // Créer une copie de la commande
      const orderCopy = order.toObject();

      // Filtrer les items pour ne garder que ceux du vendeur
      orderCopy.items = orderCopy.items.filter(
        (item) => item.sellerId.toString() === userId.toString()
      );

      // Recalculer le total de la commande basé uniquement sur les items du vendeur
      orderCopy.total = orderCopy.items.reduce(
        (sum, item) => sum + item.priceAtPurchase * item.quantity,
        0
      );

      return orderCopy;
    });

    res.status(200).json({ data: sellerOrders });
  } catch (error) {
    next(error);
  }
};

exports.updateOrderItemStatus = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { orderId, itemId, newStatus } = req.body;

    // Valider les données d'entrée
    if (!orderId || !itemId || !newStatus) {
      return res.status(400).json({
        error: "Missing required fields: orderId, itemId, or newStatus",
      });
    }

    // Vérifier que le statut est valide
    const validStatuses = [
      "pending",
      "packing",
      "processing",
      "shipped",
      "delivered",
    ];
    if (!validStatuses.includes(newStatus)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    // Trouver la commande
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Trouver l'article dans la commande qui appartient au vendeur
    const itemIndex = order.items.findIndex(
      (item) =>
        item._id.toString() === itemId &&
        item.sellerId.toString() === userId.toString()
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        error:
          "Item not found or you don't have permission to update this item",
      });
    }

    // Mettre à jour le statut de l'article
    order.items[itemIndex].itemStatus = newStatus;

    // Si le statut est "delivered", enregistrer la date de livraison
    if (newStatus === "delivered") {
      order.items[itemIndex].deliveredAt = new Date();
    }

    // Sauvegarder la commande mise à jour
    const updatedOrder = await order.save();

    // Répondre avec l'article mis à jour
    res.status(200).json({
      message: "Item status updated successfully",
      updatedItem: updatedOrder.items[itemIndex],
    });
  } catch (error) {
    console.error("Error updating order item status:", error);
    next(error);
  }
};

exports.getClientOrders = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Récupérer toutes les commandes passées par ce client (les plus récentes d'abord)
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    // if (!orders || orders.length === 0) {
    //   return res.status(404).json({ error: "No orders found for this client" });
    // }

    res.status(200).json({ data: orders });
  } catch (error) {
    next(error);
  }
};
