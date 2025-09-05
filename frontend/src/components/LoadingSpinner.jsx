// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D1723] via-[#1C66BB] to-[#324E71] flex items-center justify-center relative overflow-hidden">
      <motion.div
        className="w-16 h-16 border-t-4 border-t-blue-500 border-blue-200 rounded-full"
        animate={{ roatation: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};

export default LoadingSpinner;
