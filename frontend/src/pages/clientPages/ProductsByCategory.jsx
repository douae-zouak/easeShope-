import { Info } from "lucide-react";
import { useProductStore } from "../../store/product.store";
import ClientProductCard from "../../components/ClientProductCard";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import ProductDetailsNavbar from "../../components/ProductDetailsNavbar";

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
  const [search, setSearch] = useState("");

  const { category } = useParams();
  const decodedCategory = category ? decodeURIComponent(category) : "";

  const { getAllProducts, products, isLoading } = useProductStore();

  // Filtrer les produits selon le type de catégorie
  const filteredProducts = useMemo(() => {
    let result = products;

    // 1. Filtre catégorie
    if (decodedCategory) {
      const categoryConfig = CATEGORY_MAPPING[decodedCategory];

      if (categoryConfig) {
        result = result.filter((product) => {
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
      } else {
        // Pour les autres catégories (Electronics, Home & Kitchen, etc.)
        result = result.filter(
          (product) => product.category === decodedCategory
        );
      }
    }

    // 2. Filtre recherche
    if (search) {
      result = result.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    return result;
  }, [products, decodedCategory, search]);

  useEffect(() => {
    getAllProducts();
  }, [getAllProducts]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <ProductDetailsNavbar search={search} setSearch={setSearch} />
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
      </div>
    </>
  );
};

export default ProductsByCategory;
