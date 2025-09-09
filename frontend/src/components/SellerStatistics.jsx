// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useUserStore } from "../store/user.store";

const SellerStatistics = ({ stats }) => {
  const { sellerActiveProducts, sellerExperience } = useUserStore();

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
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">
              5 Star Ratings
            </span>
            <span className="text-sm font-medium text-gray-700">
              {Math.round((stats?.fiveStars * 100) / stats?.totalReviews)} %
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-yellow-400 h-2 rounded-full"
              style={{
                width: `${Math.round(
                  (stats?.fiveStars * 100) / stats?.totalReviews
                )}%`,
              }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">
              4 Star Ratings
            </span>
            <span className="text-sm font-medium text-gray-700">
              {Math.round((stats?.fourStars * 100) / stats?.totalReviews)} %
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-yellow-400 h-2 rounded-full"
              style={{
                width: `${Math.round(
                  (stats?.fourStars * 100) / stats?.totalReviews
                )}%`,
              }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">
              3 Star Ratings
            </span>
            <span className="text-sm font-medium text-gray-700">
              {Math.round((stats?.threeStars * 100) / stats?.totalReviews)} %
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-yellow-400 h-2 rounded-full"
              style={{
                width: `${Math.round(
                  (stats?.threeStars * 100) / stats?.totalReviews
                )}%`,
              }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">
              2 Star Ratings
            </span>
            <span className="text-sm font-medium text-gray-700">
              {Math.round((stats?.twoStars * 100) / stats?.totalReviews)} %
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-yellow-400 h-2 rounded-full"
              style={{
                width: `${Math.round(
                  (stats?.twoStars * 100) / stats?.totalReviews
                )}%`,
              }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">
              1 Star Ratings
            </span>
            <span className="text-sm font-medium text-gray-700">
              {Math.round((stats?.oneStar * 100) / stats?.totalReviews)} %
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-yellow-400 h-2 rounded-full"
              style={{
                width: `${Math.round(
                  (stats?.oneStar * 100) / stats?.totalReviews
                )}%`,
              }}
            ></div>
          </div>
        </div>
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
