import { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { useUserStore } from "../../store/user.store";
import { useParams } from "react-router-dom";
import { useCommentStore } from "../../store/comment.store";
import toast from "react-hot-toast";

const SellerInfoPage = () => {
  const { seller, getSellerById } = useUserStore();
  const API_URL = import.meta.env.VITE_API_URL;

  const { sellerReviews, getSellerReviews, stats, addSellerReview } =
    useCommentStore();

  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
  });
  const [refresh, setRefresh] = useState(false);

  const { sellerId } = useParams();
  useEffect(() => {
    getSellerById(sellerId);
    getSellerReviews(sellerId);
  }, [refresh, sellerId]);

  const handleAddReview = async () => {
    const res = await addSellerReview(
      sellerId,
      newReview.rating,
      newReview.comment
    );

    if (res) {
      toast.error(res);
    } else {
      toast.success(`Review added successfully`);
    }
    setNewReview({ rating: 5, comment: "" });
    setRefresh((prev) => !prev);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <svg
        key={index}
        className={`w-5 h-5 ${
          index < rating ? "text-yellow-400" : "text-gray-300"
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover Photo */}
      <div className="h-48 md:h-64 w-full relative z-0">
        <img
          src="https://plus.unsplash.com/premium_photo-1673177667569-e3321a8d8256?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Cover"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10 ">
        {/* Seller Profile Card */}
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Reviews Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-xl shadow-xl mb-8 overflow-hidden border border-gray-100"
            >
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Customer Reviews
                </h2>

                <AnimatePresence>
                  {sellerReviews.length > 0 ? (
                    sellerReviews.map((review) => (
                      <motion.div
                        key={review.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-b border-gray-100 py-6 last:border-0"
                      >
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center justify-center shadow-md">
                              <span className="text-white font-medium uppercase">
                                {review.userId?.fullName?.charAt(0) || "U"}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4 flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="text-sm font-medium text-gray-900">
                                {review.userId?.fullName}
                              </h3>
                              <span className="text-xs text-gray-500">
                                {new Date(
                                  review.createdAt
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center mt-1">
                              <div className="flex">
                                {renderStars(review.rating)}
                              </div>
                            </div>
                            <p className="mt-2 text-gray-600">
                              {review.comment}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="py-10 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                        />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">
                        No reviews yet
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Be the first to review this seller.
                      </p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Add Review Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-lg shadow-lg p-6 mb-12"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Add Your Review
              </h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Rating
                </label>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setNewReview({ ...newReview, rating: star })
                      }
                      className="focus:outline-none"
                    >
                      <svg
                        className={`w-8 h-8 ${
                          star <= newReview.rating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="comment"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Your Review
                </label>
                <textarea
                  id="comment"
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-300 outline-none"
                  value={newReview.comment}
                  onChange={(e) =>
                    setNewReview({ ...newReview, comment: e.target.value })
                  }
                  placeholder="Share your experience with this seller"
                ></textarea>
              </div>

              <button
                onClick={handleAddReview}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg"
              >
                Submit Review
              </button>
            </motion.div>
          </div>

          {/* Seller Stats */}
          <div>
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
                      {Math.round(
                        (stats?.fiveStars * 100) / stats?.totalReviews
                      )}{" "}
                      %
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
                      {Math.round(
                        (stats?.fourStars * 100) / stats?.totalReviews
                      )}{" "}
                      %
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
                      {Math.round(
                        (stats?.threeStars * 100) / stats?.totalReviews
                      )}{" "}
                      %
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
                      {Math.round(
                        (stats?.twoStars * 100) / stats?.totalReviews
                      )}{" "}
                      %
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
                      {Math.round((stats?.oneStar * 100) / stats?.totalReviews)}{" "}
                      %
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
                  <div className="text-2xl font-bold text-indigo-600">98%</div>
                  <div className="text-sm text-gray-600">Positive Feedback</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-indigo-600">
                    2 years
                  </div>
                  <div className="text-sm text-gray-600">
                    Selling Experience
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-indigo-600">256</div>
                  <div className="text-sm text-gray-600">Items Sold</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-indigo-600">24</div>
                  <div className="text-sm text-gray-600">Active Products</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerInfoPage;
