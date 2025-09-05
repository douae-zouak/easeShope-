import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, ArrowLeft, Download, Star, Truck } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { useProductStore } from "../../store/product.store";

const PaymentSuccess = () => {
  const [showConfetti, setShowConfetti] = useState(true);
  const { total } = useProductStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Generate stars for confetti effect
  const confetti = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    left: Math.floor(Math.random() * 100) + "vw",
    delay: Math.random() * 2,
    size: Math.floor(Math.random() * 15) + 5,
  }));

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 p-10 relative overflow-hidden">
      {/* Confetti effect */}
      <AnimatePresence>
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none">
            {confetti.map((star) => (
              <motion.div
                key={star.id}
                className="absolute text-yellow-500 opacity-70"
                style={{ left: star.left, top: "-10%" }}
                initial={{ y: 0, rotate: 0, opacity: 1 }}
                animate={{
                  y: "110vh",
                  rotate: 360,
                  opacity: 0,
                }}
                transition={{
                  duration: 2,
                  delay: star.delay,
                  ease: "easeOut",
                }}
                exit={{ opacity: 0 }}
              >
                <Star size={star.size} />
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full relative z-10"
      >
        {/* Animated circle behind the icon */}
        <motion.div
          className="absolute -top-4 -left-4 w-32 h-32 rounded-full bg-green-100 opacity-50 -z-10"
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
            <CheckCircle className="w-20 h-20 text-green-500 drop-shadow-lg" />
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-3xl font-bold text-gray-900 mb-4 text-center"
          >
            Payment Successful!
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-gray-600 mb-6 text-center"
          >
            Your payment has been processed successfully. A confirmation email
            has been sent to your address.
          </motion.p>

          {/* Order details */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="bg-gray-50 p-4 rounded-xl mb-6"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-500">Amount</span>
              <span className="font-medium">{total} DH</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Date</span>
              <span className="font-medium">
                {new Date().toLocaleDateString()}
              </span>
            </div>
          </motion.div>

          {/* Delivery info */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex items-center bg-blue-50 p-3 rounded-lg mb-6"
          >
            <Truck className="text-blue-500 mr-3" size={20} />
            <span className="text-sm text-blue-700">
              Your order will be delivered in 2-3 business days
            </span>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="flex flex-col justify-between sm:flex-row gap-3"
          >
            <Link
              to="/home"
              className="flex items-center justify-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft size={18} />
              Back to Home
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
