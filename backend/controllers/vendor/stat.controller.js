const Order = require("../../models/Order.model");
const Product = require("../../models/product.model");

exports.getVendorStats = async (req, res, next) => {
  try {
    const vendorId = req.user._id;
    const { range } = req.query;

    let startDate;
    const endDate = new Date();

    // Définir la période en fonction du paramètre range
    switch (range) {
      case "7d":
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "30d":
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);
        break;
      case "90d":
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 90);
        break;
      case "ytd":
        startDate = new Date(new Date().getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);
    }

    // 1. Statistiques des produits
    const productStats = await Product.aggregate([
      {
        $match: {
          seller: vendorId,
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const productStatusCount = {};
    productStats.forEach((stat) => {
      productStatusCount[stat._id] = stat.count;
    });

    // 2. Statistiques des ventes et revenus
    const salesStats = await Order.aggregate([
      {
        $match: {
          "items.sellerId": vendorId,
          "items.itemStatus": "delivered",
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      { $unwind: "$items" },
      {
        $match: {
          "items.sellerId": vendorId.toString(),
          "items.itemStatus": "delivered",
        },
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: 1 },
          totalRevenue: { $sum: "$items.priceAtPurchase" },
        },
      },
    ]);

    // 3. Statistiques des clients uniques
    const customerStats = await Order.aggregate([
      {
        $match: {
          "items.sellerId": vendorId,
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: "$userId",
          orderCount: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: null,
          totalCustomers: { $sum: 1 },
        },
      },
    ]);

    // 4. Données pour le graphique des ventes
    const salesChartData = await Order.aggregate([
      {
        $match: {
          "items.sellerId": vendorId,
          "items.itemStatus": "delivered",
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      { $unwind: "$items" },
      {
        $match: {
          "items.sellerId": vendorId.toString(),
          "items.itemStatus": "delivered",
        },
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          },
          sales: { $sum: 1 },
          revenue: { $sum: "$items.priceAtPurchase" },
        },
      },
      { $sort: { "_id.date": 1 } },
    ]);

    // 5. Données pour le graphique des catégories
    const categoryStats = await Product.aggregate([
      {
        $match: {
          seller: vendorId,
          status: "active",
        },
      },
      {
        $group: {
          _id: "$category.main",
          count: { $sum: 1 },
          revenue: {
            $sum: {
              $multiply: ["$price", { $ifNull: ["$salesCount", 0] }],
            },
          },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // 6. Commandes récentes
    const recentOrders = await Order.aggregate([
      {
        $match: {
          "items.sellerId": vendorId,
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      },
      { $unwind: "$items" },
      {
        $match: {
          "items.sellerId": vendorId.toString(),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "customer",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "items.productId",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $project: {
          customer: { $arrayElemAt: ["$customer.fullName", 0] },
          product: { $arrayElemAt: ["$product.name", 0] },
          amount: "$items.priceAtPurchase",
          status: "$items.itemStatus",
          createdAt: 1,
        },
      },
      { $sort: { createdAt: -1 } },
      { $limit: 5 },
    ]);

    // 7. Métriques de performance
    // Taux de conversion (approximatif)
    const conversionStats = await Order.aggregate([
      {
        $match: {
          "items.sellerId": vendorId,
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          deliveredOrders: {
            $sum: {
              $cond: [{ $eq: ["$items.itemStatus", "delivered"] }, 1, 0],
            },
          },
        },
      },
    ]);

    const conversionRate = conversionStats[0]
      ? (
          (conversionStats[0].deliveredOrders /
            conversionStats[0].totalOrders) *
          100
        ).toFixed(1)
      : 0;

    // Formater les données de réponse
    const responseData = {
      stats: {
        activeProducts: productStatusCount.active || 0,
        totalSales: salesStats[0]?.totalSales || 0,
        totalRevenue: salesStats[0]?.totalRevenue || 0,
        totalCustomers: customerStats[0]?.totalCustomers || 0,
      },
      chartData: {
        sales: salesChartData.map((item) => ({
          date: item._id.date,
          sales: item.sales,
          revenue: item.revenue,
        })),
        categories: categoryStats.map((item) => ({
          name: item._id,
          value: item.count,
          revenue: item.revenue,
        })),
      },
      recentOrders: recentOrders,
      performance: {
        conversionRate: parseFloat(conversionRate),
        satisfactionRate: 96, // Valeur simulée - à implémenter avec des reviews
        returnRate: 2.3, // Valeur simulée
        responseTime: 2.4, // Valeur simulée
      },
    };

    res.json(responseData);
  } catch (error) {
    console.error("Error in getVendorStats:", error);
    next(error);
  }
};
