import { useState, useEffect } from "react";
import {
  Package,
  Users,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  BarChart3,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Star,
  Calendar,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { motion } from "framer-motion";
import VendorNav from "../../components/VendorNav";
import { useStatStore } from "../../store/stats.store";

const DashboardPage = () => {
  const [timeRange, setTimeRange] = useState("30d");
  const {
    getVendorStats,
    vendorStats,
    isLoading,
    performance,
    recentOrders,
    chartData,
  } = useStatStore();

  useEffect(() => {
    getVendorStats(timeRange);
  }, [timeRange, getVendorStats]);

  // Préparer les données pour les graphiques
  const salesChartData = chartData?.sales || [];
  const categoryChartData = chartData?.categories || [];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  const statsCards = [
    {
      title: "Produits Actifs",
      value: vendorStats?.activeProducts || 0,
      icon: Package,
      color: "blue",
    },
    {
      title: "Ventes Total",
      value: vendorStats?.totalSales || 0,
      icon: ShoppingCart,
      color: "green",
    },
    {
      title: "Revenus",
      value: `$${vendorStats?.totalRevenue?.toLocaleString() || "0"}`,
      icon: DollarSign,
      color: "purple",
    },
    {
      title: "Clients",
      value: vendorStats?.totalCustomers || 0,
      icon: Users,
      color: "orange",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  // Formater les données pour le graphique des ventes
  const formattedSalesData = salesChartData.map(item => ({
    date: item.date,
    sales: item.sales,
    revenue: item.revenue
  }));

  // Formater les données pour le graphique des catégories
  const formattedCategoryData = categoryChartData.map(item => ({
    name: item.name,
    value: item.value,
    revenue: item.revenue
  }));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="fixed top-0 left-0 right-0 h-16 z-50">
        <VendorNav />
      </header>

      <div className="pt-16">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-between items-center mb-8"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Tableau de Bord
              </h1>
              <p className="text-gray-600 mt-2">
                Bienvenue dans votre espace vendeur
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm border">
                <Calendar className="w-5 h-5 text-gray-400" />
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="bg-transparent border-none focus:ring-0 text-gray-700"
                >
                  <option value="7d">7 derniers jours</option>
                  <option value="30d">30 derniers jours</option>
                  <option value="90d">3 derniers mois</option>
                  <option value="ytd">Cette année</option>
                </select>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => getVendorStats(timeRange)}
                className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {statsCards.map((card, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {card.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {card.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full bg-${card.color}-100`}>
                    <card.icon className={`w-6 h-6 text-${card.color}-600`} />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Charts Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
          >
            {/* Sales Chart */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Évolution des Ventes
                </h3>
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={formattedSalesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "none",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                      }}
                      formatter={(value, name) => {
                        if (name === "sales") return [value, "Ventes"];
                        if (name === "revenue") return [`$${value}`, "Revenu"];
                        return [value, name];
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: "#2563eb" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Categories Chart */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Ventes par Catégorie
                </h3>
                <BarChart3 className="w-5 h-5 text-green-600" />
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={formattedCategoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {formattedCategoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name, props) => {
                        if (props.payload.revenue) {
                          return [`$${props.payload.revenue}`, "Revenu"];
                        }
                        return [value, "Produits"];
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>

          {/* Recent Orders & Performance */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Commandes Récentes
                </h3>
                <ShoppingCart className="w-5 h-5 text-purple-600" />
              </div>
              <div className="space-y-4">
                {recentOrders && recentOrders.length > 0 ? (
                  recentOrders.map((order, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {order.customer || "Client"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {order.product || "Produit"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          ${order.amount || 0}
                        </p>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === "Livré" || order.status === "delivered"
                              ? "bg-green-100 text-green-800"
                              : order.status === "Expédié" || order.status === "shipped"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {order.status || "En traitement"}
                        </span>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    Aucune commande récente
                  </p>
                )}
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Performance
                </h3>
                <Star className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">
                      Taux de Conversion
                    </span>
                    <span className="text-sm font-semibold text-green-600">
                      {performance?.conversionRate || 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${performance?.conversionRate || 0}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">
                      Satisfaction Clients
                    </span>
                    <span className="text-sm font-semibold text-blue-600">
                      {performance?.satisfactionRate || 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${performance?.satisfactionRate || 0}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">
                      Taux de Retour
                    </span>
                    <span className="text-sm font-semibold text-red-600">
                      {performance?.returnRate || 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{ width: `${performance?.returnRate || 0}%` }}
                    ></div>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      Temps de Réponse Moyen
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {performance?.responseTime || 0}h
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;