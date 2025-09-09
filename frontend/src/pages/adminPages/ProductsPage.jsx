import { useNavigate } from "react-router-dom";
import ProductHeader from "../../components/ProductHeader";
import ProductCard from "../../components/ProductCard";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import { useProductStore } from "../../store/product.store";
import { useEffect } from "react";
import { useState } from "react";

const ProductsPage = () => {
  const navigate = useNavigate();

  const { getProducts, products, pagination, deleteProduct, isLoading } =
    useProductStore();

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

  // Charger les produits avec les filtres
  const loadProducts = async (newFilters = {}) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    console.log("updated filter : ", updatedFilters);
    await getProducts(updatedFilters);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleAddProduct = () => {
    navigate("/vendor/add-product");
  };

  const handleCategoryFilterChange = (category) => {
    loadProducts({ category, page: 1 }); // Reset à la page 1 quand on change de filtre
  };

  const handleStatusFilterChange = (status) => {
    loadProducts({ status, page: 1 }); // Reset à la page 1 quand on change de filtre
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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 rounded-xl shadow-md mb-12 mt-5">
      <div className="flex justify-between items-center mb-6 mx-auto p-6 mt-6">
        <ProductHeader
          onAddProduct={handleAddProduct}
          onCategoryFilterChange={handleCategoryFilterChange}
          onStatusFilterChange={handleStatusFilterChange}
          category={filters.category || "all"}
          status={filters.status || "all"}
        />
      </div>

      {/* Your product list/content goes here */}

      <div className="p-6 bg-white rounded-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onEdit={() => handleEdit(product._id)}
                onDelete={() => handleDelete(product)}
              />
            ))
          ) : (
            <p className="text-gray-500">No products available</p>
          )}
        </div>
        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center gap-2">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
              (page) => (
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
              )
            )}
          </div>
        )}
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
