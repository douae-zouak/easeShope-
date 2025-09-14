import { Info } from "lucide-react";
import { useProductStore } from "../../store/product.store";
import ClientProductCard from "../../components/ClientProductCard";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import ProductDetailsNav from "../../components/ProductDetailsNav";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const SpecificProducts = () => {
  const { gender, category } = useParams();

  const { getSpecificProducts, specificProducts, isLoading } =
    useProductStore();

  useEffect(() => {
    getSpecificProducts(gender, category);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <ProductDetailsNav />

      <div className="container mx-auto px-4 py-8">
        {/* Titre */}

        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, margin: "-50px" }}
          className="text-3xl md:text-4xl font-light text-gray-900 tracking-tight mb-4 md:mb-0 pb-6"
        >
          <span className="font-medium">Discover our products for</span>{" "}
          {category}
        </motion.h2>

        {!isLoading && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {specificProducts?.map((product) => (
                <ClientProductCard key={product._id} product={product} />
              ))}
            </div>

            {console.log("sp : ", specificProducts)}

            {/* Si aucun produit */}
            {specificProducts?.length === 0 ||
              (!specificProducts && (
                <div className="text-center py-12">
                  <Info className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">
                    No products available in{" "}
                    <span className="font-medium">{category}</span>.
                  </p>
                </div>
              ))}
          </>
        )}
      </div>
    </>
  );
};

export default SpecificProducts;
