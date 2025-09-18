import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import toast from "react-hot-toast";
import { useFavoriteStore } from "../store/favorite.store";
import { useAuthStore } from "../store/auth.store";
import LoginFirst from "../pages/clientPages/LoginFirst";

const ClientProductCard = ({ product }) => {
  const { toggleToFavorite, favorites } = useFavoriteStore();
  const { user } = useAuthStore();
  const isLiked = favorites.some((fav) => fav.productId._id === product._id);
  const [liked, setLiked] = useState(isLiked);
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [shouldLog, setShoulLog] = useState(false);

  const imageContainerRef = useRef(null);

  // Get all available images
  const allImages = product.imagesVariant?.[0]?.images || [];
  const hasMultipleImages = allImages.length > 1;

  const isDiscounted = product.discount > 0;
  const navigate = useNavigate();

  const discountedPrice = isDiscounted
    ? product.originalPrice * (1 - product.discount / 100)
    : product.originalPrice;

  const onShowDetails = (id) => {
    navigate(`/product-details/${id}`);
  };

  const handleProductLike = async (e) => {
    e.stopPropagation();
    if (user?.role === "buyer") {
      try {
        const res = await toggleToFavorite(product._id);
        if (res.error) return toast.error(res.error);

        setLiked(!liked);
        toast.success(res.message);
      } catch (error) {
        if (error.message?.includes("No refresh token")) {
          setShoulLog(true);
        } else {
          toast.error(`Error: ${error.message || error}`);
        }
      }
    } else {
      setShoulLog(true);
    }
  };

  const onClose = () => {
    setShoulLog(false);
  };

  // Auto-cycle through images when hovered
  useEffect(() => {
    let interval;
    if (isHovered && hasMultipleImages) {
      interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isHovered, hasMultipleImages, allImages.length]);

  // Heart animation variants
  const heartVariants = {
    initial: { scale: 1, rotate: 0 },
    hover: { scale: 1.1, rotate: -5 },
    liked: {
      scale: [1, 1.4, 1.2],
      rotate: [0, -10, 10, 0],
      transition: { duration: 0.6 },
    },
  };

  // Floating particles animation for premium effect
  const FloatingParticles = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`particle-${product._id}-${i}-${Math.random()
            .toString(36)
            .substr(2, 9)}`}
          className="absolute w-1 h-1 bg-white rounded-full opacity-70"
          initial={{
            x: Math.random() * 100,
            y: Math.random() * 100,
            scale: 0,
          }}
          animate={{
            x: Math.random() * 100,
            y: Math.random() * 100,
            scale: [0, 1, 0],
            opacity: [0, 0.7, 0],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        />
      ))}
    </div>
  );

  return (
    <>
      <LoginFirst isOpen={shouldLog} onClose={onClose} />
      <motion.div
        className="relative bg-white group cursor-pointer overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        whileHover={{ y: -10 }}
        onMouseEnter={() => {
          setIsHovered(true);
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          setCurrentImageIndex(0);
        }}
        onClick={() => onShowDetails(product._id)}
      >
        {/* Image container with hover effects */}
        <div
          className="aspect-[3/4] relative overflow-hidden"
          ref={imageContainerRef}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImageIndex}
              src={allImages[currentImageIndex] || "/api/placeholder/300/400"}
              alt={product.name}
              className="w-full h-full object-cover"
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
          </AnimatePresence>

          {/* Image navigation arrows */}
          {hasMultipleImages && (
            <>
              {/* Image indicator dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {allImages.map((_, index) => (
                  <button
                    key={index}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      index === currentImageIndex ? "bg-white" : "bg-white/50"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(index);
                    }}
                    aria-label={`View image ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Wishlist button with elegant animation */}
          <motion.button
            onClick={handleProductLike}
            className="absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full p-2.5 shadow-lg focus:outline-none backdrop-blur-sm z-20"
            aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
            variants={heartVariants}
            initial="initial"
            whileHover="hover"
            whileTap={{ scale: 0.9 }}
            animate={liked ? "liked" : "initial"}
          >
            <motion.div
              animate={{
                color: liked ? "#ef4444" : "#4b5563",
                fill: liked ? "#ef4444" : "transparent",
              }}
              transition={{ duration: 0.3 }}
            >
              <Heart size={20} className="drop-shadow-sm" />
            </motion.div>
          </motion.button>

          {/* Floating particles effect for premium feel */}
          {isHovered && <FloatingParticles />}
        </div>

        {/* Product details with elegant typography */}
        <div className="p-4">
          <div className="mb-2">
            <h3 className="text-gray-900 text-[19px] font-mono  line-clamp-2 leading-tight capitalize">
              {product.name}
            </h3>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              {isDiscounted ? (
                <>
                  <span className="text-base font-stretch-ultra-condensed font-semibold text-gray-900">
                    {discountedPrice.toFixed(2)} DH
                  </span>
                  <span className="text-xs text-gray-400 line-through">
                    {product.originalPrice.toFixed(2)} DH
                  </span>
                </>
              ) : (
                <span className="text-base font-stretch-ultra-condensed font-semibold text-gray-900">
                  {product.originalPrice?.toFixed(2)} DH
                </span>
              )}
            </div>

            {/* Discount badge */}
            {isDiscounted && (
              <span className="bg-rose-50 text-rose-700 text-xs font-medium px-2 py-1">
                -{product.discount}%
              </span>
            )}
          </div>
        </div>

        {/* Elegant shimmer border effect on hover */}
        <div className="absolute inset-0 rounded-sm pointer-events-none overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            initial={{ x: "-100%" }}
            animate={{ x: isHovered ? "100%" : "-100%" }}
            transition={{ duration: 1.5, repeat: isHovered ? Infinity : 0 }}
          />
        </div>
      </motion.div>
    </>
  );
};

export default ClientProductCard;
