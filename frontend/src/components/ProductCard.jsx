import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  AlertTriangle,
  SquarePen,
  BadgePercent,
  Flame,
  Zap,
  Sparkles,
  Eye,
  ShoppingCart,
} from "lucide-react";

const ProductCard = ({ product, onEdit, onDelete, onView }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Récupère la dernière image du tableau
  const mainImage =
    product.imagesVariant[0].images[product.imagesVariant[0].images.length - 1];

  // Configuration des couleurs selon le statut
  const statusConfig = {
    active: {
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: <CheckCircle className="w-3.5 h-3.5" />,
      text: "Active",
    },
    pending: {
      color: "bg-amber-50 text-amber-700 border-amber-200",
      icon: <Clock className="w-3.5 h-3.5" />,
      text: "Pending",
    },
    out_of_stock: {
      color: "bg-rose-50 text-rose-700 border-rose-200",
      icon: <AlertTriangle className="w-3.5 h-3.5" />,
      text: "Out of Stock",
    },
    draft: {
      color: "bg-slate-100 text-slate-700 border-slate-200",
      icon: <SquarePen className="w-3.5 h-3.5" />,
      text: "Draft",
    },
  };

  const { color, icon, text } = statusConfig[product.status];

  // Configuration du style de discount selon le pourcentage
  const getDiscountStyle = (discount) => {
    if (discount >= 50) {
      return {
        bg: "bg-gradient-to-r from-red-500 to-rose-600",
        icon: <Flame className="size-3.5" />,
        text: "text-white",
        pulse: true,
      };
    } else if (discount >= 30) {
      return {
        bg: "bg-gradient-to-r from-orange-500 to-amber-600",
        icon: <Zap className="size-3.5" />,
        text: "text-white",
        pulse: false,
      };
    } else if (discount >= 15) {
      return {
        bg: "bg-gradient-to-r from-purple-500 to-indigo-600",
        icon: <Sparkles className="size-3.5" />,
        text: "text-white",
        pulse: false,
      };
    } else {
      return {
        bg: "bg-gradient-to-r from-cyan-500 to-blue-600",
        icon: <BadgePercent className="size-3.5" />,
        text: "text-white",
        pulse: false,
      };
    }
  };

  const discountStyle =
    product.discount > 0 ? getDiscountStyle(product.discount) : null;

  // Calcul du prix après réduction
  const discountedPrice =
    product.discount > 0 ? product.price * (1 - product.discount / 100) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -8 }}
      className="relative bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 transition-all hover:shadow-2xl group font-sans"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image container with overlay actions */}
      <div className="aspect-[4/5] bg-gray-50 relative overflow-hidden">
        {mainImage ? (
          <motion.img
            src={mainImage}
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-700"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-100">
            <div className="flex flex-col items-center">
              <ShoppingCart className="w-10 h-10 mb-2" />
              <span className="text-sm">No Image</span>
            </div>
          </div>
        )}

        {/* Hover overlay with quick actions */}
        <motion.div
          className="absolute inset-0 bg-black bg-opacity-0 flex items-center justify-center gap-3"
          animate={{
            backgroundColor: isHovered ? "rgba(0,0,0,0.1)" : "rgba(0,0,0,0)",
          }}
          transition={{ duration: 0.3 }}
        >
          <motion.button
            onClick={() => onView(product._id)}
            className="p-3 bg-white rounded-full shadow-lg opacity-0"
            whileHover={{ scale: 1.1, backgroundColor: "#f8fafc" }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
            transition={{ delay: 0.1, duration: 0.2 }}
            aria-label="View product"
          >
            <Eye className="w-4 h-4 text-gray-700" />
          </motion.button>

          <motion.button
            onClick={() => onEdit(product._id)}
            className="p-3 bg-white rounded-full shadow-lg opacity-0"
            whileHover={{ scale: 1.1, backgroundColor: "#f0f9ff" }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
            transition={{ delay: 0.15, duration: 0.2 }}
            aria-label="Edit product"
          >
            <Edit2 className="w-4 h-4 text-blue-600" />
          </motion.button>
        </motion.div>
      </div>

      {/* Badge de statut */}
      <div
        className={`absolute top-4 right-4 flex items-center px-3 py-1.5 rounded-lg text-xs font-medium border ${color} backdrop-blur-sm`}
      >
        {icon}
        <span className="ml-1.5">{text}</span>
      </div>

      {/* Badge de discount moderne */}
      {product.discount > 0 && (
        <motion.div
          className={`absolute top-4 left-4 z-10 ${
            discountStyle.pulse ? "animate-pulse" : ""
          }`}
          initial={{ scale: 0.8, rotate: -5 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.4, type: "spring" }}
        >
          <div
            className={`${discountStyle.bg} text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-lg`}
          >
            {discountStyle.icon}
            <span className="font-semibold text-xs">
              {product.discount}% OFF
            </span>
          </div>
        </motion.div>
      )}

      {/* Contenu texte */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-medium text-gray-900 text-base tracking-tight line-clamp-2 group-hover:text-gray-700 transition-colors leading-tight">
            {product.name}
          </h3>
          <div className="flex flex-col items-end pl-2">
            {discountedPrice ? (
              <>
                <span className="text-lg font-bold text-gray-900">
                  {discountedPrice.toFixed(2)}DH
                </span>
                <span className="text-sm text-gray-500 line-through mt-0.5">
                  {product.price.toFixed(2)}DH
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-900">
                {product.price.toFixed(2)}DH
              </span>
            )}
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-4 font-normal tracking-wide uppercase text-xs letter-spacing-wide">
          {product.category}
        </p>

        {/* Stock et actions */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full ${
              product.stock < 5
                ? "text-rose-700 bg-rose-50"
                : "text-gray-600 bg-gray-50"
            }`}
          >
            {product.stock} in stock
          </span>

          <motion.button
            onClick={() => onDelete(product._id)}
            className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Delete product"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
