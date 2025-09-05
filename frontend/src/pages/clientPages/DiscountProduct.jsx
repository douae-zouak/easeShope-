import { useProductStore } from "../../store/product.store";
import { ShoppingCart } from "lucide-react";
import ClientNavbar from "../../components/ClientNavbar";

const DiscountProduct = () => {
  const { discountedProducts } = useProductStore();

  return (
    <>
      <ClientNavbar />
      <div className="container mx-15 px-4 py-8">
        {discountedProducts?.length > 0 && (
          <div className="mb-12">
            <div className="flex flex-col md:flex-row justify-between items-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 ">
                Promotion Products
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {discountedProducts.map((product) => (
                <DiscountedProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

const DiscountedProductCard = ({ product }) => {
  const lastImage =
    product.images && product.images.length > 0
      ? product.images[product.images.length - 1]
      : null;

  const { addToCart } = useProductStore();

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-purple-100">
      <div className="relative h-48 overflow-hidden">
        {lastImage ? (
          <img
            src={lastImage}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No Image</span>
          </div>
        )}

        <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold">
          -{product.discount}%
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {product.name}
        </h3>

        <div className="flex items-center justify-between mt-4">
          <div>
            <span className="text-lg font-bold text-red-600">
              {calculateDiscountPrice(product.price, product.discount)} DH
            </span>
            <span className="text-sm text-gray-500 line-through ml-2 block">
              {product.price} DH
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <ShoppingCart className="h-5 w-5 inline mr-1" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

const calculateDiscountPrice = (price, discount) => {
  return (price - (price * discount) / 100).toFixed(2);
};

export default DiscountProduct;
