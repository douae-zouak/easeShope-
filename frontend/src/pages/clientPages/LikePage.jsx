// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { useProductStore } from "../../store/product.store";
import { Link, useNavigate } from "react-router-dom";
import { MoveLeft } from "lucide-react";

const LikePage = () => {
  const { favorites, toggleToFavorite } = useProductStore();

  const removeLikedProduct = (id) => {
    toggleToFavorite(id);
  };

  // Fonction pour obtenir la dernière image du premier couleur
  const getProductImage = (product) => {
    if (product?.imagesVariant?.length > 0) {
      const firstColor = product.imagesVariant[0];
      if (firstColor?.images?.length > 0) {
        return firstColor.images[firstColor.images.length - 1];
      }
    }
    return "/placeholder.png"; // fallback si pas d'image
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 120 },
    },
    exit: {
      y: -20,
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  const navigate = useNavigate();

  const onShowDetails = (id) => {
    navigate(`/product-details/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-row items-center gap-3 pt-7 ml-13">
        <Link to="/home">
          <MoveLeft
            size={18}
            className="fill-blue-500 text-blue-500 cursor-pointer"
          />
        </Link>
        <div className="flex flex-row items-center gap-2">
          <Link
            to="/home"
            className="text-blue-500 cursor-pointer hover:text-blue-700"
          >
            Home
          </Link>
          <span className="text-blue-500">-</span>
          <Link className="text-blue-500 cursor-pointer hover:text-blue-700">
            WhishList
          </Link>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-7">
        <motion.h1
          className="text-3xl font-bold text-gray-900 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Your Wishlist
        </motion.h1>

        {!favorites || favorites.length === 0 ? (
          <motion.div
            className="text-center py-16 bg-white rounded-lg shadow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <svg
              className="mx-auto h-16 w-16 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No product in your wishlist
            </h3>
            <p className="mt-1 text-gray-500">
              Start adding products to your wishlist!
            </p>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {favorites.map((favoriteItem) => {
                const product = favoriteItem.productId;
                if (!product) return null; // ✅ skip si pas de produit

                return (
                  <motion.div
                    key={favoriteItem._id || product._id}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                    variants={itemVariants}
                    layout
                    exit="exit"
                    whileHover={{ y: -5 }}
                  >
                    <div className="relative  w-full h-90 overflow-hidden ">
                      <img
                        src={getProductImage(product)}
                        alt={product.name || "Product"}
                        className="w-full h-full object-cover object-center"
                      />
                      {product.discount > 0 && (
                        <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          -{product.discount}%
                        </span>
                      )}
                      <button
                        onClick={() => removeLikedProduct(product._id)}
                        className="absolute top-2 left-2 bg-white p-2 rounded-full shadow-md hover:bg-red-50 transition-colors duration-200"
                        aria-label="Remove from favorites"
                      >
                        <svg
                          className="w-5 h-5 text-red-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>

                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {product.name}
                      </h3>

                      {product.category && (
                        <div className="flex items-center mb-2">
                          <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {product.category}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-5">
                        <div>
                          {product.discount > 0 ? (
                            <>
                              <span className="text-lg font-bold text-gray-900">
                                ${Number(product.price).toFixed(2) || "0.00"}
                              </span>
                              <span className="ml-2 text-sm text-gray-500 line-through">
                                $
                                {Number(product.originalPrice).toFixed(2) ||
                                  "0.00"}
                              </span>
                            </>
                          ) : (
                            <span className="text-lg font-bold text-gray-900">
                              $
                              {Number(product.originalPrice).toFixed(2) ||
                                "0.00"}
                            </span>
                          )}
                        </div>

                        <button
                          className="relative bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl cursor-pointer"
                          onClick={() => onShowDetails(product._id)}
                        >
                          Select variants
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LikePage;
