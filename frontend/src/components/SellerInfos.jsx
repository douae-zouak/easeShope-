import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCommentStore } from "../store/comment.store";

const SellerInfos = ({ seller }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { getSellerReviews, stats } = useCommentStore();

  useEffect(() => {
    getSellerReviews(seller._id);
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
    <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
      <h1 className="text-gray-900 text-2xl font-medium font-title">Seller</h1>
      <div className="flex items-center">
        {`${API_URL}${seller.profilePhoto}` && (
          <Link to={`/seller/${seller._id}`}>
            <img
              src={`${API_URL}${seller.profilePhoto}`}
              alt="Profile preview"
              className="w-15 h-15 rounded-full"
            />
          </Link>
        )}
        <div className="ml-3">
          <Link to={`/seller/${seller._id}`}>
            <p className="text-sm font-medium text-gray-900 capitalize">
              {seller.fullName}
            </p>
          </Link>
          <p className="text-sm text-gray-500 flex mt-1">
            {renderStars(stats?.averageRating)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SellerInfos;
