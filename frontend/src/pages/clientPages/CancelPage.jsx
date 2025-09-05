import React from "react";
import { Link } from "react-router-dom";
import {
  XCircle,
  ArrowLeft,
  RefreshCw,
  CreditCard,
  Shield,
} from "lucide-react";
import { motion } from "framer-motion";

const PaymentCancel = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-orange-100 p-4 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full relative z-10"
      >
        {/* Decorative element */}
        <motion.div
          className="absolute -top-4 -left-4 w-32 h-32 rounded-full bg-rose-100 opacity-50 -z-10"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        />

        <div className="relative">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.1,
            }}
            className="flex justify-center mb-6"
          >
            <XCircle className="w-20 h-20 text-rose-500 drop-shadow-lg" />
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-3xl font-bold text-gray-900 mb-4 text-center"
          >
            Payment Cancelled
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-gray-600 mb-6 text-center"
          >
            Your payment process was cancelled. No amount has been charged to
            your account.
          </motion.p>

          {/* Additional information */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="bg-rose-50 p-4 rounded-xl mb-6"
          >
            <div className="flex items-start mb-3">
              <Shield className="text-rose-500 mr-3 mt-1" size={18} />
              <div>
                <h3 className="font-medium text-rose-800">
                  Transaction cancelled
                </h3>
                <p className="text-sm text-rose-600">
                  Your payment information has not been stored.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Suggestions */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mb-6"
          >
            <h3 className="font-medium text-gray-700 mb-2">
              Suggested next steps:
            </h3>
            <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
              <li>Verify your payment method details</li>
              <li>Contact your bank if there's an issue</li>
              <li>Try again with a different card if needed</li>
            </ul>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="flex flex-col gap-3"
          >
            <Link to="/cart">
              <button className="w-full flex items-center justify-center gap-2 bg-rose-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-rose-700 transition-colors">
                <RefreshCw size={18} />
                Retry Payment
              </button>
            </Link>

            <Link
              to="/home"
              className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft size={18} />
              Return to Home
            </Link>

            <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-4">
              <CreditCard size={14} />
              <span>Secure payments</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Decorative background elements */}
      <motion.div
        className="absolute bottom-10 left-10 w-20 h-20 rounded-full bg-rose-200 opacity-30"
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 4,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-10 right-10 w-16 h-16 rounded-full bg-orange-200 opacity-30"
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 3,
          ease: "easeInOut",
          repeatDelay: 0.5,
        }}
      />
    </div>
  );
};

export default PaymentCancel;
