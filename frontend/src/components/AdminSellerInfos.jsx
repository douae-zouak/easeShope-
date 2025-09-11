import { Mail, MapPin, Phone, Star, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCommentStore } from "../store/comment.store";
import { useEffect } from "react";

const AdminSellerInfos = ({ product }) => {
  const navigate = useNavigate();

  const { getSellerReviews, stats } = useCommentStore();

  useEffect(() => {
    getSellerReviews(product.seller);
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
    <div className="p-6 border border-gray-300 bg-gray-100 transition-all hover:border-black">
      <h3 className="text-lg font-medium uppercase tracking-wide mb-5">
        Seller Information
      </h3>
      <div className="flex flex-col sm:flex-row gap-5 mb-5">
        <div className="w-16 h-16 rounded-full border border-gray-300 overflow-hidden flex-shrink-0">
          {product.seller.profilePhoto ? (
            <img
              src={`${import.meta.env.VITE_API_URL}${
                product.seller.profilePhoto
              }`}
              alt={product.seller.fullName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-300 flex items-center justify-center">
              <User size={24} className="text-gray-500" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-black mb-1">
            {product.seller.fullName}
          </h4>
          <div className="flex items-center gap-1 mb-3">
            <p className="text-sm text-gray-500 flex mt-1">
              {renderStars(stats?.averageRating)}
            </p>
            <span className="text-xs text-gray-600 ml-1">
              ({stats.totalReviews}{" "}
              {stats.totalReviews === 1 || stats.totalReviews === 0
                ? "review"
                : "reviews"}
              )
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail size={14} />
              <span>{product.seller.email}</span>
            </div>
            {product.seller.phone && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone size={14} />
                <span>{product.seller.phone}</span>
              </div>
            )}
            {product.seller.city && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin size={14} />
                <span>{product.seller.city}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <button
        className="w-full py-3 bg-black text-white font-medium uppercase tracking-wide text-sm hover:bg-gray-800 transition-colors"
        onClick={() => navigate(`/seller/${product.seller._id}`)}
      >
        View Seller Profile
      </button>
    </div>
  );
};

export default AdminSellerInfos;
