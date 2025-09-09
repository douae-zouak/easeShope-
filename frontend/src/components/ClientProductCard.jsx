import { BadgePercent, ChevronRight, Heart, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useFavoriteStore } from "../store/favorite.store";

const ClientProductCard = ({ product }) => {
  const { toggleToFavorite, favorites } = useFavoriteStore();

  const isLiked = favorites.some((fav) => fav.productId._id === product._id);

  const [liked, setLiked] = useState(isLiked);

  // Récupère la première image du premier variant d'images
  const mainImage = product.imagesVariant?.[0]?.images?.[0] || "";

  // Vérifie si le produit est en discount
  const isDiscounted = product.discount > 0;

  const navigate = useNavigate();

  // Calcul du prix après réduction
  const discountedPrice = isDiscounted
    ? product.originalPrice * (1 - product.discount / 100)
    : product.originalPrice;

  const onShowDetails = (id) => {
    navigate(`/product-details/${id}`);
  };

  const handleProductLike = async () => {
    try {
      const res = await toggleToFavorite(product._id);

      if (res.error) {
        return toast.error(res.error);
      }
      setLiked(!liked);

      toast.success(res.message);
    } catch (error) {
      if (error.message?.includes("No refresh token")) {
        toast.error("Please login to add products to whishlist");
      } else {
        toast.error(
          `Error adding product to whishlist: ${error.message || error}`
        );
      }
    }
  };

  return (
    <div className="relative border rounded-lg overflow-hidden shadow-sm transition-all hover:shadow-md">
      {/* Image principale */}
      <div className="aspect-square  bg-gray-100 relative">
        {mainImage ? (
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-full object-cover"
            onClick={() => onShowDetails(product._id)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>

      {/* Badge de discount moderne */}
      {isDiscounted && (
        <div className="absolute top-2 left-2 z-10">
          <div className="bg-red-500 text-white px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
            <BadgePercent size={16} />
            <span className="font-bold text-sm">{product.discount}% OFF</span>
          </div>
        </div>
      )}

      {/* Contenu texte */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-medium text-lg line-clamp-1">{product.name}</h3>
          <div className="flex flex-col items-end">
            {isDiscounted ? (
              <>
                <span className="text-lg font-semibold text-green-700">
                  {discountedPrice.toFixed(2)}DH
                </span>
                <span className="text-sm text-gray-500 line-through">
                  {product.originalPrice.toFixed(2)}DH
                </span>
              </>
            ) : (
              <span className="text-lg font-semibold">
                {product.originalPrice?.toFixed(2)}DH
              </span>
            )}
          </div>
        </div>

        <div className="mt-3 flex flex-row gap-3 items-center ">
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 0px 15px rgba(139, 92, 246, 0.7)",
              transition: { duration: 0.3 },
            }}
            whileTap={{
              scale: 0.98,
              boxShadow: "0px 0px 5px rgba(139, 92, 246, 0.5)",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative w-full text-white py-2 rounded-xl font-bold flex items-center justify-center cursor-pointer overflow-hidden bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 shadow-lg"
            onClick={() => onShowDetails(product._id)}
          >
            <ChevronRight size={18} />
            <span>See details</span>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={handleProductLike}
            className="focus:outline-none"
          >
            <motion.div
              animate={liked ? { scale: [1, 1.3, 1] } : { scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Heart
                size={30}
                className={`transition-colors ${
                  liked
                    ? "fill-red-500 text-red-500"
                    : "text-gray-400 hover:text-red-500"
                }`}
              />
            </motion.div>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default ClientProductCard;
