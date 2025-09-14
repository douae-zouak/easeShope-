// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useCommentStore } from "../store/comment.store";
import { Star } from "lucide-react";

const ProductStats = () => {
  const { productStats } = useCommentStore();

  // Fonction utilitaire pour calculer le pourcentage
  const getPercentage = (count) => {
    if (!productStats?.totalReviews || productStats?.totalReviews === 0) {
      return 0; // pas de reviews => pas de remplissage
    }
    const value = Math.round((count * 100) / productStats?.totalReviews);
    return isNaN(value) ? 0 : value; // sécurité anti-NaN
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white rounded-lg shadow-lg p-6 mb-8 sticky top-30"
    >
      <h1 className="text-gray-900 text-2xl font-medium font-title mb-6">
        Rating & Reviews
      </h1>

      <div className="flex gap-10">
        <div className="w-[30%] text-center">
          <h1 className="text-7xl font-semibold">
            {productStats?.averageRating.toFixed(1).replace(".", ",")}
          </h1>
          <span className="text-sm text-gray-500 mt-1">
            ({productStats?.totalReviews}{" "}
            {productStats?.totalReviews === 0 || productStats?.totalReviews === 1
              ? "review"
              : "reviews"}
            )
          </span>
        </div>
        <div className="space-y-4 flex-1">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex gap-6 items-center">
              <div className="flex items-center gap-2 mb-1">
                <Star size={15} className="fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium text-gray-700">
                  {star}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gray-800 h-2 rounded-full transition-all"
                  style={{
                    width: `${getPercentage(
                      productStats?.[
                        star === 5
                          ? "fiveStars"
                          : star === 4
                          ? "fourStars"
                          : star === 3
                          ? "threeStars"
                          : star === 2
                          ? "twoStars"
                          : "oneStar"
                      ]
                    )}%`,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductStats;
