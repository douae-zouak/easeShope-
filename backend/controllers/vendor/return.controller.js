const Order = require("../../models/Order.model");

exports.getApprovedProducts = async (req, res, next) => {
  try {
    const sellerId = req.user._id;

    const orders = await Order.find({
      "items.returnStatus": "approved",
      "items.sellerId": sellerId,
    }).populate({
      path: "items.productId",
      select: "name",
    });

    // filtrer les items par vendeur et status
    const filteredOrders = orders
      .map((order) => {
        const filteredItems = order.items.filter(
          (item) =>
            item.sellerId.toString() === sellerId.toString() &&
            item.returnStatus === "approved"
        );
        return { ...order.toObject(), items: filteredItems };
      })
      .filter((order) => order.items.length > 0); // enlever les orders vides

    console.log("seller orders app : ", filteredOrders);

    res.json({ orders: filteredOrders });
  } catch (error) {
    next(error);
  }
};
