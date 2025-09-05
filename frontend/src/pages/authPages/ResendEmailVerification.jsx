// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useState } from "react";
import { Loader, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuthStore } from "../../store/auth.store";
import Input from "../../components/Input";
import toast from "react-hot-toast";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");

  const { isLoading, resendVerificationCode } = useAuthStore();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await resendVerificationCode(email);
      navigate("/auth/verify-email");
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        "Error sending verification code again! ";
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
        <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text text-center  bg-gradient-to-r from-blue-300 to-sky-600 text-transpare py-2">
          Email Verification
        </h2>

        <form onSubmit={handleSubmit}>
          <p className="text-center mb-6 text-gray-300">
            Enter you're email adress and we will send you a verification code
            again
          </p>

          <Input
            icon={Mail}
            type="email"
            placeholder="Email Adress"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <motion.button
            className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-sky-600 to-blue-400 text-white font-bold rounded-lg shadow-lg hover:from-sky-700 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
          >
            {isLoading ? (
              <Loader className="mx-auto w-6 h-6 animate-spin" />
            ) : (
              "Send Reset Link"
            )}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default ForgotPasswordPage;
