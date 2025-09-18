// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { useReturnStore } from "../store/return.store";
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
  ImagePlus,
  Send,
  X,
  RotateCcw,
} from "lucide-react";
import toast from "react-hot-toast";

const ClientOrders = ({ filteredOrders }) => {
  const [reason, setReason] = useState("");
  const [request, setRequest] = useState("");
  const [requested, setRequested] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [images, setImages] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);

  const fileInputRef = useRef(null);

  const { returnRequest, isLoading } = useReturnStore();

  // Timeline component
  const OrderTimeline = ({ status }) => {
    const steps = [
      { id: "pending", label: "Order Received", icon: <Clock size={16} /> },
      { id: "packing", label: "Packing", icon: <Package size={16} /> },
      { id: "processing", label: "Processing", icon: <Package size={16} /> },
      { id: "shipped", label: "On the Way", icon: <Truck size={16} /> },
      { id: "delivered", label: "Delivered", icon: <CheckCircle size={16} /> },
    ];

    const statusIndex = steps.findIndex((step) => step.id === status);

    return (
      <div className="mt-6">
        <h4 className="text-md font-semibold text-gray-900 mb-4">
          Order Status
        </h4>
        <div className="flex items-center justify-between relative">
          {steps.map((step, index) => {
            const isCompleted = index <= statusIndex;
            const isCurrent = index === statusIndex;

            return (
              <div
                key={step.id}
                className="flex flex-col items-center relative z-10"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isCompleted
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  } ${isCurrent ? "ring-4 ring-blue-100" : ""}`}
                >
                  {step.icon}
                </div>
                <div
                  className={`text-xs mt-2 text-center ${
                    isCompleted ? "text-blue-600 font-medium" : "text-gray-500"
                  }`}
                >
                  {step.label}
                </div>
              </div>
            );
          })}

          {/* Progress line */}
          <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 ">
            <div
              className="h-1 bg-blue-600 transition-all duration-500"
              style={{
                width: `${(statusIndex / (steps.length - 1)) * 100}%`,
              }}
            ></div>
          </div>
        </div>
      </div>
    );
  };

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

  const handleReturnRequest = (id) => {
    setRequest(id);
  };

  const removeImage = (index) => {
    const newPreviews = [...imagePreviews];
    const newImages = [...images];
    newPreviews.splice(index, 1);
    newImages.splice(index, 1);
    setImagePreviews(newPreviews);
    setImages(newImages);
  };

  const handleAddReturnRequest = async (orderId, productId) => {
    if (!reason.trim()) {
      toast.error(
        "Please write a reason of your return request before submitting"
      );
      return;
    }

    const formData = new FormData();
    formData.append("orderId", orderId);
    formData.append("productId", productId);
    formData.append("reason", reason);

    // Append each image file
    images.forEach((image) => {
      formData.append("images", image);
    });

    const res = await returnRequest(formData);

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Request sent successfully");
      setReason("");
      setImagePreviews([]);
      setImages([]);
      setRequest("");
      setRequested(true);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + images.length > 4) {
      toast.error("You can only upload up to 4 images");
      return;
    }

    const newImages = [];
    const newPreviews = [];

    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        newImages.push(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          newPreviews.push(e.target.result);
          setImagePreviews([...imagePreviews, ...newPreviews]);
        };
        reader.readAsDataURL(file);
      }
    });

    setImages([...images, ...newImages]);
  };
  return (
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
                setExpandedOrder(expandedOrder === order._id ? null : order._id)
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
                    <span className="ml-1 capitalize">{overallStatus}</span>
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Ordered on: {new Date(order.createdAt).toLocaleDateString()}
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
                  {/* Order Timeline */}
                  <div className="p-6 border-b border-gray-200">
                    <OrderTimeline status={overallStatus} />
                  </div>

                  {/* Products */}
                  <div className="p-6 border-b border-gray-200">
                    <h4 className="text-md font-semibold text-gray-900 mb-3">
                      Products
                    </h4>
                    <div className="space-y-4 ">
                      {order.items.map((item, index) => (
                        <div className="flex flex-col bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition">
                          <div key={index} className="flex  items-start ">
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
                              <div className="w-full flex justify-between">
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
                                {item.itemStatus === "delivered" &&
                                  !item.returnRequested &&
                                  !requested && (
                                    <motion.button
                                      whileHover={{ scale: 1.02 }}
                                      whileTap={{ scale: 0.98 }}
                                      onClick={() =>
                                        handleReturnRequest(item.productId)
                                      }
                                      disabled={isLoading}
                                      className="flex items-center justify-center gap-2 px-4 py-2  text-blue-500 hover:text-blue-700  transition-colors  w-full md:w-auto"
                                    >
                                      <RotateCcw size={18} />
                                      Return request
                                    </motion.button>
                                  )}
                                <AnimatePresence>
                                  {(item.returnRequested || requested) && (
                                    <motion.div
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -10 }}
                                      transition={{ duration: 0.3 }}
                                      className="mt-4 flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-lg border border-green-200"
                                    >
                                      <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{
                                          type: "spring",
                                          stiffness: 300,
                                          damping: 15,
                                        }}
                                      >
                                        <CheckCircle
                                          size={24}
                                          className="text-green-500"
                                        />
                                      </motion.div>
                                      <div>
                                        <p className="font-medium">
                                          Return request successfully submitted
                                        </p>
                                        <p className="text-sm">
                                          Our team will process your request
                                          within 24 hours.
                                        </p>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            </div>
                          </div>
                          {request === item.productId && (
                            <div className="mt-6">
                              <div className="mb-6 relative">
                                <input
                                  className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-indigo-200 focus:ring-1 focus:ring-indigo-500 outline-none transition-all resize-none ${
                                    isLoading ? "opacity-50 bg-gray-100" : ""
                                  }`}
                                  value={reason}
                                  onChange={(e) => setReason(e.target.value)}
                                  placeholder="Put your return request reson here"
                                  disabled={isLoading}
                                />
                                <ImagePlus
                                  className={`absolute bottom-5 right-3 text-gray-500 ${
                                    isLoading
                                      ? "border-gray-200 text-gray-400 bg-gray-100 cursor-not-allowed"
                                      : "border-gray-300 text-gray-500 hover:text-gray-800"
                                  }`}
                                  size={20}
                                  onClick={() =>
                                    !isLoading && fileInputRef.current.click()
                                  }
                                  disabled={isLoading}
                                />
                              </div>

                              {/* Image Upload Section */}
                              <div className="mb-6">
                                <input
                                  type="file"
                                  ref={fileInputRef}
                                  onChange={handleImageUpload}
                                  multiple
                                  accept="image/*"
                                  className="hidden"
                                  disabled={isLoading} // Désactiver pendant le chargement
                                />

                                <AnimatePresence>
                                  {imagePreviews.length > 0 && (
                                    <motion.div
                                      className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4"
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{
                                        opacity: 1,
                                        height: "auto",
                                      }}
                                      exit={{ opacity: 0, height: 0 }}
                                    >
                                      {imagePreviews.map((preview, index) => (
                                        <motion.div
                                          key={images[index].name + "-" + index}
                                          className="relative rounded-lg overflow-hidden shadow-md group"
                                          initial={{
                                            opacity: 0,
                                            scale: 0.8,
                                          }}
                                          animate={{
                                            opacity: 1,
                                            scale: 1,
                                          }}
                                          exit={{
                                            opacity: 0,
                                            scale: 0.8,
                                          }}
                                          transition={{
                                            delay: index * 0.1,
                                          }}
                                        >
                                          <img
                                            src={preview}
                                            alt={`Preview ${index}`}
                                            className="w-full h-24 object-cover"
                                          />
                                          {!isLoading && ( // Cacher le bouton de suppression pendant le chargement
                                            <motion.button
                                              type="button"
                                              whileHover={{
                                                scale: 1.1,
                                              }}
                                              whileTap={{ scale: 0.9 }}
                                              onClick={() => removeImage(index)}
                                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                              <X size={14} />
                                            </motion.button>
                                          )}
                                        </motion.div>
                                      ))}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>

                              {/* Submit Button */}
                              <motion.button
                                whileHover={{
                                  scale: isLoading ? 1 : 1.02,
                                }}
                                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                                onClick={() =>
                                  handleAddReturnRequest(
                                    expandedOrder,
                                    item.productId
                                  )
                                }
                                className={`flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl font-medium transition-all ${
                                  isLoading
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg"
                                }`}
                              >
                                {isLoading ? (
                                  <div className="flex items-center">
                                    <div className="w-4 h-4 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                                    Submitting...
                                  </div>
                                ) : (
                                  <>
                                    <Send size={18} />
                                    Submit Reason
                                  </>
                                )}
                              </motion.button>
                            </div>
                          )}
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
  );
};

export default ClientOrders;
