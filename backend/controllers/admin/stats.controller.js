const User = require("../../models/user.model");
const Product = require("../../models/product.model");
const Order = require("../../models/Order.model");

exports.getAdminStats = async (req, res, next) => {
  try {
    // Récupérer les statistiques des produits
    const productStats = await Product.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Convertir le résultat en format plus lisible
    const productStatusCount = {};
    productStats.forEach((stat) => {
      productStatusCount[stat._id] = stat.count;
    });

    // Récupérer les statistiques des vendeurs
    const sellerStats = await User.aggregate([
      { $match: { role: "vendor" } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          active: {
            $sum: { $cond: [{ $eq: ["$isActive", true] }, 1, 0] },
          },
          newThisMonth: {
            $sum: {
              $cond: [
                {
                  $gte: [
                    "$createdAt",
                    new Date(new Date().setDate(new Date().getDate() - 30)),
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    // Récupérer les statistiques des ventes et revenus
    const salesStats = await Order.aggregate([
      { $match: { "items.itemStatus": "delivered" } },
      {
        $group: {
          _id: null,
          totalSales: { $sum: { $size: "$items" } },
          totalRevenue: { $sum: "$total" },
        },
      },
    ]);

    // Récupérer les tops vendeurs (les plus de ventes)
    const topSellers = await Order.aggregate([
      { $unwind: "$items" },
      { $match: { "items.itemStatus": "delivered" } },
      {
        $group: {
          _id: "$items.sellerId",
          totalSales: { $sum: 1 },
          totalRevenue: { $sum: "$items.priceAtPurchase" },
        },
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "sellerInfo",
        },
      },
      {
        $lookup: {
          from: "products",
          let: { sellerId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$seller", "$$sellerId"] },
                status: "active", // Seulement les produits actifs
              },
            },
          ],
          as: "sellerProducts",
        },
      },
      {
        $project: {
          name: { $arrayElemAt: ["$sellerInfo.fullName", 0] },
          profilePhoto: { $arrayElemAt: ["$sellerInfo.profilePhoto", 0] },
          products: { $size: "$sellerProducts" }, // Compter les produits actifs du vendeur
          sales: "$totalSales",
          revenue: "$totalRevenue",
        },
      },
    ]);

    // Données pour le graphique d'évolution (12 derniers mois)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    // Évolution des revenus par mois
    const revenueEvolution = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: twelveMonthsAgo },
          "items.itemStatus": "delivered",
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          revenue: { $sum: "$total" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // Évolution des produits ajoutés par mois
    const productEvolution = await Product.aggregate([
      {
        $match: {
          createdAt: { $gte: twelveMonthsAgo },
          status: "active",
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          products: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // Fusionner les données pour le graphique
    const monthNames = [
      "Jan",
      "Fév",
      "Mar",
      "Avr",
      "Mai",
      "Juin",
      "Juil",
      "Août",
      "Sep",
      "Oct",
      "Nov",
      "Déc",
    ];

    const chartData = [];

    // Créer un objet pour chaque mois des 12 derniers mois
    for (let i = 0; i < 12; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      const revenueData = revenueEvolution.find(
        (item) => item._id.year === year && item._id.month === month
      );

      const productData = productEvolution.find(
        (item) => item._id.year === year && item._id.month === month
      );

      chartData.unshift({
        month: `${monthNames[date.getMonth()]} ${year}`,
        revenue: revenueData ? revenueData.revenue : 0,
        products: productData ? productData.products : 0,
      });
    }

    // Formater la réponse selon la structure attendue par le frontend
    const responseData = {
      stats: {
        totalProducts:
          (productStatusCount.active || 0) +
          (productStatusCount.pending || 0) +
          (productStatusCount.draft || 0),
        activeProducts: productStatusCount.active || 0,
        pendingProducts: productStatusCount.pending || 0,
        totalSellers: sellerStats[0]?.total || 0,
        activeSellers: sellerStats[0]?.active || 0,
        newSellers: sellerStats[0]?.newThisMonth || 0,
        totalSales: salesStats[0]?.totalSales || 0,
        totalRevenue: salesStats[0]?.totalRevenue || 0,
      },
      topSellers: topSellers,
      chartData: chartData,
    };

    res.json(responseData);
  } catch (error) {
    console.error("Error in getAdminStats:", error);
    next(error);
  }
};

exports.getTimeRangeStats = async (req, res, next) => {
  try {
    const { range } = req.params;

    let startDate;
    const endDate = new Date();

    // Définir la période en fonction du paramètre range
    switch (range) {
      case "today":
        startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        break;
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
        startDate = new Date(0); // Toutes les données
    }

    // Récupérer les statistiques pour la période spécifiée
    const [productStats, sellerStats, salesStats] = await Promise.all([
      // Statistiques produits
      Product.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),

      // Statistiques vendeurs
      User.aggregate([
        {
          $match: {
            role: "vendor",
            createdAt: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
          },
        },
      ]),

      // Statistiques ventes
      Order.aggregate([
        {
          $match: {
            status: "delivered",
            createdAt: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: null,
            totalSales: { $sum: 1 },
            totalRevenue: { $sum: "$total" },
          },
        },
      ]),
    ]);

    // Convertir les statistiques produits
    const productStatusCount = {};
    productStats.forEach((stat) => {
      productStatusCount[stat._id] = stat.count;
    });

    res.json({
      totalProducts:
        productStatusCount.active +
          productStatusCount.pending +
          productStatusCount.draft || 0,
      activeProducts: productStatusCount.active || 0,
      pendingProducts: productStatusCount.pending || 0,
      newSellers: sellerStats[0]?.count || 0,
      totalSales: salesStats[0]?.totalSales || 0,
      totalRevenue: salesStats[0]?.totalRevenue || 0,
    });
  } catch (error) {
    next(error);
  }
};
