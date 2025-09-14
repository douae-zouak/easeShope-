import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ViewProductHeader = ({ product }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between mb-10 pb-5 border-b border-gray-200">
      <button
        onClick={() => navigate("/vendor/products")}
        className="flex items-center gap-2 px-4 py-2 bg-transparent border border-gray-300 rounded text-black hover:bg-gray-50 transition-all hover:-translate-x-1"
      >
        <ArrowLeft size={20} />
        Back to Products
      </button>
      <h1 className="text-2xl font-light uppercase tracking-wide">
        Product Review
      </h1>
      <div className="px-4 py-2 bg-amber-100 text-amber-800 rounded text-sm font-medium uppercase tracking-wide">
        {product?.status}
      </div>
    </div>
  );
};

export default ViewProductHeader;
