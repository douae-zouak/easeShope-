import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Star,
  Heart,
  ChevronLeft,
  ChevronRight,
  Truck,
  RotateCcw,
  Sparkles,
  Shirt,
  Minus,
  Plus,
  ShoppingBag,
  Calendar,
  Package,
  MoveLeft,
} from "lucide-react";
import { useProductStore } from "../../store/product.store";
import toast from "react-hot-toast";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const { getProductById, isLoading, addToCart, favorites } = useProductStore();
  const [product, setProduct] = useState(null);
  const [seller, setSeller] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const isLiked = favorites.some((fav) => fav.productId._id === id);
  const [liked, setLiked] = useState(isLiked);
  const { toggleToFavorite } = useProductStore();
  const API_URL = import.meta.env.VITE_API_URL;

  const handleProductLike = async () => {
    try {
      const res = await toggleToFavorite(product._id);

      if (res.error) {
        return toast.error("res.error");
      }

      toast.success(res.message);
      setLiked(!liked);
    } catch (error) {
      if (error.message?.includes("401")) {
        toast.error("Please login to add products to cart");
      } else {
        toast.error(`Error adding product to cart: ${error.message || error}`);
      }
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    const loadProductData = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data.product);
        setSeller(data.seller);
        // Sélectionner la première variante par défaut
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
        }
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        navigate("/home");
      }
    };

    if (id) {
      loadProductData();
    }
  }, [id, getProductById, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Product Not Found
          </h2>
          <p className="text-gray-600 mt-2">
            The product you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  // Grouper les variants par couleur
  const variantsByColor = product.variants.reduce((acc, variant) => {
    if (!acc[variant.colorTitle]) {
      acc[variant.colorTitle] = [];
    }
    acc[variant.colorTitle].push(variant);
    return acc;
  }, {});

  // Trouver les images pour la couleur sélectionnée
  const selectedColorImages = selectedVariant
    ? product.imagesVariant.find((v) => v.color === selectedVariant.colorTitle)
        ?.images || []
    : product.imagesVariant[0]?.images || [];

  const nextImage = () => {
    if (selectedImage < selectedColorImages.length - 1) {
      setSelectedImage(selectedImage + 1);
    }
  };

  const prevImage = () => {
    if (selectedImage > 0) {
      setSelectedImage(selectedImage - 1);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      toast.error("Please select a size and color");
      return;
    }
    try {
      await addToCart(product._id, quantity, selectedVariant, liked);
      toast.success(`${product.name} added to your cart successfully`);
    } catch (error) {
      if (error.message?.includes("401")) {
        toast.error("Please login to add products to cart");
      } else {
        toast.error(`Error adding product to cart: ${error.message || error}`);
      }
    }
  };

  // Calculer le prix réduit si applicable
  const discountedPrice =
    product.discount > 0
      ? product.originalPrice * (1 - product.discount / 100)
      : product.originalPrice;

  return (
    <div className="min-h-screen bg-gray-100 ">
      <div className="flex flex-row items-center gap-3 pt-5 ml-16">
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
            Product Details
          </Link>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Galerie d'images */}
          <div className="md:w-1/2">
            <div className="sticky top-0 ">
              {/* Image principale */}
              <div className="relative aspect-square overflow-hidden rounded-xl bg-white shadow-lg">
                {selectedColorImages.length > 0 ? (
                  <img
                    src={selectedColorImages[selectedImage]}
                    alt={product.name}
                    className="w-full  h-full object-contain p-4"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image Available
                  </div>
                )}

                {selectedColorImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      disabled={selectedImage === 0}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md disabled:opacity-50"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={nextImage}
                      disabled={
                        selectedImage === selectedColorImages.length - 1
                      }
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md disabled:opacity-50"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}

                {product.discount > 0 && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    -{product.discount}%
                  </div>
                )}
              </div>

              {selectedColorImages.length > 1 && (
                <div className="mt-4 grid grid-cols-4 gap-2">
                  {selectedColorImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square overflow-hidden rounded-lg border-2 ${
                        selectedImage === index
                          ? "border-indigo-500"
                          : "border-gray-200"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`View ${index + 1} of ${product.name}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Détails du produit */}
          <div className="md:w-1/2">
            <div className="bg-white rounded-xl shadow-lg p-6">
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
                    {product.gender === "Woman" && (
                      <Sparkles size={16} className="text-white" />
                    )}
                    {product.gender === "Men" && (
                      <Shirt size={16} className="text-white" />
                    )}

                    {product.gender === "Woman"
                      ? "Women Fashion"
                      : product.gender === "Men"
                      ? "Men Fashion"
                      : ""}
                  </span>
                  <h1 className="text-3xl font-semibold text-gray-900 mt-1 font-title">
                    {product.name}
                  </h1>

                  <div className="flex items-center mt-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={18}
                          className={
                            star <= 4
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-2">
                      (42 reviews)
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
                <h3 className="text-sm font-medium text-gray-900">
                  Select Color
                </h3>
                <div className="flex gap-2 mt-2">
                  {Object.keys(variantsByColor).map((color) => {
                    const variant = variantsByColor[color][0];
                    return (
                      <button
                        key={color}
                        onClick={() =>
                          setSelectedVariant(variantsByColor[color][0])
                        }
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
                  <h3 className="text-sm font-medium text-gray-900">
                    Select Size
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {variantsByColor[selectedVariant.colorTitle].map(
                      (variant) => (
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
                            variant.stock === 0
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          {variant.size} ({variant.stock})
                          {variant.stock === 0 && "(Out of stock)"}
                        </button>
                      )
                    )}
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
                        quantity < selectedVariant?.stock &&
                          setQuantity(quantity + 1);
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

            {/* Description */}
            <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
              <h1 className="text-gray-900 text-2xl font-medium font-title">
                Description & Fit
              </h1>
              <p className="text-gray-600 mt-2 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Shipping details */}
            <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
              <h1 className="text-gray-900 text-2xl font-medium font-title">
                Shipping
              </h1>
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Truck size={20} className="text-indigo-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      Free Shipping
                    </p>
                    <p className="text-sm text-gray-500">
                      On orders over 500 DH
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <RotateCcw size={20} className="text-indigo-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      Free Returns
                    </p>
                    <p className="text-sm text-gray-500">
                      10 days to change your mind
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Calendar size={20} className="text-indigo-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      Delivery Time
                    </p>
                    <p className="text-sm text-gray-500">Shipped within 48h</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Package size={20} className="text-indigo-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Package</p>
                    <p className="text-sm text-gray-500">Full protection</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Seller info */}
            <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
              <h1 className="text-gray-900 text-2xl font-medium font-title">
                Seller
              </h1>
              <div className="flex items-center">
                {`${API_URL}${seller.profilePhoto}` && (
                  <Link to={`/seller/${seller._id}`}>
                    <img
                      src={`${API_URL}${seller.profilePhoto}`}
                      alt="Profile preview"
                      className="w-15 h-15 rounded-full"
                    />
                  </Link>
                )}
                <div className="ml-3">
                  <Link to={`/seller/${seller._id}`}>
                    <p className="text-sm font-medium text-gray-900 capitalize">
                      {seller.fullName}
                    </p>
                  </Link>
                  <p className="text-sm text-gray-500">Stars reviews</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
