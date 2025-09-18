import VendorNav from "../../components/VendorNav";
import { useState, useEffect } from "react";
import {
  Package,
  Users,
  DollarSign,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { useStatStore } from "../../store/stats.store";
import { useProductStore } from "../../store/product.store";
import { Link } from "react-router-dom";

const DashboardPage = () => {
  const [timeRange, setTimeRange] = useState("7d");

  const { getAdminStats, stats, chartData, topSellers } = useStatStore();
  const { getColor, getInitial } = useProductStore();

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    getAdminStats();
  }, []);

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded shadow-md">
          <p className="font-medium text-gray-800">{`Mois: ${label}`}</p>
          <p className="text-blue-600">{`Produits: ${payload[0].value}`}</p>
          <p className="text-green-600">{`Revenus: ${payload[1].value?.toLocaleString()} DH`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="fixed top-0 left-0 right-0 h-16 z-10">
        <VendorNav />
      </header>

      <div className="pt-16">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-900 pl-6">
          Admin Dashboard
        </h1>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Time Range Selector */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-semibold text-gray-900">Overview</h2>
            <div className="flex space-x-2">
              {["Today", "7d", "30d", "90d", "YTD", "All"].map((range) => (
                <button
                  key={range}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    timeRange === range
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setTimeRange(range)}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Products Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <Package className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">
                    Total Products
                  </h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalProducts}
                  </p>
                </div>
              </div>
            </div>

            {/* Active Sellers Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <Users className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">
                    Active Sellers
                  </h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.activeSellers}
                  </p>
                </div>
              </div>
            </div>

            {/* Total Sales Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                  <ShoppingCart className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">
                    Total Sales
                  </h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalSales.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Total Revenue Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">
                    Total Revenue
                  </h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalRevenue.toLocaleString()} DH
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Evolution Chart */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Évolution des Produits et Revenus
              </h2>
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="products"
                    stroke="#3b82f6"
                    fill="#93c5fd"
                    name="Produits ajoutés"
                  />
                  <Area
                    yAxisId="right"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    fill="#6ee7b7"
                    name="Revenus (DH)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Top Sellers */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    Top Sellers
                  </h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {topSellers.map((seller) => {
                    const photo = seller?.profilePhoto
                      ? `${API_URL}${seller.profilePhoto}`
                      : null;

                    return (
                      <div key={seller._id} className="px-6 py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Link to={`/admin/sellersInfo/${seller._id}`}>
                              {photo ? (
                                <img
                                  src={photo}
                                  alt="Profile"
                                  className="w-10 h-10 rounded-full border hover:ring-2 hover:ring-indigo-500 transition"
                                />
                              ) : (
                                <div
                                  className={`w-10 h-10 rounded-full border flex items-center justify-center text-xl font-medium hover:ring-2 hover:ring-gray-300 ${getColor(
                                    seller?.name
                                  )}`}
                                >
                                  {getInitial(seller?.name)}
                                </div>
                              )}
                            </Link>
                            <div className="ml-4">
                              <p className="text-sm font-medium text-gray-900">
                                {seller.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {seller.products} products
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">
                              {seller.revenue.toLocaleString()} DH
                            </p>
                            <p className="text-sm text-gray-500">
                              {seller.sales} sales
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Additional Stats */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Products by Status */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    Products by Status
                  </h3>
                </div>
                <div className="px-6 py-4">
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-sm font-medium">Active</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {stats.activeProducts}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                      <span className="text-sm font-medium">Pending</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {stats.pendingProducts}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-gray-500 mr-2"></div>
                      <span className="text-sm font-medium">Draft</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {stats.totalProducts -
                        stats.activeProducts -
                        stats.pendingProducts}
                    </span>
                  </div>
                </div>
              </div>

              {/* Sellers Overview */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    Sellers Overview
                  </h3>
                </div>
                <div className="px-6 py-4">
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                      <span className="text-sm font-medium">Total Sellers</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {stats.totalSellers}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-sm font-medium">Active</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {stats.activeSellers}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                      <span className="text-sm font-medium">
                        New This Month
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {stats.newSellers}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
