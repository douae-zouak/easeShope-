// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacit: 0, scale: 0.9 }}
      transition={{ duration: 1 }}
      className="max-w-md w-full mx-auto mt-10 p-8 bg-gray-900 opacity-80 backdrop-filter backdrop-blur-lg rounded-2xl border border-gray-800"
    >
      <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text pb-3">
        Page Not Found
      </h2>

      <div className="px-8 py-4 bg-gray-900 opacity-80 flex justify-center">
        <Link to={"/auth/login"} className="text-blue-300 hover:underline">
          return to home page
        </Link>
      </div>
    </motion.div>
  );
};

export default NotFoundPage;
