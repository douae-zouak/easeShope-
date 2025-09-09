import { useState, useEffect } from "react";
import { useProductStore } from "../../store/product.store";
import {
  Eye,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import "./PendingproductsPage.css";

const ProductsActivationPage = () => {
  const {
    pendingProducts,
    pendingPagination,
    isLoading,
    getPendingProducts,
    approveProduct,
    rejectProduct,
  } = useProductStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [rejectionReasons, setRejectionReasons] = useState({});
  const [rejectingProduct, setRejectingProduct] = useState(null);
  console.log(pendingProducts);
  // Filter states
  const [filters, setFilters] = useState({
    category: "all",
    gender: "all",
    search: "",
  });

  useEffect(() => {
    getPendingProducts(currentPage, 10, filters);
  }, [currentPage, filters]);

  const handleApprove = async (productId) => {
    try {
      await approveProduct(productId);
      toast.success("Product approved successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleReject = async (productId) => {
    if (
      !rejectionReasons[productId] ||
      rejectionReasons[productId].trim() === ""
    ) {
      toast.error("Please provide a rejection reason");
      return;
    }

    try {
      await rejectProduct(productId, rejectionReasons[productId]);
      setRejectionReasons((prev) => ({ ...prev, [productId]: "" }));
      setRejectingProduct(null);
      toast.success("Product rejected successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleCategoryFilterChange = (category) => {
    setFilters({ ...filters, category, page: 1 });
    setCurrentPage(1);
  };

  const handleGenderFilterChange = (gender) => {
    setFilters({ ...filters, gender, page: 1 });
    setCurrentPage(1);
  };

  const handleSearchChange = (searchTerm) => {
    setFilters({ ...filters, search: searchTerm, page: 1 });
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const refreshData = () => {
    getPendingProducts(currentPage, 10, filters);
    toast.success("Data refreshed");
  };

  // Filter products based on search term, category and gender
  const filteredProducts = pendingProducts
    .filter(
      (product) =>
        product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.seller?.fullName
          .toLowerCase()
          .includes(filters.search.toLowerCase())
    )
    .filter(
      (product) =>
        filters.category === "all" || product.category === filters.category
    )
    .filter(
      (product) => filters.gender === "all" || product.gender === filters.gender
    );

  if (isLoading) {
    return (
      <div className="admin-loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading pending products...</p>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-content">
        <div className="admin-header">
          <h1 className="admin-title">Pending Products Validation</h1>
          <p className="admin-subtitle">
            Manage new products submitted by vendors
          </p>
        </div>

        {/* Filter and search controls */}
        <div className="admin-controls">
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search products or vendors..."
              value={filters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>

          <div className="filter-controls">
            <select
              value={filters.category}
              onChange={(e) => handleCategoryFilterChange(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Categories</option>
              <option value="T-Shirts">T-Shirts</option>
              <option value="Shirts">Shirts</option>
              <option value="Jeans">Jeans</option>
              <option value="Dresses">Dresses</option>
              <option value="Jackets">Jackets</option>
              <option value="Shoes">Shoes</option>
              <option value="Accessories">Accessories</option>
            </select>

            <select
              value={filters.gender}
              onChange={(e) => handleGenderFilterChange(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Genders</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="unisex">Unisex</option>
            </select>

            <button onClick={refreshData} className="refresh-btn">
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="empty-state">
            <Filter size={48} className="empty-icon" />
            <h3>No pending products</h3>
            <p>
              {filters.search ||
              filters.category !== "all" ||
              filters.gender !== "all"
                ? "No results match your filters."
                : "All products have been processed. Great job!"}
            </p>
            {(filters.search ||
              filters.category !== "all" ||
              filters.gender !== "all") && (
              <button
                onClick={() => {
                  setFilters({
                    category: "all",
                    gender: "all",
                    search: "",
                  });
                }}
                className="clear-filters-btn"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="products-table-container">
              <div className="table-header">
                <span className="results-count">
                  Showing {filteredProducts.length} of {pendingProducts.length}{" "}
                  products
                </span>
              </div>

              <table className="products-table">
                <thead>
                  <tr>
                    <th className="product-cell">Product</th>
                    <th className="seller-cell">Vendor</th>
                    <th className="price-cell">Price</th>
                    <th className="date-cell">Date Submitted</th>
                    <th className="status-cell">Status</th>
                    <th className="actions-cell">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product, index) => (
                    <tr
                      key={product._id}
                      className="product-row"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <td className="product-cell">
                        <div className="product-info">
                          <div className="product-image">
                            {product.imagesVariant?.[0]?.images?.[0] ? (
                              <img
                                src={product.imagesVariant[0].images[0]}
                                alt={product.name}
                              />
                            ) : (
                              <div className="image-placeholder">
                                <span>No image</span>
                              </div>
                            )}
                          </div>
                          <div className="product-details">
                            <div className="product-name">{product.name}</div>
                            <div className="product-category">
                              {product.category}
                            </div>
                            <div className="product-gender">
                              {product.gender}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="seller-cell">
                        <div className="seller-info">
                          <div className="seller-name">
                            {product.seller?.fullName}
                          </div>
                          <div className="seller-email">
                            {product.seller?.email}
                          </div>
                        </div>
                      </td>
                      <td className="price-cell">
                        <div className="price-info">
                          <span className="price-amount">
                            {product.originalPrice} DH
                          </span>
                          {product.discount > 0 && (
                            <span className="discount-badge">
                              -{product.discount}%
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="date-cell">
                        {formatDate(product.createdAt)}
                      </td>
                      <td className="status-cell">
                        <span className="status-badge pending">Pending</span>
                      </td>
                      <td className="actions-cell">
                        <div className="action-buttons">
                          <Link
                            to={`/admin/product-details/${product._id}`}
                            className="action-btn view-btn"
                            title="View details"
                          >
                            <Eye size={16} />
                          </Link>
                          <button
                            onClick={() => handleApprove(product._id)}
                            className="action-btn approve-btn"
                            title="Approve product"
                          >
                            <CheckCircle size={16} />
                          </button>
                          <button
                            onClick={() =>
                              setRejectingProduct(
                                rejectingProduct === product._id
                                  ? null
                                  : product._id
                              )
                            }
                            className="action-btn reject-btn"
                            title="Reject product"
                          >
                            <XCircle size={16} />
                          </button>
                        </div>

                        {rejectingProduct === product._id && (
                          <div className="rejection-panel">
                            <textarea
                              placeholder="Explain the reason for rejection..."
                              value={rejectionReasons[product._id] || ""}
                              onChange={(e) =>
                                setRejectionReasons({
                                  ...rejectionReasons,
                                  [product._id]: e.target.value,
                                })
                              }
                              rows="3"
                            />
                            <div className="rejection-actions">
                              <button
                                onClick={() => setRejectingProduct(null)}
                                className="cancel-btn"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleReject(product._id)}
                                className="confirm-reject-btn"
                              >
                                Confirm Rejection
                              </button>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pendingPagination && pendingPagination.pages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="pagination-btn prev-btn"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>

                <div className="pagination-info">
                  Page {currentPage} of {pendingPagination.pages}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pendingPagination.pages}
                  className="pagination-btn next-btn"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductsActivationPage;
