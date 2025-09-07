// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Minus, Plus, X } from "lucide-react";
import { Link } from "react-router-dom";

const CartItem = ({ item, updateQuantity, deleteProductFromCart }) => {
  // Vérification plus approfondie
  if (!item || !item.productId || typeof item.productId !== "object") {
    return null;
  }

  // Récupère la dernière image du produit
  const mainImage =
    item.colorImages && item.colorImages.length > 0
      ? item.colorImages[item.colorImages.length - 1]
      : null;

  // Vérification sécurisée pour le prix original
  const originalPrice = item.productId.originalPrice || item.priceAtPurchase;
  const isDiscounted = item.priceAtPurchase !== originalPrice;

  // Fonctions sécurisées pour les handlers
  const handleDecrement = () => {
    if (item.productId && item.productId._id) {
      updateQuantity(
        item.productId._id,
        Math.max(1, item.quantity - 1),
        item.size,
        item.colorTitle
      );
    }
  };

  const handleIncrement = () => {
    if (item.productId && item.productId._id) {
      updateQuantity(
        item.productId._id,
        Math.min(item.quantity + 1, item.stock),
        item.size,
        item.colorTitle
      );
    }
  };

  const handleDelete = () => {
    if (item.productId && item.productId._id) {
      deleteProductFromCart(item.productId._id, item.size, item.colorTitle);
    }
  };

  return (
    <div className="flex flex-row gap-3 mb-4">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-1 items-center justify-between bg-white shadow-lg rounded-xl p-4 hover:shadow-xl transition-shadow duration-300"
      >
        <div className="flex items-center gap-4 flex-1">
          {mainImage ? (
            <img
              src={mainImage}
              alt={item.productId.name || "Product"}
              className="w-20 h-20 object-cover rounded-lg"
            />
          ) : (
            <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-400 text-xs">No Image</span>
            </div>
          )}
          <div className="flex-1">
            <h3 className="font-classy text-xl text-gray-900 capitalize">
              {item.productId.name || "Produit sans nom"}
            </h3>

            {/* Affichage moderne pour la couleur et la taille */}
            <div className="flex items-center gap-3 mt-2">
              {/* Badge pour la couleur */}
              <div className="flex items-center gap-2 px-3 py-1 ">
                <span className="text-sm text-gray-600">Color:</span>
                <div className="flex items-center gap-1">
                  <span
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{
                      backgroundColor: item.colorCode || "#000",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                  ></span>
                  <span className="text-sm font-medium capitalize">
                    {item.colorTitle || "Not specified"}
                  </span>
                </div>
              </div>

              {/* Badge pour la taille */}
              <div className="flex items-center gap-2  px-3 py-1 ">
                <span className="text-sm text-gray-600">Size:</span>
                <span className="text-sm font-medium bg-white px-2 py-0.5 rounded-md border border-gray-200 shadow-sm">
                  {item.size || "Not specified"}
                </span>
              </div>

              {/* Badge pour le seller */}
              <div className="flex items-center gap-2 px-3 py-1 ">
                <span className="text-sm text-gray-600">Seller:</span>
                <Link to="">
                  <span className="text-sm font-medium capitalize">
                    {item.productId.seller.fullName}
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 mx-4">
          <div className="flex items-center gap-2 border rounded-full px-2 shadow-sm bg-white">
            <button
              onClick={handleDecrement}
              disabled={!item.productId || !item.productId._id}
              className="px-2 text-gray-600 group"
            >
              <Minus
                size={17}
                className="transition-transform duration-200 group-hover:scale-125 group-hover:text-red-500 cursor-pointer"
              />
            </button>
            <span className="text-base font-medium min-w-[2rem] text-center">
              {item.quantity}
            </span>
            <button
              onClick={handleIncrement}
              disabled={!item.productId || !item.productId._id}
              className="px-3 py-2 text-gray-600 group"
            >
              <Plus
                size={17}
                className="transition-transform duration-200 group-hover:scale-125 group-hover:text-green-600 cursor-pointer"
              />
            </button>
          </div>

          <div className="text-right min-w-[100px]">
            {isDiscounted ? (
              <div className="flex flex-col items-end">
                <span className="text-lg font-semibold text-green-700">
                  {(item.quantity * item.priceAtPurchase).toFixed(2)} DH
                </span>
                <span className="text-sm text-gray-500 line-through">
                  {(item.quantity * originalPrice).toFixed(2)} DH
                </span>
              </div>
            ) : (
              <p className="text-gray-900 font-bold">
                {(item.quantity * item.priceAtPurchase).toFixed(2)} DH
              </p>
            )}
          </div>
        </div>

        <button
          onClick={handleDelete}
          className="ml-4 text-gray-500 hover:text-red-500 transition-colors cursor-pointer"
          disabled={!item.productId || !item.productId._id}
        >
          <X size={23} />
        </button>
      </motion.div>
    </div>
  );
};

export default CartItem;
