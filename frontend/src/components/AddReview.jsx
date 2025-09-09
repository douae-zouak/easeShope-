// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useCommentStore } from "../store/comment.store";

const AddReview = ({ setNewReview, newReview, setRefresh, sellerId }) => {
  const { addSellerReview } = useCommentStore();

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white rounded-lg shadow-lg p-6 mb-12"
    >
      <h2 className="text-xl font-bold text-gray-900 mb-6">Add Your Review</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Rating
        </label>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setNewReview({ ...newReview, rating: star })}
              className="focus:outline-none"
            >
              <svg
                className={`w-8 h-8 ${
                  star <= newReview.rating ? "text-yellow-400" : "text-gray-300"
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
  );
};

export default AddReview;
