import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const CartFooter = ({ total }) => {
  return (
    <div className="flex flex-row justify-between items-center mr-7">
      <Link to="/home">
        <button className="flex items-center text-purple-600 hover:text-purple-700 transition-colors duration-200 font-medium cursor-pointer">
          <ArrowLeft
           className="h-5 w-5 mr-2" />
          Continue Shopping
        </button>
      </Link>

      <div className="flex items-center space-x-2">
        <span className="text-gray-600 font-medium">Total:</span>
        <span className="text-xl font-bold text-purple-600">{total} DH</span>
      </div>
    </div>
  );
};

export default CartFooter;
