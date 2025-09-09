import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

import { useProductStore } from "../store/product.store";
import { useAuthStore } from "../store/auth.store";
import { useCartStore } from "../store/cart.store";

import { ShoppingCart, User, LogOut, Heart, Package } from "lucide-react";
import { useFavoriteStore } from "../store/favorite.store";

const ClientNav = () => {
  const [open, setOpen] = useState(false);

  const { getColor, getInitial } = useProductStore();
  const { favorites, getFavorites } = useFavoriteStore();
  const { cart } = useCartStore();
  const { user, logout } = useAuthStore();

  useEffect(() => {
    getFavorites();
  }, []);

  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;
  const photo = user?.profilePhoto ? `${API_URL}${user.profilePhoto}` : null;

  const handleLogout = async () => {
    await logout();
    navigate("/auth/login");
  };

  return (
    <div className="flex justify-between items-center px-6 py-3 shadow-lg bg-white">
      {/* Logo */}
      <Link to="/home">
        <img
          src="/logo.png"
          alt="logo"
          className="w-24 cursor-pointer"
          onClick={() => navigate("/")}
        />
      </Link>

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
  );
};

export default ClientNav;
