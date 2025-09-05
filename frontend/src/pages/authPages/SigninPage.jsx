// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  ChevronDown,
  Loader,
  Lock,
  Mail,
  ShoppingBag,
  Store,
  User,
} from "lucide-react";

import Input from "../../components/Input";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordStrengthMeter from "../../components/PasswordStrengthMeter";
import { useAuthStore } from "../../store/auth.store";
import toast from "react-hot-toast";

export const SigninPage = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("buyer");

  const navigate = useNavigate();

  const { signup, isLoading } = useAuthStore();

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      await signup(fullName, email, password, confirmPassword, role);
      navigate("/auth/verify-email");
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Please fill all fields!";
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
          Create Account
        </h2>
        <form onSubmit={handleSignUp}>
          <Input
            icon={User}
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <Input
            icon={Mail}
            type="email"
            placeholder="Email Adress"
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
          <Input
            icon={Lock}
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <div className="relative mb-6">
            {/* Icône à gauche */}
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              {role === "vendor" ? (
                <Store className="size-5 text-blue-500" />
              ) : (
                <ShoppingBag className="size-5 text-blue-500" />
              )}
            </div>

            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ChevronDown className="size-5 text-gray-400" />
            </div>

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full pl-10 pr-10 py-2 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 
                   focus:border-blue-500 focus:ring-2 focus:ring-blue-500 
                   text-white placeholder-gray-400 transition duration-200 appearance-none"
            >
              <option value="vendor">Vendor</option>
              <option value="buyer">Buyer</option>
            </select>
          </div>

          <PasswordStrengthMeter password={password} />

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
              "Sign Up"
            )}
          </motion.button>
        </form>
      </div>

      <div className="px-8 py-4 bg-gray-900 opacity-80 flex justify-center">
        <p className="text-sm text-gray-400">
          Already has an account?{" "}
          <Link to={"/auth/login"} className="text-blue-300 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </motion.div>
  );
};
