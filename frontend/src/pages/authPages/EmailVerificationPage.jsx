// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";
import { useAuthStore } from "../../store/auth.store";

const EmailVerificationPage = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRef = useRef([]);
  const navigate = useNavigate();

  const { isLoading, verifyEmail } = useAuthStore();

  const handleEmailResending = async () => {
    try {
      navigate("/auth/resent-verification-code");
    } catch (error) {
      toast.error(`Error sending verification code again: ${error.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const verificationCode = code.join("");

    try {
      await verifyEmail(verificationCode);
      toast.success("Email verified successfully");
      navigate("/auth/login");
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        "Invalid verifcation code. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleChange = (index, value) => {
    const newCode = [...code];

    // handle pasted content
    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || "";
      }
      setCode(newCode);

      // focus on the last non-empty input or the first empty one
      const lastFileIndex = newCode.findLastIndex((digit) => digit !== "");
      const focusIndex = lastFileIndex < 5 ? lastFileIndex + 1 : 5;
      inputRef.current[focusIndex].focus();
    } else {
      newCode[index] = value;
      setCode(newCode);

      // move focus to the next input field if value is entered
      if (value && index < 5) {
        inputRef.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRef.current[index - 1].focus();
    }
  };

  // Auto submit when all fields are filled
  useEffect(() => {
    if (code.every((digit) => digit !== "")) {
      handleSubmit(new Event("submit"));
    }
  }, [code]);

  return (
    <div className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        <div className="p-8">
          <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text text-center  bg-gradient-to-r from-blue-300 to-sky-600 py-1">
            Verify Your Email
          </h2>

          <p className="text-center text-gray-300 mb-6">
            Enter the 6-digits code sent to your email address.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-between">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRef.current[index] = el)}
                  type="text"
                  maxLength={6}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-2xl font-bold bg-gray-700 text-white border-2 border-gray-800 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading || code.some((digit) => !digit)}
              className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-sky-600 to-blue-400 text-white font-bold rounded-lg shadow-lg hover:from-sky-700 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader className="mx-auto w-6 h-6 animate-spin" />
              ) : (
                "Verify Email"
              )}
            </motion.button>

            <p
              className="text-sm text-center text-blue-300 hover:underline"
              onClick={handleEmailResending}
            >
              Send verification code again
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default EmailVerificationPage;
