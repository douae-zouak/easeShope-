import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { useReturnStore } from "../../store/return.store";
import AdminNavbar from "../../components/AdminNavbar";

const ReturnsRequestsPage = () => {
  const [statusUpdates, setStatusUpdates] = useState({});
  const [notesUpdates, setNotesUpdates] = useState({});
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("30days");
  const [expandedOrders, setExpandedOrders] = useState({});
  const [validationErrors, setValidationErrors] = useState({});

  const { getReturnProduct, ordersRequested, updateReturnStatus, isLoading } =
    useReturnStore();

  useEffect(() => {
    getReturnProduct();
  }, []);

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const handleStatusUpdate = async (productId, status) => {
    const notes = notesUpdates[productId] || "";

    // Validate that notes are provided for rejections
    if (status === "rejected" && !notes.trim()) {
      setValidationErrors((prev) => ({
        ...prev,
        [productId]: "Notes are required for rejections",
      }));
      return;
    }

    // Clear any previous validation errors
    setValidationErrors((prev) => ({ ...prev, [productId]: "" }));

    await updateReturnStatus(productId, status, notes);

    // Réinitialiser les états pour ce produit
    setStatusUpdates((prev) => ({ ...prev, [productId]: "" }));
    setNotesUpdates((prev) => ({ ...prev, [productId]: "" }));
  };

  const updateStatusForProduct = (productId, status) => {
    setStatusUpdates((prev) => ({ ...prev, [productId]: status }));

    // Clear validation error when status changes
    if (status !== "rejected") {
      setValidationErrors((prev) => ({ ...prev, [productId]: "" }));
    }
  };

  const updateNotesForProduct = (productId, notes) => {
    setNotesUpdates((prev) => ({ ...prev, [productId]: notes }));

    // Clear validation error when notes are added
    if (notes.trim()) {
      setValidationErrors((prev) => ({ ...prev, [productId]: "" }));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "requested":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "approved":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "requested":
        return "Requested";
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      case "completed":
        return "Completed";
      case "not requested":
        return "Not requested";
      default:
        return status;
    }
  };

  // Get the highest priority status in an order for the header display
  const getOrderStatusSummary = (order) => {
    const statuses = order.items
      .filter((item) => item.returnRequested)
      .map((item) => item.returnStatus);

    if (statuses.includes("rejected"))
      return {
        status: "rejected",
        count: statuses.filter((s) => s === "rejected").length,
      };
    if (statuses.includes("approved"))
      return {
        status: "approved",
        count: statuses.filter((s) => s === "approved").length,
      };
    if (statuses.includes("requested"))
      return {
        status: "requested",
        count: statuses.filter((s) => s === "requested").length,
      };

    return { status: "unknown", count: 0 };
  };

  const filteredOrders = ordersRequested.filter(
    (order) =>
      order.items.some((item) => item.returnRequested) &&
      (statusFilter === "all" ||
        order.items.some((item) => item.returnStatus === statusFilter))
  );

  // Get border color based on the most significant status in the order
  const getOrderBorderColor = (order) => {
    const statusSummary = getOrderStatusSummary(order);

    switch (statusSummary.status) {
      case "rejected":
        return "border-l-red-500";
      case "approved":
        return "border-l-blue-500";
      case "requested":
        return "border-l-yellow-500";
      default:
        return "border-l-gray-300";
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-60vh gap-5">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        <p className="text-gray-600">Loading pending products...</p>
      </div>
    );
  }

  return (
    <>
      <header className="fixed top-0 right-0 z-10 bg-white w-full">
        <AdminNavbar />
      </header>
      <div className="max-w-7xl mx-auto bg-gray-50 p-6 mt-10">
        <motion.h1
          className="text-3xl font-light text-gray-900 mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          Returns Management
        </motion.h1>

        {/* Filters at the top */}
        <motion.div
          className="bg-white shadow-sm border border-gray-200 p-5 mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <h3 className="text-lg font-medium text-gray-900">
              Filter returns
            </h3>

            <div className="flex flex-col gap-5 w-[30%] sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black text-sm py-2 px-3"
                >
                  <option value="all">All statuses</option>
                  <option value="requested">Requested</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Period
                </label>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black text-sm py-2 px-3"
                >
                  <option value="30days">Last 30 days</option>
                  <option value="7days">Last 7 days</option>
                  <option value="3days">Last 3 days</option>
                  <option value="today">Today</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* List of returns */}
        <div className="space-y-6">
          <AnimatePresence>
            {filteredOrders.map((order) => {
              const statusSummary = getOrderStatusSummary(order);
              const isExpanded = expandedOrders[order._id];

              return (
                <motion.div
                  key={order._id}
                  className={`bg-white shadow-sm border border-gray-200 overflow-hidden border-l-4 ${getOrderBorderColor(
                    order
                  )}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className="p-5 border-b border-gray-200 cursor-pointer"
                    onClick={() => toggleOrderExpansion(order._id)}
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                      <div className="flex items-center">
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="mr-3"
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
                        <div>
                          <h2 className="text-lg font-medium text-gray-900">
                            Order #{order.orderNumber}
                          </h2>
                          <p className="text-sm text-gray-600 mt-1">
                            Customer: {order.shippingAddress.name} •{" "}
                            {new Date(order.createdAt).toLocaleDateString(
                              "en-US"
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:mt-0 flex items-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border mr-2 ${getStatusColor(
                            statusSummary.status
                          )}`}
                        >
                          {getStatusText(statusSummary.status)}:{" "}
                          {statusSummary.count}
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                          {
                            order.items.filter((item) => item.returnRequested)
                              .length
                          }{" "}
                          {order.items.filter((item) => item.returnRequested)
                            .length > 1
                            ? "items"
                            : "item"}{" "}
                          to return
                        </span>
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="p-5">
                          {order.items
                            .filter((item) => item.returnRequested)
                            .map((item) => (
                              <motion.div
                                key={item.productId}
                                className={`mb-8 last:mb-0 pb-6 last:pb-0 border-b border-gray-100 last:border-b-0 ${
                                  item.returnStatus === "approved"
                                    ? "bg-blue-50 p-4 rounded-lg"
                                    : item.returnStatus === "rejected"
                                    ? "bg-red-50 p-4 rounded-lg"
                                    : ""
                                }`}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.2 }}
                              >
                                <div className="flex flex-col md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-6">
                                  <img
                                    src={item.colorImages[0]}
                                    alt={item.productName}
                                    className="w-full md:w-24 h-24 object-cover rounded"
                                  />
                                  <div className="flex-1">
                                    <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                                      <div>
                                        <h3 className="text-md font-medium text-gray-900">
                                          {item.productName}
                                        </h3>
                                        <p className="text-sm text-gray-600 mt-1">
                                          Size: {item.size} | Color:{" "}
                                          {item.colorTitle} | Quantity:{" "}
                                          {item.quantity}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                          Price:{" "}
                                          {item.priceAtPurchase.toFixed(2)} DH
                                        </p>
                                      </div>
                                      <div className="mt-2 md:mt-0">
                                        <span
                                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                                            item.returnStatus
                                          )}`}
                                        >
                                          {getStatusText(item.returnStatus)}
                                        </span>
                                      </div>
                                    </div>

                                    <div className="mt-4">
                                      <p className="text-sm text-gray-700">
                                        <span className="font-medium">
                                          Return reason:
                                        </span>{" "}
                                        {item.returnReason}
                                      </p>
                                      <p className="text-sm text-gray-600 mt-1">
                                        Requested on:{" "}
                                        {new Date(
                                          item.returnDate
                                        ).toLocaleDateString("en-US")}
                                      </p>

                                      {item.images &&
                                        item.images.length > 0 && (
                                          <div className="mt-4">
                                            <p className="text-sm font-medium text-gray-700 mb-2">
                                              Return photos:
                                            </p>
                                            <div className="flex space-x-2 overflow-x-auto pb-2">
                                              {item.images.map((img, index) => (
                                                <img
                                                  key={index}
                                                  src={img.url}
                                                  alt={`Return evidence ${
                                                    index + 1
                                                  }`}
                                                  className="w-16 h-16 object-cover rounded border border-gray-200 flex-shrink-0"
                                                />
                                              ))}
                                            </div>
                                          </div>
                                        )}

                                      {/* Show admin notes if they exist */}
                                      {item.adminNotes && (
                                        <div className="mt-4 p-3 bg-gray-100 rounded-md">
                                          <p className="text-sm font-medium text-gray-700">
                                            Admin Notes:
                                          </p>
                                          <p className="text-sm text-gray-600 mt-1">
                                            {item.adminNotes}
                                          </p>
                                        </div>
                                      )}

                                      {/* Only show update controls for items with status "requested" */}
                                      {item.returnStatus === "requested" ? (
                                        <div className="mt-6 pt-4 border-t border-gray-100">
                                          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
                                            <select
                                              value={
                                                statusUpdates[item.productId] ||
                                                ""
                                              }
                                              onChange={(e) =>
                                                updateStatusForProduct(
                                                  item.productId,
                                                  e.target.value
                                                )
                                              }
                                              className="block w-full sm:w-40 rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black text-sm py-2 px-3"
                                            >
                                              <option value="">
                                                Change status
                                              </option>
                                              <option value="approved">
                                                Approve
                                              </option>
                                              <option value="rejected">
                                                Reject
                                              </option>
                                            </select>
                                            <button
                                              onClick={() =>
                                                handleStatusUpdate(
                                                  item.productId,
                                                  statusUpdates[item.productId]
                                                )
                                              }
                                              disabled={
                                                !statusUpdates[
                                                  item.productId
                                                ] ||
                                                (statusUpdates[
                                                  item.productId
                                                ] === "rejected" &&
                                                  !notesUpdates[
                                                    item.productId
                                                  ]?.trim())
                                              }
                                              className="px-4 py-2 bg-black text-white text-sm rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                              Apply
                                            </button>
                                          </div>

                                          {statusUpdates[item.productId] ===
                                            "rejected" && (
                                            <div className="mt-3">
                                              <textarea
                                                placeholder="Reasons for rejection)"
                                                value={
                                                  notesUpdates[
                                                    item.productId
                                                  ] || ""
                                                }
                                                onChange={(e) =>
                                                  updateNotesForProduct(
                                                    item.productId,
                                                    e.target.value
                                                  )
                                                }
                                                rows="2"
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black text-sm py-2 px-3"
                                                required
                                              />
                                              {validationErrors[
                                                item.productId
                                              ] && (
                                                <p className="text-red-500 text-xs mt-1">
                                                  {
                                                    validationErrors[
                                                      item.productId
                                                    ]
                                                  }
                                                </p>
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      ) : (
                                        // Show status locked message for non-pending items
                                        <div className="mt-6 pt-4 border-t border-gray-100">
                                          <p className="text-sm text-gray-500 italic">
                                            Status has been {item.returnStatus}{" "}
                                            and cannot be changed.
                                          </p>
                                          {item.adminNotes && (
                                            <p className="text-sm text-gray-700 mt-2">
                                              <span className="font-medium">
                                                Admin Notes:
                                              </span>{" "}
                                              {item.adminNotes}
                                            </p>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filteredOrders.length === 0 && (
            <motion.div
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-10 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                No returns found
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                No returns match the selected filters.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default ReturnsRequestsPage;
