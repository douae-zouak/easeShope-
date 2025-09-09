// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
const API_URL = import.meta.env.VITE_API_URL;

const SellerProfileCard = ({ seller, stats, renderStars }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-lg mb-8"
    >
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start">
          <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-6">
            <motion.div whileHover={{ scale: 1.05 }} className="relative">
              {`${API_URL}${seller.profilePhoto}` && (
                <img
                  src={`${API_URL}${seller.profilePhoto}`}
                  alt={seller.fullName}
                  className="h-24 w-24 md:h-32 md:w-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
              )}
              <div className="absolute bottom-1 right-1 bg-indigo-600 rounded-full p-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </motion.div>
          </div>

          <div className="flex-grow">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {seller.fullName}
                </h1>
                <div className="flex items-center mt-2">
                  <div className="flex">
                    {renderStars(stats?.averageRating)}
                  </div>
                  <span className="ml-2 text-gray-600">
                    {stats?.averageRating} ({stats?.totalReviews} reviews)
                  </span>
                </div>
              </div>

              <button className="mt-4 md:mt-0 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
                Contact Seller
              </button>
            </div>

            <p className="mt-4 text-gray-600">{seller.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="flex items-center p-3">
                <div className="bg-indigo-100 p-2 rounded-full mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <span className="block text-sm font-medium text-gray-600">
                    Response Rate
                  </span>
                  <span className="block text-sm text-gray-900">
                    {seller?.responseRate}
                  </span>
                </div>
              </div>

              <div className="flex items-center p-3">
                <div className="bg-indigo-100 p-2 rounded-full mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <span className="block text-sm font-medium text-gray-600">
                    Response Time
                  </span>
                  <span className="block text-sm text-gray-900">
                    {seller?.responseTime}
                  </span>
                </div>
              </div>

              <div className="flex items-center p-3">
                <div className="bg-indigo-100 p-2 rounded-full mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                    />
                  </svg>
                </div>
                <div>
                  <span className="block text-sm font-medium text-gray-600">
                    Shipping On Time
                  </span>
                  <span className="block text-sm text-gray-900">
                    {seller?.averageShipping}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SellerProfileCard;
