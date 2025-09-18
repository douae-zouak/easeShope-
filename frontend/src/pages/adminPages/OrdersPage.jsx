import { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { useOrderStore } from "../../store/order.store";
import VendorNav from "../../components/VendorNav";
import { AlertCircle, CheckCircle, Clock, Package, Truck } from "lucide-react";

const OrderTable = () => {
  const { sellerOrders, getSellerOrders, isLoading, updateOrderItemStatus } =
    useOrderStore();
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getSellerOrders();
  }, []);

  // Function to change item status
  const handleStatusChange = async (orderId, itemId, newStatus) => {
    try {
      await updateOrderItemStatus(orderId, itemId, newStatus);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // Get color based on status
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "packing":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-purple-100 text-purple-800";
      case "shipped":
        return "bg-indigo-100 text-indigo-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Options for status selector with English labels
  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "packing", label: "Packing" },
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
  ];

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

  // Filter orders by status and search query
  const filteredOrders = sellerOrders.filter((order) => {
    // Status filter
    const statusMatch =
      statusFilter === "all" ||
      order.items.some((item) => item.itemStatus === statusFilter);

    // Search filter
    const searchMatch =
      searchQuery === "" ||
      // Check order number
      order.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      // Check shipping address name
      order.shippingAddress?.name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      // Check items for product name or SKU
      order.items.some(
        (item) =>
          item.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.sku?.toLowerCase().includes(searchQuery.toLowerCase())
      );

    return statusMatch && searchMatch;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-17">
      <header className="fixed top-0 left-0 right-0 h-16 z-10">
        <VendorNav />
      </header>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0">
          My Orders
        </h1>

        <div className="flex flex-col md:flex-row gap-10">
          {/* Search input */}
          <div className="relative ">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search orders"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:outline-none focus:border-indigo-200 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
            />
          </div>

          {/* Status filter */}
          <div className="flex items-center space-x-2">
            <span className="text-gray-700">Filter by status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-gray-300 py-2 px-3 focus:outline-none focus:border-indigo-200 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
            >
              <option value="all">All statuses</option>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <p className="text-gray-500 text-lg">
            {searchQuery || statusFilter !== "all"
              ? "No orders match your search criteria"
              : "You don't have any orders yet"}
          </p>
          {(searchQuery || statusFilter !== "all") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
              }}
              className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const overallStatus = getOverallOrderStatus(order);
            return (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow overflow-hidden"
              >
                {/* Order header */}
                <div
                  className="p-4 bg-gray-50 flex justify-between items-center cursor-pointer"
                  onClick={() =>
                    setExpandedOrder(
                      expandedOrder === order._id ? null : order._id
                    )
                  }
                >
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Order #{order.orderNumber}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mr-2 ${getStatusColor(
                        overallStatus
                      )}`}
                    >
                      {getStatusIcon(overallStatus)}
                      <span className="ml-1 capitalize">{overallStatus}</span>
                    </span>
                    <span className="text-sm text-gray-600 mr-4">
                      {order.items.length} item(s)
                    </span>
                    <motion.div
                      animate={{
                        rotate: expandedOrder === order._id ? 180 : 0,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <svg
                        className="w-5 h-5 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </motion.div>
                  </div>
                </div>

                {/* Order items (appears with animation) */}
                <AnimatePresence>
                  {expandedOrder === order._id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 border-t">
                        <h4 className="font-medium text-gray-700 mb-3">
                          Items:
                        </h4>
                        <div className="space-y-4">
                          {order.items.map((item) => (
                            <motion.div
                              key={item._id || `${order._id}-${item.productId}`}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.1 }}
                              className="flex flex-col md:flex-row items-start p-4 rounded-lg border border-gray-200"
                            >
                              <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-md overflow-hidden mb-3 md:mb-0">
                                {item.colorImages &&
                                item.colorImages.length > 0 ? (
                                  <img
                                    src={item.colorImages[0]}
                                    alt={item.productName}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <svg
                                      className="w-8 h-8"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </div>
                                )}
                              </div>

                              <div className="flex-1 md:ml-4">
                                <h5 className="font-medium text-gray-800">
                                  {item.productName}
                                </h5>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  <span className="text-sm text-gray-600">
                                    Qty: {item.quantity}
                                  </span>
                                  {item.size && (
                                    <span className="text-sm text-gray-600">
                                      Size: {item.size}
                                    </span>
                                  )}
                                  <div className="flex items-center">
                                    <span className="text-sm text-gray-600 mr-1">
                                      Color:
                                    </span>
                                    <div
                                      className="w-4 h-4 rounded-full border border-gray-300"
                                      style={{
                                        backgroundColor:
                                          item.colorCode || "#ccc",
                                      }}
                                      title={item.colorTitle}
                                    ></div>
                                  </div>
                                  <span className="text-sm text-gray-600">
                                    SKU: {item.sku}
                                  </span>
                                  <span className="text-sm font-medium">
                                    Price: {item.priceAtPurchase?.toFixed(2)} DH
                                  </span>
                                </div>
                              </div>

                              <div className="mt-3 md:mt-0 md:ml-4 w-full md:w-auto">
                                <div className="flex flex-col items-start md:items-end">
                                  <span
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                      item.itemStatus
                                    )}`}
                                  >
                                    {item.itemStatus === "pending" && "Pending"}
                                    {item.itemStatus === "packing" && "Packing"}
                                    {item.itemStatus === "processing" &&
                                      "Processing"}
                                    {item.itemStatus === "shipped" && "Shipped"}
                                    {item.itemStatus === "delivered" &&
                                      "Delivered"}
                                  </span>

                                  {/* Status selector - only if status is not "delivered" */}
                                  {item.itemStatus !== "delivered" && (
                                    <div className="mt-2 w-full md:w-40">
                                      <select
                                        value={item.itemStatus}
                                        onChange={(e) =>
                                          handleStatusChange(
                                            order._id,
                                            item._id,
                                            e.target.value
                                          )
                                        }
                                        className="block w-full rounded-md border border-gray-300 py-1.5 px-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                      >
                                        {statusOptions
                                          .filter((option) => {
                                            // Prevent going back in status flow
                                            const currentStatusIndex =
                                              statusOptions.findIndex(
                                                (o) =>
                                                  o.value === item.itemStatus
                                              );
                                            const optionIndex =
                                              statusOptions.findIndex(
                                                (o) => o.value === option.value
                                              );
                                            return (
                                              optionIndex >= currentStatusIndex
                                            );
                                          })
                                          .map((option) => (
                                            <option
                                              key={option.value}
                                              value={option.value}
                                            >
                                              {option.label}
                                            </option>
                                          ))}
                                      </select>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Shipping address */}
                      {order.shippingAddress && (
                        <div className="p-4 bg-gray-50 border-t">
                          <h4 className="font-medium text-gray-700 mb-2">
                            Shipping Address:
                          </h4>
                          <p className="text-sm text-gray-800">
                            {order.shippingAddress.name}
                          </p>
                          <p className="text-sm text-gray-800">
                            {order.shippingAddress.street}
                          </p>
                          <p className="text-sm text-gray-800">
                            {order.shippingAddress.postalCode}{" "}
                            {order.shippingAddress.city}
                          </p>
                          <p className="text-sm text-gray-800">
                            {order.shippingAddress.phoneNumber}
                          </p>
                          <p className="text-sm text-gray-800">
                            {order.shippingAddress.email}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderTable;
