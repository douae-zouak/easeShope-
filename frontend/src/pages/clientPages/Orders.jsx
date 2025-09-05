import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import {
  Truck,
  Package,
  CheckCircle,
  Clock,
  AlertCircle,
  MapPin,
  CreditCard,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  MoveLeft,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useOrderStore } from "../../store/order.store";
import { useEffect } from "react";

const Orders = () => {
  const { clientOrders, getClientOrders } = useOrderStore();
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [sortBy, setSortBy] = useState("newest");

  // Fonction pour obtenir la couleur du statut
  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "packing":
        return "bg-purple-100 text-purple-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Fonction pour obtenir l'icône du statut
  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return <CheckCircle size={18} />;
      case "shipped":
        return <Truck size={18} />;
      case "processing":
        return <Package size={18} />;
      case "packing":
        return <Package size={18} />;
      case "pending":
        return <Clock size={18} />;
      default:
        return <AlertCircle size={18} />;
    }
  };

  // Fonction pour déterminer le statut global d'une commande
  const getOverallOrderStatus = (order) => {
    const statusPriority = {
      pending: 1,
      processing: 2,
      packing: 3,
      shipped: 4,
      delivered: 5,
    };

    // Trouver le statut le plus bas dans la commande
    let lowestStatus = "delivered";
    for (const item of order.items) {
      if (statusPriority[item.itemStatus] < statusPriority[lowestStatus]) {
        lowestStatus = item.itemStatus;
      }
    }

    return lowestStatus;
  };

  // Filtrer et trier les commandes
  const filteredOrders = clientOrders
    .filter((order) => {
      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "processing" &&
          order.items.some(
            (item) =>
              item.itemStatus === "processing" || item.itemStatus === "packing"
          )) ||
        order.items.some((item) => item.itemStatus === filterStatus);

      const matchesSearch =
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.items.some((item) =>
          item.productName.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "newest")
        return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "oldest")
        return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === "total-high") return b.total - a.total;
      if (sortBy === "total-low") return a.total - b.total;
      return 0;
    });

  // Animation variants
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
      },
    },
  };

  useEffect(() => {
    getClientOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-row items-center gap-3 pt-5 ml-16">
        <Link to="/home">
          <MoveLeft
            size={18}
            className="fill-blue-500 text-blue-500 cursor-pointer hover:scale-110 transition-transform"
          />
        </Link>
        <div className="flex flex-row items-center gap-2">
          <Link
            to="/home"
            className="text-blue-500 cursor-pointer hover:text-blue-700 font-semibold"
          >
            Home
          </Link>
          <span className="text-blue-500 font-bold">-</span>
          <Link className="text-blue-500 cursor-pointer hover:text-blue-700 font-semibold">
            Orders
          </Link>
        </div>
      </div>
      {console.log("orders : ", clientOrders)}

      <div className="max-w-4xl mx-auto">
        <motion.h1
          className="text-3xl font-bold text-gray-900 mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Order Tracking
        </motion.h1>

        {/* Filters and search */}
        <motion.div
          className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-200"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search for an order or a product..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <select
                  className="appearance-none block w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg shadow-sm leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All statuses</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="packing">Packing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <Filter size={16} />
                </div>
              </div>

              <div className="relative">
                <select
                  className="appearance-none block w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg shadow-sm leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="total-high">Total (high to low)</option>
                  <option value="total-low">Total (low to high)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Orders list */}
        {filteredOrders.length === 0 ? (
          <motion.div
            className="bg-white rounded-xl shadow-md p-8 text-center border border-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              No orders found
            </h3>
            <p className="mt-1 text-gray-500">
              No orders match your search criteria.
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {filteredOrders.map((order) => {
              const overallStatus = getOverallOrderStatus(order);
              return (
                <motion.div
                  key={order._id}
                  variants={itemVariants}
                  className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  {/* Order header */}
                  <div
                    className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center cursor-pointer hover:bg-gray-50 transition"
                    onClick={() =>
                      setExpandedOrder(
                        expandedOrder === order._id ? null : order._id
                      )
                    }
                  >
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h3 className="text-lg font-semibold text-gray-900 mr-3">
                          Order #{order.orderNumber}
                        </h3>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            overallStatus
                          )}`}
                        >
                          {getStatusIcon(overallStatus)}
                          <span className="ml-1 capitalize">
                            {overallStatus}
                          </span>
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Ordered on:{" "}
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="mt-3 sm:mt-0 flex items-center">
                      <div className="text-right mr-3">
                        <p className="text-sm text-gray-500">Total</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {order.total.toFixed(2)} DH
                        </p>
                      </div>
                      {expandedOrder === order._id ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* Order details */}
                  <AnimatePresence>
                    {expandedOrder === order._id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden bg-gray-50"
                      >
                        {/* Products */}
                        <div className="p-6 border-b border-gray-200">
                          <h4 className="text-md font-semibold text-gray-900 mb-3">
                            Products
                          </h4>
                          <div className="space-y-4">
                            {order.items.map((item, index) => (
                              <div
                                key={index}
                                className="flex items-start bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition"
                              >
                                <div
                                  className="flex-shrink-0 h-16 w-16 rounded-md overflow-hidden border border-gray-200"
                                  style={{ backgroundColor: item.colorCode }}
                                >
                                  {item.colorImages &&
                                  item.colorImages.length > 0 ? (
                                    <img
                                      src={item.colorImages[0]}
                                      alt={item.productName}
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <div className="h-full w-full flex items-center justify-center">
                                      <Package className="h-8 w-8 text-gray-400" />
                                    </div>
                                  )}
                                </div>
                                <div className="ml-4 flex-1">
                                  <div className="flex justify-between">
                                    <div>
                                      <h5 className="text-sm font-medium text-gray-900">
                                        {item.productName}
                                      </h5>
                                      <p className="mt-1 text-xs text-gray-500">
                                        {item.colorTitle} | {item.size} | Qty:{" "}
                                        {item.quantity}
                                      </p>
                                    </div>
                                    <p className="text-sm font-medium text-gray-900">
                                      {(
                                        item.priceAtPurchase * item.quantity
                                      ).toFixed(2)}{" "}
                                      DH
                                    </p>
                                  </div>
                                  <div className="mt-1 flex items-center">
                                    <span
                                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(
                                        item.itemStatus
                                      )}`}
                                    >
                                      {getStatusIcon(item.itemStatus)}
                                      <span className="ml-1 capitalize">
                                        {item.itemStatus}
                                      </span>
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Delivery address & Payment info */}
                        <div className="p-6 border-b border-gray-200">
                          <h4 className="text-md font-semibold text-gray-900 mb-3">
                            Delivery Address
                          </h4>
                          <div className="flex items-start gap-2">
                            <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0 mt-1" />
                            <div className="text-sm text-gray-700 space-y-1">
                              <p>
                                <span className="font-medium">Recipient:</span>{" "}
                                {order.shippingAddress.name}
                              </p>
                              <p>
                                <span className="font-medium">Street:</span>{" "}
                                {order.shippingAddress.street}
                              </p>
                              <p>
                                <span className="font-medium">Location:</span>{" "}
                                {order.shippingAddress.postalCode}{" "}
                                {order.shippingAddress.city}
                              </p>
                              <p>
                                <span className="font-medium">Phone:</span>{" "}
                                {order.shippingAddress.phoneNumber}
                              </p>
                              <p>
                                <span className="font-medium">Email:</span>{" "}
                                {order.shippingAddress.email}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                          <div>
                            <h4 className="text-md font-semibold text-gray-900 mb-2">
                              Payment Information
                            </h4>
                            <div className="flex items-center text-gray-600">
                              <CreditCard className="h-5 w-5 mr-2" />
                              Paid by PayPal
                            </div>
                          </div>
                          <div className="mt-4 sm:mt-0">
                            <div className="flex justify-between sm:block text-right">
                              <p className="text-sm text-gray-500">Subtotal</p>
                              <p className="text-base font-medium text-gray-900">
                                {order.total.toFixed(2)} DH
                              </p>
                            </div>
                            <div className="mt-2 flex justify-between sm:block text-right">
                              <p className="text-sm text-gray-500">Shipping</p>
                              <p className="text-base font-medium text-gray-900">
                                Free
                              </p>
                            </div>
                            <div className="mt-2 pt-2 flex justify-between sm:block text-right border-t border-gray-200">
                              <p className="text-sm font-medium text-gray-900">
                                Total
                              </p>
                              <p className="text-lg font-semibold text-gray-900">
                                {order.total.toFixed(2)} DH
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Orders;
