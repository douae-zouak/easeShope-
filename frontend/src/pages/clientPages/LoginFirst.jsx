// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { Loader, Lock, Mail, User, X } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/auth.store";
import Input from "../../components/Input";

const LoginFirst = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { isLoading, login } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const loggedInUser = await login(email, password);

      if (loggedInUser.error.includes("desactivated")) {
        navigate("/desactivated");
      }

      if (loggedInUser?.role === "vendor") {
        navigate("/vendor/dashboard");
      }
      if (loggedInUser?.role === "buyer") {
        navigate("/home");
      }
      if (loggedInUser?.role === "admin") {
        navigate("/admin/dashboard");
      }

      // Close the modal after a successful login
      onClose();
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Invalid credentials. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 bg-opacity-70 flex items-center justify-center p-4 z-50 backdrop-filter backdrop-blur-sm"
          onClick={handleOverlayClick}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative max-w-md w-full bg-gray-800 shadow-xl rounded-xl overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            <div className="p-8">
              <h2 className="text-3xl font-bold pb-2 mb-2 text-center bg-gradient-to-r from-blue-300 to-sky-600 bg-clip-text text-transparent">
                Log in
              </h2>
              <p className="text-gray-400 text-center mb-6 text-sm">
                You must be logged in to access this feature
              </p>

              <form onSubmit={handleLogin}>
                <Input
                  icon={Mail}
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Input
                  icon={Lock}
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <div className="flex items-center justify-between mb-4">
                  <Link
                    to="/auth/forgot-password"
                    className="text-sm text-blue-300 hover:underline"
                    onClick={onClose}
                  >
                    Forgot password?
                  </Link>
                </div>

                <motion.button
                  className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-sky-600 to-blue-400 text-white font-bold rounded-lg shadow-lg hover:from-sky-700 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition duration-200 disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader className="mx-auto w-6 h-6 animate-spin" />
                  ) : (
                    "Log in"
                  )}
                </motion.button>
              </form>
            </div>

            <div className="px-8 py-4 bg-gray-900 flex justify-center">
              <p className="text-sm text-gray-400">
                Don’t have an account?{" "}
                <Link
                  to={"/auth/signin"}
                  className="text-blue-300 hover:underline"
                  onClick={onClose}
                >
                  Sign up
                </Link>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginFirst;
