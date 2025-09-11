import { useEffect } from "react";
import { useProductStore } from "../store/product.store";
import { Info } from "lucide-react";
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Produits en promotion */}
      {discountedProducts.length > 0 && (
        <div className="mb-16">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true, margin: "-50px" }}
              className="text-3xl md:text-4xl font-light text-gray-900 tracking-tight mb-4 md:mb-0"
            >
              <span className="font-medium">Special Offers</span> & Promotions
            </motion.h2>
            <Link to="/discount-product">
              <motion.button
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="text-gray-600 hover:text-gray-900 text-sm font-normal flex items-center transition-colors cursor-pointer pb-1"
              >
                View all promotions
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </motion.button>
            </Link>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, staggerChildren: 0.1 }}
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {discountedProducts.map((product) => (
              <ClientProductCard key={product._id} product={product} />
            ))}
          </motion.div>
        </div>
      )}

      {/* Produits actifs */}
      <div className="mb-16">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true, margin: "-50px" }}
            className="text-3xl md:text-4xl font-light text-gray-900 tracking-tight mb-4 md:mb-0"
          >
            <span className="font-medium">Featured</span> Collection
          </motion.h2>
          <Link to="/products">
            <motion.button
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="text-gray-600 hover:text-gray-900 text-sm font-normal flex items-center transition-colors cursor-pointer pb-1"
            >
              Browse all products
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </motion.button>
          </Link>
        </div>

        {activeProducts.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, staggerChildren: 0.1 }}
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {activeProducts.map((product) => (
              <ClientProductCard key={product._id} product={product} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center py-16"
          >
            <Info className="h-16 w-16 text-gray-300 mx-auto mb-5" />
            <p className="text-gray-400 text-lg font-light">
              No products available at the moment.
            </p>
          </motion.div>
        )}
      </div>

      {/* Message si aucun produit n'est disponible */}
      {activeProducts.length === 0 && discountedProducts.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center py-20"
        >
          <Info className="h-20 w-20 text-gray-300 mx-auto mb-6" />
          <p className="text-gray-400 text-xl font-light mb-2">
            Our collection is currently being updated
          </p>
          <p className="text-gray-400 text-lg font-light">
            Check back soon for new arrivals
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default ProductDisplay;
