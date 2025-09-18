// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useRef, useState } from "react";
import { Star, Send, X, ImagePlus } from "lucide-react"; // Ajout des imports manquants
import { useCommentStore } from "../store/comment.store";

const AddReview = ({ productId, onReviewAdded }) => {
  // Modification des props
  const { addProductReview, isLoading } = useCommentStore(); // Récupération du state isLoading
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" }); // Déplacement du state local
  const [imagePreviews, setImagePreviews] = useState([]);
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);

  const handleAddReview = async () => {
    if (!newReview.comment.trim()) {
      toast.error("Please write a review before submitting");
      return;
    }

    const formData = new FormData();
    formData.append("productId", productId);
    formData.append("rating", newReview.rating);
    formData.append("comment", newReview.comment);

    // Append each image file
    images.forEach((image) => {
      formData.append("images", image);
    });

    const res = await addProductReview(formData);

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Review added successfully");
      setNewReview({ rating: 5, comment: "" });
      setImagePreviews([]);
      setImages([]);

      // Appeler le callback si fourni
      if (onReviewAdded) {
        onReviewAdded();
      }
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + images.length > 4) {
      toast.error("You can only upload up to 4 images");
      return;
    }

    const newImages = [];
    const newPreviews = [];

    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        newImages.push(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          newPreviews.push(e.target.result);
          setImagePreviews([...imagePreviews, ...newPreviews]);
        };
        reader.readAsDataURL(file);
      }
    });

    setImages([...images, ...newImages]);
  };

  const removeImage = (index) => {
    const newPreviews = [...imagePreviews];
    const newImages = [...images];
    newPreviews.splice(index, 1);
    newImages.splice(index, 1);
    setImagePreviews(newPreviews);
    setImages(newImages);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white rounded-xl shadow-lg p-6 mb-8 w-full max-w-2xl border border-gray-100"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Star className="text-yellow-400" size={24} />
        Add Your Review
      </h2>

      {/* Rating Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Your Rating
        </label>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <motion.button
              key={star}
              type="button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setNewReview({ ...newReview, rating: star })}
              className="focus:outline-none transition-transform"
              disabled={isLoading} // Désactiver pendant le chargement
            >
              <svg
                className={`w-10 h-10 ${
                  star <= newReview.rating
                    ? "text-yellow-400 drop-shadow"
                    : "text-gray-300"
                } ${isLoading ? "opacity-50" : ""}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Comment Section */}
      <div className="mb-6 relative">
        <label
          htmlFor="comment"
          className="block text-sm font-medium text-gray-700 mb-3"
        >
          Your Review
        </label>
        <textarea
          id="comment"
          rows="2"
          className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-indigo-200 focus:ring-1 focus:ring-indigo-500 outline-none transition-all resize-none ${
            isLoading ? "opacity-50 bg-gray-100" : ""
          }`}
          value={newReview.comment}
          onChange={(e) =>
            setNewReview({ ...newReview, comment: e.target.value })
          }
          placeholder="Share your experience with this product..."
          disabled={isLoading} // Désactiver pendant le chargement
        ></textarea>
        <ImagePlus
          className={`absolute bottom-5 right-3 text-gray-500 ${
            isLoading
              ? "border-gray-200 text-gray-400 bg-gray-100 cursor-not-allowed"
              : "border-gray-300 text-gray-500 hover:text-gray-800"
          }`}
          size={20}
          onClick={() => !isLoading && fileInputRef.current.click()}
          disabled={isLoading}
        />
      </div>

      {/* Image Upload Section */}
      <div className="mb-6">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          multiple
          accept="image/*"
          className="hidden"
          disabled={isLoading} // Désactiver pendant le chargement
        />

        <AnimatePresence>
          {imagePreviews.length > 0 && (
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              {imagePreviews.map((preview, index) => (
                <motion.div
                  key={`preview-${preview}`}
                  className="relative rounded-lg overflow-hidden shadow-md group"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <img
                    src={preview}
                    alt={`Preview ${index}`}
                    className="w-full h-24 object-cover"
                  />
                  {!isLoading && ( // Cacher le bouton de suppression pendant le chargement
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </motion.button>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Submit Button */}
      <motion.button
        whileHover={{ scale: isLoading ? 1 : 1.02 }}
        whileTap={{ scale: isLoading ? 1 : 0.98 }}
        onClick={handleAddReview}
        className={`flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl font-medium transition-all ${
          isLoading
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg"
        }`}
      >
        {isLoading ? (
          <div className="flex items-center">
            <div className="w-4 h-4 border-t-2 border-white rounded-full animate-spin mr-2"></div>
            Submitting...
          </div>
        ) : (
          <>
            <Send size={18} />
            Submit Review
          </>
        )}
      </motion.button>
    </motion.div>
  );
};

export default AddReview;
