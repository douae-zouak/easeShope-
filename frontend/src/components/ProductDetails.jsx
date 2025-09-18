import { useState } from "react";
import toast from "react-hot-toast";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  Heart,
  Minus,
  Plus,
  Shirt, // pour vêtements
  ShoppingBag, // sac (général mode)
  Sparkles, // skincare, beauté
  Star,
  Smartphone,
  Laptop,
  Tablet,
  Camera,
  Headphones,
  Box, // storage, emballage
  Utensils, // cookware
  BedDouble, // literie (Bedding)
  LampDesk, // décoration, lighting
  Dumbbell, // fitness
  Book, // fiction
  BookOpen, // educational, non-fiction
  BookMarked, // comics
  Baby, // children's books
  PenTool, // makeup, supplies
  Gamepad2, // jouets
  Footprints, // footwear (remplace shoe)
} from "lucide-react";

import { useFavoriteStore } from "../store/favorite.store";
import { useCartStore } from "../store/cart.store";
import { useCommentStore } from "../store/comment.store";
import { useAuthStore } from "../store/auth.store";
import LoginFirst from "../pages/clientPages/LoginFirst";

const ProductDetails = ({
  product,
  id,
  selectedVariant,
  setSelectedVariant,
}) => {
  const { favorites, toggleToFavorite } = useFavoriteStore();
  const { productStats } = useCommentStore();
  const { addToCart } = useCartStore();
  const { user } = useAuthStore();

  const [quantity, setQuantity] = useState(1);
  const isLiked = favorites.some((fav) => fav.productId._id === id);
  const [liked, setLiked] = useState(isLiked);
  const [shouldLogin, setShouldLogin] = useState(false);

  const discountedPrice =
    product.discount > 0
      ? product.originalPrice * (1 - product.discount / 100)
      : product.originalPrice;

  const handleAddToCart = async () => {
    if (user?.role === "buyer") {
      if (!selectedVariant) {
        toast.error("Please select a size and color");
        return;
      }
      try {
        await addToCart(product._id, quantity, selectedVariant, liked);
        toast.success(`${product.name} added to your cart successfully`);
      } catch (error) {
        if (error.message?.includes("401")) {
          setShouldLogin(true);
        } else {
          toast.error(
            `Error adding product to cart: ${error.message || error}`
          );
        }
      }
    } else {
      setShouldLogin(true);
    }
  };

  // Grouper les variants par couleur
  const variantsByColor = product.variants.reduce((acc, variant) => {
    if (!acc[variant.colorTitle]) {
      acc[variant.colorTitle] = [];
    }
    acc[variant.colorTitle].push(variant);
    return acc;
  }, {});

  const handleProductLike = async () => {
    if (user?.role === "buyer") {
      try {
        const res = await toggleToFavorite(product._id);

        if (res.error) {
          return toast.error("res.error");
        }

        toast.success(res.message);
        setLiked(!liked);
      } catch (error) {
        if (error.message?.includes("No")) {
          setShouldLogin(true);
        } else {
          toast.error(
            `Error adding product to wishlist: ${error.message || error}`
          );
        }
      }
    } else {
      setShouldLogin(true);
    }
  };

  const categoryIcons = {
    "Mobile Phones": { icon: Smartphone, label: "Mobile Phones" },
    Laptops: { icon: Laptop, label: "Laptops" },
    Tablets: { icon: Tablet, label: "Tablets" },
    Cameras: { icon: Camera, label: "Cameras" },
    Accessories: { icon: Sparkles, label: "Accessories" },
    "T-Shirts": { icon: Shirt, label: "T-Shirts" },
    Shirts: { icon: Shirt, label: "Shirts" },
    Jeans: { icon: ShoppingBag, label: "Jeans" },
    Dresses: { icon: Sparkles, label: "Dresses" },
    Jackets: { icon: ShoppingBag, label: "Jackets" },
    Sweaters: { icon: ShoppingBag, label: "Sweaters" },
    Shoes: { icon: Footprints, label: "Shoes" },
    Cookware: { icon: Utensils, label: "Cookware" },
    Bedding: { icon: BedDouble, label: "Bedding" },
    Decor: { icon: LampDesk, label: "Decor" },
    Storage: { icon: Box, label: "Storage" },
    Lighting: { icon: LampDesk, label: "Lighting" },
    Skincare: { icon: Sparkles, label: "Skincare" },
    Makeup: { icon: PenTool, label: "Makeup" },
    "Hair Care": { icon: Sparkles, label: "Hair Care" },
    "Fitness Equipment": { icon: Dumbbell, label: "Fitness Equipment" },
    "Athletic Shoes": { icon: Footprints, label: "Athletic Shoes" },
    Apparel: { icon: Dumbbell, label: "Apparel" },
    "Outdoor Gear": { icon: Gamepad2, label: "Outdoor Gear" },
    "Sports Accessories": { icon: Dumbbell, label: "Sports Accessories" },
    Fiction: { icon: Book, label: "Fiction" },
    "Non-Fiction": { icon: BookOpen, label: "Non-Fiction" },
    Comics: { icon: BookMarked, label: "Comics" },
    Educational: { icon: BookOpen, label: "Educational" },
    "Children's Books": { icon: Baby, label: "Children's Books" },
    Clothing: { icon: Shirt, label: "Clothing" },
    Toys: { icon: Gamepad2, label: "Toys" },
    "School Supplies": { icon: PenTool, label: "School Supplies" },
    Footwear: { icon: Footprints, label: "Footwear" },
  };

  const categoryData = categoryIcons[product.category];

  const Icon = categoryData.icon;
  const label = categoryData.label;

  const onClose = () => {
    setShouldLogin(false);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <svg
        key={index}
        className={`w-5 h-5 ${
          index < rating ? "text-yellow-400" : "text-gray-300"
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <LoginFirst isOpen={shouldLogin} onClose={onClose} />
      <div className="flex justify-between items-start">
        <div>
          <span
            className={`inline-flex items-center gap-2 text-xs font-semibold tracking-wide px-5 py-2 rounded-full shadow-md transition-all duration-300 
                      ${
                        product.gender === "Woman"
                          ? "bg-gradient-to-r from-pink-400 to-pink-600 text-white hover:scale-105 hover:shadow-pink-300/50"
                          : product.gender === "Men"
                          ? "bg-gradient-to-r from-blue-400 to-blue-600 text-white hover:scale-105 hover:shadow-blue-300/50"
                          : "bg-gray-200 text-gray-700"
                      }`}
          >
            <Icon size={16} className="text-white" />

            {product.gender === "Woman"
              ? "Women Fashion"
              : product.gender === "Men"
              ? "Men Fashion"
              : `${label}`}
          </span>
          <h1 className="text-3xl font-semibold text-gray-900 mt-1 font-title">
            {product.name}
          </h1>

          <div className="flex items-center mt-2">
            <div className="flex">
              <p className="text-sm text-gray-500 flex mt-1">
                {renderStars(productStats?.averageRating)}
              </p>
            </div>
            <span className="text-sm text-gray-600 ml-2">
              ({productStats?.totalReviews}{" "}
              {productStats?.totalReviews === 0 ||
              productStats?.totalReviews === 1
                ? "review"
                : "reviews"}
              )
            </span>
          </div>
        </div>

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
              size={28}
              className={`transition-colors ${
                liked
                  ? "fill-red-500 text-red-500"
                  : "text-gray-400 hover:text-red-500"
              }`}
            />
          </motion.div>
        </motion.button>
      </div>

      <div className="mt-6">
        <div className="flex items-center">
          <span className="text-3xl font-medium text-gray-900">
            {discountedPrice.toFixed(2)}DH
          </span>
          {product.discount > 0 && (
            <span className="ml-3 text-lg text-gray-500 line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-sm font-medium text-gray-900">Select Color</h3>
        <div className="flex gap-2 mt-2">
          {Object.keys(variantsByColor).map((color) => {
            const variant = variantsByColor[color][0];
            return (
              <button
                key={color}
                onClick={() => setSelectedVariant(variantsByColor[color][0])}
                className={`flex items-center justify-center rounded-md border p-2 transition-all duration-200 ${
                  selectedVariant?.colorTitle === color
                    ? "outline-none border-indigo-200 ring-1 ring-indigo-500 "
                    : "border-gray-200"
                }`}
              >
                <div
                  className="h-6 w-6 rounded-full border border-gray-200"
                  style={{ backgroundColor: variant.colorCode }}
                ></div>
                <span className="ml-2 text-sm">{color}</span>
              </button>
            );
          })}
        </div>
      </div>

      {selectedVariant && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-900">Select Size</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {variantsByColor[selectedVariant.colorTitle].map((variant) => (
              <button
                key={variant.sku}
                onClick={() => {
                  setSelectedVariant(variant);
                  setQuantity(1); // reset quantité à 1 quand on change de variante
                }}
                disabled={variant.stock === 0}
                className={`px-4 py-2 rounded-md border text-sm font-medium ${
                  selectedVariant.sku === variant.sku
                    ? "border-indigo-500 bg-indigo-500 text-white"
                    : "border-gray-300 text-gray-700 hover:border-gray-400"
                } ${
                  variant.stock === 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {variant.size} ({variant.stock})
                {variant.stock === 0 && "(Out of stock)"}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 flex items-center gap-4">
        <div className="flex items-center border rounded-md">
          <button
            onClick={() => quantity > 1 && setQuantity(quantity - 1)}
            className="px-2 text-gray-600 group"
          >
            <Minus
              size={17}
              className="transition-transform duration-200 group-hover:scale-125 group-hover:text-red-500 cursor-pointer"
            />
          </button>

          <span className="px-4 py-2">{quantity}</span>
          <button
            onClick={() => {
              if (selectedVariant) {
                quantity < selectedVariant?.stock && setQuantity(quantity + 1);
              } else {
                toast.error("Choose a variant first");
              }
            }}
            className="px-3 py-2 text-gray-600 group"
          >
            <Plus
              size={17}
              className="transition-transform duration-200 group-hover:scale-125 group-hover:text-green-600 cursor-pointer"
            />
          </button>
        </div>

        <motion.button
          onClick={handleAddToCart}
          disabled={!selectedVariant}
          whileHover={{
            scale: 1.02,
          }}
          whileTap={{ scale: 0.95 }}
          className="flex-1 bg-gradient-to-r from-indigo-400 to-indigo-600 text-white py-3 px-6 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200"
        >
          <ShoppingBag size={20} className="mr-2" />
          Add to Cart
        </motion.button>
      </div>
    </div>
  );
};

export default ProductDetails;
