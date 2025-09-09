import { useEffect } from "react";
import { useProductStore } from "../store/product.store";
import { Info } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ClientProductCard from "./ClientProductCard";

const ProductDisplay = () => {
  const { getAllProducts, activeProducts, discountedProducts } =
    useProductStore();

  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Produits en promotion */}
      {discountedProducts.length > 0 && (
        <div className="mb-12">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-gray-900"
            >
              Promotion Products
            </motion.h2>
            <Link to="/discount-product">
              <button className="text-purple-600 text-md font-medium flex items-center hover:text-purple-700 transition-colors cursor-pointer">
                See More
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {discountedProducts.map((product) => (
              <ClientProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* Produits actifs */}
      <div className="mb-12">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gray-900"
          >
            You Might Like
          </motion.h2>
          <Link to="/products">
            <button className="text-purple-600 text-md font-medium flex items-center hover:text-purple-700 transition-colors cursor-pointer">
              See More
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </Link>
        </div>

        {activeProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {activeProducts.map((product) => (
              <ClientProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Info className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              No products available at the moment.
            </p>
          </div>
        )}
      </div>

      {/* Message si aucun produit n'est disponible */}
      {activeProducts.length === 0 && discountedProducts.length === 0 && (
        <div className="text-center py-12">
          <Info className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            No products available at the moment.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductDisplay;
