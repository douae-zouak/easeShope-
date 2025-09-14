import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const VendorCard = ({ vendor, onAction, index }) => {
  const profilePhoto = vendor.profilePhoto
    ? `${import.meta.env.VITE_API_URL}${vendor.profilePhoto}`
    : null;

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getColorClass = (name) => {
    const colors = [
      "bg-red-100 text-red-800",
      "bg-blue-100 text-blue-800",
      "bg-green-100 text-green-800",
      "bg-yellow-100 text-yellow-800",
      "bg-purple-100 text-purple-800",
      "bg-pink-100 text-pink-800",
      "bg-indigo-100 text-indigo-800",
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  // Fonction pour convertir les couleurs oklch en hex (approximation)
  // const oklchToHex = (l, c, h) => {
  //   // Conversion simplifiée - pour une vraie conversion, utilisez une librairie
  //   if (l > 0.6) return "#fef3c7"; // Jaune clair pour hover deactivate
  //   if (h > 200 && h < 260) return "#d1fae5"; // Vert clair pour hover activate
  //   return "#fee2e2"; // Rouge clair pour hover delete
  // };

  return (
    <motion.div
      className="bg-white rounded-none shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      layout
    >
      <Link to={`/admin/sellersInfo/${vendor._id}`}>
        <div className="h-48 bg-gray-100 flex items-center justify-center relative overflow-hidden">
          {profilePhoto ? (
            <motion.img
              src={profilePhoto}
              alt={vendor.fullName}
              className="h-full w-full object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
          ) : (
            <motion.div
              className={`w-20 h-20 rounded-none flex items-center justify-center ${getColorClass(
                vendor.fullName
              )}`}
              whileHover={{ rotate: 5, scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-xl font-bold">
                {getInitials(vendor.fullName)}
              </span>
            </motion.div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/admin/vendor/${vendor._id}`}>
          <motion.h3
            className="font-normal text-base text-gray-900 hover:text-black mb-1 uppercase tracking-wide"
            whileHover={{ x: 5 }}
            transition={{ duration: 0.2 }}
          >
            {vendor.fullName}
          </motion.h3>
        </Link>

        <p className="text-gray-600 text-xs mb-3 font-light">{vendor.email}</p>

        <div className="mb-3 flex items-center">
          <motion.span
            className={`inline-flex items-center px-2 py-1 rounded-none text-xs font-medium ${
              vendor.isActive
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
            whileHover={{ scale: 1.05 }}
          >
            {vendor.isActive ? "Active" : "Inactive"}
          </motion.span>

          {vendor.deactivationReason && (
            <span
              className="ml-2 text-xs text-gray-500 truncate"
              title={vendor.deactivationReason}
            >
              {vendor.deactivationReason}
            </span>
          )}
        </div>

        <div className="mb-4 grid grid-cols-2 gap-2 text-xs">
          <div className="text-center p-2 bg-gray-50 rounded-none border border-gray-100">
            <div className="font-medium text-gray-900">
              {vendor.totalSales || 0}
            </div>
            <div className="text-gray-500 text-xs">Sales</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-none border border-gray-100">
            <div className="font-medium text-gray-900">
              {vendor.totalProducts || 0}
            </div>
            <div className="text-gray-500 text-xs">Products</div>
          </div>
        </div>

        <div className="flex space-x-2">
          <Link
            to={`/admin/sellersInfo/${vendor._id}`}
            className="flex-1 text-center px-3 py-2 bg-black text-white rounded-none hover:bg-gray-800 text-xs uppercase tracking-wide transition-colors duration-200"
          >
            View
          </Link>

          {vendor.isActive ? (
            <motion.button
              onClick={() => onAction(vendor, "desactivate")}
              className="px-3 py-2 bg-white text-gray-700 border border-gray-300 rounded-none text-xs uppercase tracking-wide transition-colors duration-200 hover:bg-[#fef3c7] hover:text-[#92400e]"
              whileTap={{ scale: 0.95 }}
            >
              Desactivate
            </motion.button>
          ) : (
            <motion.button
              onClick={() => onAction(vendor, "activate")}
              className="px-3 py-2 bg-white text-gray-700 border border-gray-300 rounded-none text-xs uppercase tracking-wide transition-colors duration-200  hover:bg-[#d1fae5] hover:text-[#065f46]"
              whileTap={{ scale: 0.95 }}
            >
              Activate
            </motion.button>
          )}

          <motion.button
            onClick={() => onAction(vendor, "delete")}
            className="px-3 py-2 bg-white text-gray-700 border border-gray-300 rounded-none text-xs uppercase tracking-wide transition-colors duration-200 hover:bg-[#fee2e2] hover:text-[#b91c1c] "
            whileTap={{ scale: 0.95 }}
          >
            Delete
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default VendorCard;
