// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useUserStore } from "../store/user.store";

const SellerStatistics = ({ stats }) => {
  const { sellerActiveProducts, sellerExperience } = useUserStore();

  const starRatings = [
    { label: "5 Star Ratings", value: stats?.fiveStars },
    { label: "4 Star Ratings", value: stats?.fourStars },
    { label: "3 Star Ratings", value: stats?.threeStars },
    { label: "2 Star Ratings", value: stats?.twoStars },
    { label: "1 Star Ratings", value: stats?.oneStar },
  ];

  const totalReviews = stats?.totalReviews || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white rounded-lg shadow-lg p-6 mb-8"
    >
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        Seller Statistics
      </h2>

      <div className="space-y-4">
        {starRatings.map((star, index) => {
          const percentage = totalReviews
            ? Math.round((star.value * 100) / totalReviews)
            : 0;
          return (
            <div key={index}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">
                  {star.label}
                </span>
                <span className="text-sm font-medium text-gray-700">
                  {percentage} %
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    percentage > 0 ? "bg-yellow-400" : "bg-gray-400"
                  }`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-indigo-600">
            {sellerActiveProducts.length}
          </div>
          <div className="text-sm text-gray-600">Active Products</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-indigo-600">
            {sellerExperience}
          </div>
          <div className="text-sm text-gray-600">Selling Experience</div>
        </div>
      </div>
    </motion.div>
  );
};

export default SellerStatistics;
