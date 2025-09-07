import { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useUserStore } from "../../store/user.store";
import { useParams } from "react-router-dom";

const SellerInfoPage = () => {
  const { seller, getSellerById } = useUserStore();
  const API_URL = import.meta.env.VITE_API_URL;

  const [reviews] = useState([
    {
      id: 1,
      user: "Michael Thompson",
      rating: 5,
      comment:
        "Excellent seller! The product was even better than described and shipping was super fast.",
      date: "2 weeks ago",
      verified: true,
    },
    {
      id: 2,
      user: "Jessica Williams",
      rating: 4,
      comment:
        "Good product quality but shipping took a bit longer than expected. Would still recommend this seller.",
      date: "1 month ago",
      verified: true,
    },
    {
      id: 3,
      user: "David Chen",
      rating: 5,
      comment:
        "Amazing craftsmanship! The attention to detail is impressive. Will definitely buy again.",
      date: "2 months ago",
      verified: true,
    },
  ]);

  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
  });

  const handleAddReview = () => {
    if (newReview.comment.trim() === "") return;

    // In a real app, you would send this to your backend
    alert(
      `Review submitted with rating: ${newReview.rating} and comment: ${newReview.comment}`
    );
    setNewReview({ rating: 5, comment: "" });
  };

  const { userId } = useParams();
  useEffect(() => {
    getSellerById(userId);
  }, []);

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
      {console.log("seller : ", seller)}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 z-10">
        {/* Seller Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden mb-8"
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
                  <div className="absolute bottom-0 right-0 bg-indigo-600 rounded-full p-1">
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
                      <div className="flex">{renderStars(seller.rating)}</div>
                      <span className="ml-2 text-gray-600">
                        {seller.rating} ({seller.totalReviews} reviews)
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
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-indigo-600 mr-2"
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
                    <span className="text-sm text-gray-600">
                      Response rate: {seller.responseRate}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-indigo-600 mr-2"
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
                    <span className="text-sm text-gray-600">
                      Response time: {seller.responseTime}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-indigo-600 mr-2"
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
                    <span className="text-sm text-gray-600">
                      Shipping: {seller.averageShipping}
                    </span>
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
              className="bg-white rounded-lg shadow-lg p-6 mb-8"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Customer Reviews
              </h2>

              {reviews.map((review) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="border-b border-gray-100 py-6 last:border-0"
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-700 font-medium">
                          {review.user.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <h3 className="text-sm font-medium text-gray-900">
                          {review.user}
                        </h3>
                        {review.verified && (
                          <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                            Verified
                          </span>
                        )}
                      </div>
                      <div className="flex items-center mt-1">
                        <div className="flex">{renderStars(review.rating)}</div>
                        <span className="ml-2 text-sm text-gray-500">
                          {review.date}
                        </span>
                      </div>
                      <p className="mt-2 text-gray-600">{review.comment}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Add Review Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-lg shadow-lg p-6"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                      72%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ width: "72%" }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      4 Star Ratings
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      18%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ width: "18%" }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      3 Star Ratings
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      6%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ width: "6%" }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      2 Star Ratings
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      3%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ width: "3%" }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      1 Star Ratings
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      1%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ width: "1%" }}
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

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                About the Seller
              </h2>
              <p className="text-gray-600 mb-4">
                Joined in {seller.joinedDate}
              </p>
              <p className="text-gray-600">
                Professional seller dedicated to providing high-quality products
                and excellent customer service. All items are carefully
                inspected before shipping to ensure customer satisfaction.
              </p>

              <button className="mt-6 w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">
                Visit Shop
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerInfoPage;
