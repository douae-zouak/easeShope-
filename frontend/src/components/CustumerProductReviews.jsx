// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useCommentStore } from "../store/comment.store";
import { Trash2, X } from "lucide-react";
import { useState } from "react";

const CustumerProductReviews = ({ productReviews, renderStars, commentId }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const { deleteProductComment } = useCommentStore();

  const onDelete = async (reviewId) => {
    try {
      const res = await deleteProductComment(reviewId);
      console.log("resp : ", res);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(res.message);
      }
    } catch (error) {
      throw new Error(error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-xl shadow-xl mb-8 overflow-hidden border border-gray-100 flex-1"
    >
      <div className="p-6">
        <h1 className="text-gray-900 text-2xl font-medium font-title ">
          Customer Reviews
        </h1>

        <AnimatePresence>
          {productReviews.length > 0 ? (
            productReviews.map((review) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="border-b border-gray-100 py-6 last:border-0 relative"
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
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center mt-1">
                      <div className="flex">{renderStars(review.rating)}</div>
                    </div>
                    <p className="mt-2 text-gray-600">{review.comment}</p>

                    {/* Affichage des images */}
                    {review.images && review.images.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {review.images.map((img, index) => (
                          <div key={img.url} className="relative group">
                            <img
                              src={img.url} // Utilise directement l'URL Cloudinary
                              alt={`Review image ${index + 1}`}
                              className="w-24 h-24 object-cover rounded-md border border-gray-200 cursor-pointer transition-transform duration-200 hover:scale-105"
                              onClick={() => setSelectedImage(img.url)}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Modal pour agrandir l'image */}
                {selectedImage && (
                  <div
                    className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 "
                    onClick={() => setSelectedImage(null)} // Clique pour fermer
                  >
                    <img
                      src={selectedImage}
                      alt="Enlarged"
                      className="max-w-[90%] max-h-[90%] object-contain rounded-lg shadow-lg"
                    />
                  </div>
                )}

                {commentId && review._id === commentId && (
                  <div className="absolute bottom-0 right-0">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onDelete(review._id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        aria-label="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
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
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default CustumerProductReviews;
