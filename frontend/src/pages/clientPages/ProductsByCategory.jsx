import { Info } from "lucide-react";
import { useProductStore } from "../../store/product.store";
import ProductDetailsNav from "../../components/ProductDetailsNav";
import ClientProductCard from "../../components/ClientProductCard";
import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";

// Mapping des catégories d'affichage vers les catégories de produit
const CATEGORY_MAPPING = {
  Men: {
    type: "gender",
    value: "Men",
  },
  Women: {
    type: "gender",
    value: "Woman",
  },
  "Men's Footwear": {
    type: "category",
    value: "Shoes",
    gender: "Men",
  },
  "Women's Footwear": {
    type: "category",
    value: "Shoes",
    gender: "Woman",
  },
  Jewelry: {
    type: "category",
    value: "Accessories",
  },
  Kids: {
    type: "category",
    value: "Clothing",
  },
  Sports: {
    type: "category",
    value: "Apparel",
  },
};

const ProductsByCategory = () => {
  const { category } = useParams();
  const decodedCategory = category ? decodeURIComponent(category) : "";

  const { getAllProducts, products, isLoading } = useProductStore();

  // Filtrer les produits selon le type de catégorie
  const filteredProducts = useMemo(() => {
    if (!decodedCategory) return products;

    const categoryConfig = CATEGORY_MAPPING[decodedCategory];

    if (categoryConfig) {
      return products.filter((product) => {
        if (categoryConfig.type === "gender") {
          return product.gender === categoryConfig.value;
        } else if (categoryConfig.type === "category") {
          const categoryMatch = product.category === categoryConfig.value;
          const genderMatch = categoryConfig.gender
            ? product.gender === categoryConfig.gender
            : true;
          return categoryMatch && genderMatch;
        }
        return false;
      });
    }

    // Pour les autres catégories (Electronics, Home & Kitchen, etc.)
    return products.filter((product) => product.category === decodedCategory);
  }, [products, decodedCategory]);

  useEffect(() => {
    getAllProducts();
  }, [getAllProducts]);

  return (
    <>
      <ProductDetailsNav />
      <div className="container mx-auto px-4 py-8">
        {/* Titre */}
        <div className="flex flex-col md:flex-row justify-between items-center pb-10 mt-7">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            {decodedCategory
              ? `Discover our products for `
              : "Discover our products"}
            {decodedCategory && (
              <span className="text-purple-600"> {decodedCategory}</span>
            )}
          </h2>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Loading products...</p>
          </div>
        )}

        {/* Liste des produits */}
        {!isLoading && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ClientProductCard key={product._id} product={product} />
              ))}
            </div>

            {/* Si aucun produit */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <Info className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  No products available in{" "}
                  <span className="font-medium">{decodedCategory}</span>.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default ProductsByCategory;
