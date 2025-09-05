import { Info } from "lucide-react";
import { useProductStore } from "../../store/product.store";
import ClientNavbar from "../../components/ClientNavbar";
import ClientProductCard from "../../components/ClientProductCard";

const ProductPage = () => {
  const { activeProducts} = useProductStore();


  return (
    <>
      <ClientNavbar />
      <div className="container mx-15 px-4 py-8">
        {/* Produits actifs */}
        <div className="flex flex-col md:flex-row justify-between items-center pb-10 mt-7">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 ">
            Discover the variety of our products
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {activeProducts.map((product) => (
            <ClientProductCard key={product._id} product={product} />
          ))}
        </div>

        {activeProducts.length === 0 && (
          <div className="text-center py-12">
            <Info className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              No product available for the moment.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export default ProductPage;
