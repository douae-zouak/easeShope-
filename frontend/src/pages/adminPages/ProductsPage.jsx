import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductHeader from "../../components/ProductHeader";
import ProductCard from "../../components/ProductCard";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import { useProductStore } from "../../store/product.store";
import Navbar from "../../components/Navbar";

const ProductsPage = () => {
  const navigate = useNavigate();
  const {
    getProducts,
    products,
    searchResults,
    pagination,
    deleteProduct,
    isLoading,
  } = useProductStore();

  // États pour les filtres et la pagination
  const [filters, setFilters] = useState({
    category: "",
    status: "",
    page: 1,
  });

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    product: null,
  });

  const [searchTerm, setSearchTerm] = useState("");

  // Charger les produits avec les filtres
  const loadProducts = async (newFilters = {}) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    await getProducts(updatedFilters);
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    loadProducts();
  }, []);

  const handleAddProduct = () => {
    navigate("/vendor/add-product");
  };

  const handleCategoryFilterChange = (category) => {
    loadProducts({ category, page: 1 });
  };

  const handleStatusFilterChange = (status) => {
    loadProducts({ status, page: 1 });
  };

  const handlePageChange = (newPage) => {
    loadProducts({ page: newPage });
  };

  const handleEdit = (id) => {
    navigate(`/vendor/edit-product/${id}`);
  };

  const handleDelete = async (product) => {
    setDeleteModal({ isOpen: true, product });
  };

  const handleDeleteConfirm = async () => {
    if (deleteModal.product) {
      try {
        await deleteProduct(deleteModal.product.id);
        await loadProducts();
        setDeleteModal({ isOpen: false, product: null });
      } catch (error) {
        console.error("Error occured while deletting product: ", error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="fixed top-0 left-0 right-0 h-16 z-10">
        <Navbar onSearch={setSearchTerm} />
      </header>
      <div className="pt-20 px-6">
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <ProductHeader
            onAddProduct={handleAddProduct}
            onCategoryFilterChange={handleCategoryFilterChange}
            onStatusFilterChange={handleStatusFilterChange}
            category={filters.category || "All categories"}
            status={filters.status || "All status"}
            products={filteredProducts}
          />
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onEdit={() => handleEdit(product._id)}
                  onDelete={() => handleDelete(product)}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-gray-500 text-lg">No products available</p>
                <button
                  onClick={handleAddProduct}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Add Your First Product
                </button>
              </div>
            )}
          </div>

          {/* Afficher la pagination seulement si on n'est pas en mode recherche */}
          {searchResults.length === 0 &&
            pagination &&
            pagination.totalPages > 1 && (
              <div className="mt-8 flex justify-center items-center gap-2">
                {Array.from(
                  { length: pagination.totalPages },
                  (_, i) => i + 1
                ).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded ${
                      page === pagination.currentPage
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, product: null })}
        onConfirm={handleDeleteConfirm}
        productName={deleteModal.product?.name || ""}
      />
    </div>
  );
};

export default ProductsPage;
