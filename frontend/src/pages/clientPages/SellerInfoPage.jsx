import { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";

import { useUserStore } from "../../store/user.store";
import { useCommentStore } from "../../store/comment.store";

import SellerProfileCard from "../../components/SellerProfileCard";
import CustumerReviews from "../../components/CustumerReviews";
import AddReview from "../../components/AddReview";
import SellerStatistics from "../../components/SellerStatistics";
import ClientProductCard from "../../components/ClientProductCard";
import Footer from "../../components/footer";

const SellerInfoPage = () => {
  const { sellerId } = useParams();
  const [activeTab, setActiveTab] = useState("reviews"); // "reviews" or "products"

  const {
    seller,
    getSellerById,
    getSellerActiveProducts,
    sellerActiveProducts,
    getSellerExperience,
    commentId,
    commented,
  } = useUserStore();
  const { sellerReviews, getSellerReviews, stats } = useCommentStore();

  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    getSellerById(sellerId);
    getSellerReviews(sellerId);
    getSellerActiveProducts(sellerId);
    getSellerExperience(sellerId);
    commented(sellerId);
  }, [refresh, sellerId]);

  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
  });

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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        {/* Seller Profile Card */}
        <SellerProfileCard
          seller={seller}
          stats={stats}
          renderStars={renderStars}
        />

        {/* Navigation Tabs */}
        <div className="mt-8 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("reviews")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "reviews"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Reviews & Ratings
            </button>
            <button
              onClick={() => setActiveTab("products")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "products"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Seller Products ({sellerActiveProducts.length})
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === "reviews" ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Reviews Section */}
              <div className="lg:col-span-2">
                <CustumerReviews
                  sellerReviews={sellerReviews}
                  renderStars={renderStars}
                  commentId={commentId}
                  sellerId={sellerId}
                />

                {/* Add Review Section */}
                {!commentId && (
                  <AddReview
                    setNewReview={setNewReview}
                    newReview={newReview}
                    setRefresh={setRefresh}
                    sellerId={sellerId}
                  />
                )}
              </div>

              {/* Seller Stats */}
              <div>
                <SellerStatistics stats={stats} />
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Seller Products Section */}
              {sellerActiveProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {sellerActiveProducts.map((product) => (
                    <ClientProductCard key={product._id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-8m8 0h-8m0 0V9a2 2 0 00-2-2H6a2 2 0 00-2 2v4h8"
                    />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">
                    No products available
                  </h3>
                  <p className="mt-1 text-gray-500">
                    This seller doesn't have any active products at the moment.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SellerInfoPage;
