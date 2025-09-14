import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Heart,
  Search,
  ChevronRight,
  ShoppingCart,
  LogOut,
  Package,
} from "lucide-react";
import { useAuthStore } from "../store/auth.store";
import { useProductStore } from "../store/product.store";
import { useFavoriteStore } from "../store/favorite.store";
import { useCartStore } from "../store/cart.store";

// Categories data organized by gender
const GENDER_CATEGORIES = {
  women: [
    {
      name: "Clothing",
      subcategories: [
        "Dresses",
        "Tops & T-Shirts",
        "Blouses & Shirts",
        "Pants",
        "Jeans",
        "Skirts",
        "Jackets & Coats",
        "Activewear",
      ],
      image: "/women_fashion.jpg",
    },
    {
      name: "Shoes",
      subcategories: [
        "Boots",
        "Sandals",
        "Sneakers",
        "Heels",
        "Flats",
        "Loafers",
      ],
      image: "/women_shoes.jpg",
    },
    {
      name: "Accessories",
      subcategories: [
        "Bags & Purses",
        "Wallets",
        "Belts",
        "Hats",
        "Sunglasses",
        "Jewelry",
        "Scarves",
      ],
      image: "/jewerlies.jpg",
    },
    {
      name: "Beauty",
      subcategories: ["Skincare", "Makeup", "Hair Care", "Fragrances"],
      image: "/makeup.jpg",
    },
  ],
  men: [
    {
      name: "Clothing",
      subcategories: [
        "T-Shirts",
        "Shirts",
        "Pants",
        "Jeans",
        "Suits & Blazers",
        "Jackets & Coats",
        "Activewear",
        "Shorts",
      ],
      image: "/men.jpg",
    },
    {
      name: "Shoes",
      subcategories: [
        "Sneakers",
        "Boots",
        "Dress Shoes",
        "Sandals",
        "Loafers",
        "Athletic Shoes",
      ],
      image:
        "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Accessories",
      subcategories: [
        "Watches",
        "Belts",
        "Wallets",
        "Hats",
        "Sunglasses",
        "Ties",
        "Bags",
      ],
      image: "/men_acc.jpg",
    },
    {
      name: "Grooming",
      subcategories: ["Skincare", "Hair Care", "Shaving", "Fragrances"],
      image:
        "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    },
  ],
  kids: [
    {
      name: "Girls",
      subcategories: ["Dresses", "Tops", "Bottoms", "Shoes", "Accessories"],
      image: "/girls.jpg",
    },
    {
      name: "Boys",
      subcategories: ["T-Shirts", "Shirts", "Pants", "Shoes", "Accessories"],
      image:
        "https://images.unsplash.com/photo-1519457431-44ccd64a579b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Baby",
      subcategories: ["Onesies", "Sleepwear", "Outerwear", "Accessories"],
      image: "/babies.jpg",
    },
    {
      name: "Toys",
      subcategories: ["Educational", "Outdoor", "Games", "Stuffed Animals"],
      image: "/toys.jpg",
    },
  ],
  electronics: [
    {
      name: "Mobile Phones",
      subcategories: ["Smartphones", "Cases", "Chargers", "Accessories"],
      image:
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Laptops",
      subcategories: ["Gaming", "Business", "Ultrabooks", "Accessories"],
      image:
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Audio",
      subcategories: ["Headphones", "Speakers", "Earbuds", "Home Audio"],
      image:
        "https://images.unsplash.com/photo-1546435770-a3e426bf472b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Wearables",
      subcategories: ["Smartwatches", "Fitness Trackers", "VR Headsets"],
      image:
        "https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    },
  ],
};

const ProductDetailsNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeGender, setActiveGender] = useState("women");
  const [activeCategory, setActiveCategory] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const { user, logout } = useAuthStore();
  const { getColor, getInitial } = useProductStore();
  const { favorites } = useFavoriteStore();
  const { cart } = useCartStore();

  const navigate = useNavigate();

  const isAuthenticated = false; // mock

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen((s) => {
      if (!s) setActiveCategory(null); // ouverture : reset category
      return !s;
    });
  };

  const handleGenderSelect = (gender) => {
    setActiveGender(gender);
    setActiveCategory(null);
  };

  const API_URL = import.meta.env.VITE_API_URL;
  const photo = user?.profilePhoto ? `${API_URL}${user.profilePhoto}` : null;

  const handleLogout = async () => {
    await logout();
    navigate("/auth/login");
  };

  return (
    <>
      {/* NAVBAR */}
      <nav
        className={`fixed top-0 right-0 left-0  transition-all duration-300  z-40 pb-2 ${
          isScrolled ? "backdrop-blur-md bg-white/80" : ""
        }`}
      >
        <div>
          <div className="flex justify-end items-center h-16 mr-10">
            {/* Search (desktop) */}
            {/* <div className="hidden md:flex items-center flex-1 max-w-sm mx-70">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search for products..."
                  className="w-full px-4 py-2 pl-10 pr-4 border-b border-gray-500 focus:outline-none focus:border-[#6a59d6]"
                />
                <Search
                  size={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
              </div>
            </div> */}

            {/* User actions */}
            <div>
              {user?.role === "buyer" ? (
                <div className="flex items-center space-x-6">
                  <div className="flex flex-row gap-4 items-center">
                    {/* orders */}

                    <Link to="/client/orders">
                      <button>
                        <Package
                          className={`w-6 h-6 transition-all duration-200 hover:scale-110 cursor-pointer`}
                        />
                      </button>
                    </Link>

                    {/* whishlist */}
                    <Link to="/client/wishlist">
                      <button>
                        <Heart
                          className={`w-6 h-6 text-red-500 transition-all duration-200 hover:scale-110 ${
                            favorites.length !== 0
                              ? "fill-red-500 "
                              : "hover:fill-red-500 "
                          } cursor-pointer`}
                        />
                      </button>
                    </Link>

                    {/* Cart */}
                    <Link to="/client/cart">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="relative p-2 flex items-center justify-center transition-colors duration-200"
                      >
                        <ShoppingCart className="w-6 h-6 text-blue-600 hover:text-blue-800 cursor-pointer" />

                        <AnimatePresence>
                          {cart.length > 0 && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1, rotate: 0 }}
                              exit={{ scale: 0 }}
                              className="absolute -top-0 -right-1 w-5 h-5 rounded-full bg-red-600 flex items-center justify-center shadow-lg"
                            >
                              <span className="text-white text-xs font-medium">
                                {cart.length}
                              </span>

                              {/* Halo animé autour du badge */}
                              <motion.span
                                className="absolute w-7 h-7 rounded-full border-2 border-red-400"
                                animate={{
                                  scale: [1, 1.4, 1],
                                  opacity: [0.6, 0.3, 0],
                                }}
                                transition={{
                                  repeat: Infinity,
                                  duration: 1.2,
                                  ease: "easeInOut",
                                }}
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.button>
                    </Link>
                  </div>

                  {/* Profile avatar */}
                  <div className="relative">
                    <button onClick={() => setOpen(!open)}>
                      {photo ? (
                        <img
                          src={photo}
                          alt="Profile"
                          className="w-10 h-10 rounded-full border hover:ring-2 hover:ring-indigo-500 transition cursor-pointer"
                        />
                      ) : (
                        <div
                          className={`w-10 h-10 rounded-full border flex items-center justify-center text-xl font-medium hover:ring-2 hover:ring-gray-300 ${getColor(
                            user?.fullName
                          )}`}
                        >
                          {getInitial(user?.fullName)}
                        </div>
                      )}
                    </button>

                    {open && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
                        <Link
                          to="/client/profile"
                          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 hover:rounded-lg"
                          onClick={() => setOpen(false)}
                        >
                          <User size={16} />
                          Profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 hover:rounded-lg"
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  className="w-32 flex justify-center items-center gap-1 px-4 py-2 text-md font-medium bg-[#7D6BFB] text-white hover:bg-[#6a59d6] rounded-lg cursor-pointer transition-colors duration-200"
                  onClick={() => navigate("/auth/login")}
                >
                  <span>Login</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div
        className={`fixed top-0 left-0 w-[495px] z-50 transition-all  flex items-center h-20 ${
          isMenuOpen ? "bg-gray-100 duration-[3s] " : ""
        }`}
      >
        {/* --- Burger button (TON burger, au-dessus du sidebar) --- */}
        <button
          onClick={toggleMenu}
          aria-label="Open menu"
          className="mx-10 w-14 h-14 cursor-pointer"
        >
          {/* burger lines (avec before/after) */}
          <div
            className={`relative z-50 w-[50px] h-[5px] bg-black rounded-2xl transition-all duration-500 ease-in-out 
                  before:content-[''] before:absolute before:w-[50px] before:h-[5px] before:rounded-2xl before:transition-all before:duration-500 before:ease-in-out before:-top-3 before:left-0 before:bg-black
                  after:content-[''] after:absolute after:w-[50px] after:h-[5px] after:rounded-2xl after:transition-all after:duration-500 after:ease-in-out after:top-3 after:left-0 after:bg-black
                  ${
                    isMenuOpen
                      ? "bg-transparent before:rotate-[45deg] after:-rotate-[45deg] before:translate-x-[8px] after:translate-x-[8px] before:translate-y-[12px] after:-translate-y-[12px]"
                      : ""
                  }`}
          />
        </button>

        {/* Logo */}
        <Link to="/home" className="mx-10">
          <h1 className="text-3xl font-bold text-gray-800">X ZARA</h1>
        </Link>
      </div>

      {/* spacer to not hide content */}
      <div className="h-16" />

      {/* --- Overlay --- */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={toggleMenu}
          />
        )}
      </AnimatePresence>

      {/* --- Sidebar --- */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", ease: "easeInOut", duration: 0.7 }}
            className="fixed top-0 left-0 bottom-0 w-full max-w-lg bg-gray-100 z-40 shadow-2xl pt-20 overflow-y-auto "
          >
            <div className="p-6 min-h-full flex flex-col">
              {/* main area: genders (left) + categories (right) */}
              <div className="flex gap-6 flex-1">
                {/* GENDERS (à GAUCHE) */}
                <div className="w-1/4 pr-5">
                  <div className="flex flex-col gap-3">
                    {Object.keys(GENDER_CATEGORIES).map((gender) => (
                      <button
                        key={gender}
                        onClick={() => handleGenderSelect(gender)}
                        className={`text-sm text-left font-medium py-2 px-1 rounded  ${
                          activeGender === gender
                            ? "text-black"
                            : "text-gray-500"
                        }`}
                      >
                        {gender.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* CATEGORIES (à DROITE, plus d'espace) */}
                <div className="w-3/4 pl-2">
                  {GENDER_CATEGORIES[activeGender].map((category) => (
                    <div
                      key={category.name}
                      className="border-b border-gray-200"
                    >
                      <button
                        className="w-full py-3 flex items-center justify-between text-left"
                        onClick={() =>
                          setActiveCategory(
                            activeCategory === category.name
                              ? null
                              : category.name
                          )
                        }
                      >
                        <span className="font-medium">{category.name}</span>
                        <ChevronRight
                          size={16}
                          className={`transform transition-transform ${
                            activeCategory === category.name ? "rotate-90" : ""
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {activeCategory === category.name && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="pb-4 pl-4">
                              <div className="mb-4">
                                <img
                                  src={category.image}
                                  alt={category.name}
                                  className="w-full h-40 object-cover rounded"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                {category.subcategories.map((sub) => (
                                  <Link
                                    key={sub}
                                    to={`/category/${
                                      activeGender.charAt(0).toUpperCase() +
                                      activeGender.slice(1).toLowerCase()
                                    }/${sub.replace(/\s+/g, "-")}`}
                                    className="text-sm text-gray-600 hover:text-black py-1"
                                    onClick={toggleMenu}
                                  >
                                    {sub}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional links (sous) */}
              <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                <Link
                  to="/new"
                  className="block py-2 font-medium"
                  onClick={toggleMenu}
                >
                  NEW ARRIVALS
                </Link>
                <Link
                  to="/sale"
                  className="block py-2 font-medium"
                  onClick={toggleMenu}
                >
                  SALE
                </Link>
                <Link
                  to="/trending"
                  className="block py-2 font-medium"
                  onClick={toggleMenu}
                >
                  TRENDING NOW
                </Link>
                <Link
                  to="/magazine"
                  className="block py-2 font-medium"
                  onClick={toggleMenu}
                >
                  MAGAZINE
                </Link>
              </div>

              {/* Auth links (encore en dessous) */}
              <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                {isAuthenticated ? (
                  <>
                    <Link to="/account" className="block py-2">
                      MY ACCOUNT
                    </Link>
                    <Link to="/orders" className="block py-2">
                      MY ORDERS
                    </Link>
                    <Link to="/wishlist" className="block py-2">
                      MY WISHLIST
                    </Link>
                    <button className="block py-2 mx-auto">LOGOUT</button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/auth/login"
                      className="block py-2"
                      onClick={toggleMenu}
                    >
                      LOGIN
                    </Link>
                    <Link
                      to="/auth/register"
                      className="block py-2"
                      onClick={toggleMenu}
                    >
                      CREATE ACCOUNT
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductDetailsNav;
