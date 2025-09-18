// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Loader, Lock, Mail, User } from "lucide-react";

import Input from "../../components/Input";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { isLoading, login } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const loggedInUser = await login(email, password);

      if (loggedInUser.error) {
        toast.error(loggedInUser.error);
      }

      if (loggedInUser?.error?.includes("Your account is desactivated")) {
        console.log("ehre");
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
    } catch (error) {
      if (error.response?.data?.error?.includes("desactivated")) {
        // navigate("/vendor/desactivated");
        toast.error("here");
      }
      const errorMessage =
        error.response?.data?.error || "Invalid credentials. Please try again.";
      console.log("err ; ", error);
      toast.error(errorMessage);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="max-w-md w-full bg-gray-800 opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
    >
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text text-center  bg-gradient-to-r from-blue-300 to-sky-600 text-transpare">
          Welcome Back
        </h2>
        <form onSubmit={handleLogin}>
          <Input
            icon={Mail}
            type="email"
            placeholder="Email Adress"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            icon={Lock}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex items-center mb-4">
            <Link
              to="/auth/forgot-password"
              className="text-sm text-blue-300 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <motion.button
            className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-sky-600 to-blue-400 text-white font-bold rounded-lg shadow-lg hover:from-sky-700 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="mx-auto w-6 h-6 animate-spin" />
            ) : (
              "Login"
            )}
          </motion.button>
        </form>
      </div>

      <div className="px-8 py-4 bg-gray-900 opacity-80 flex justify-center">
        <p className="text-sm text-gray-400">
          D'ont have an account?{" "}
          <Link to={"/auth/signin"} className="text-blue-300 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default LoginPage;
