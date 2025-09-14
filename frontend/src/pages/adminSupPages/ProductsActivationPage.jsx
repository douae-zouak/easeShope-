import { useState, useEffect, useMemo } from "react";
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
import AdminNavbar from "../../components/AdminNavbar";

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

  // Filter states
  const [filters, setFilters] = useState({
    category: "all",
    gender: "all",
    search: "",
  });

  // State pour gérer le délai de recherche
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getPendingProducts(currentPage, 10, {
      category: filters.category !== "all" ? filters.category : undefined,
      gender: filters.gender !== "all" ? filters.gender : undefined,
      search: filters.search,
    });
  }, [currentPage, filters.category, filters.gender, filters.search]);

  // Délai pour la recherche pour éviter les appels API à chaque frappe
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchTerm }));
    }, 1000); // 500ms de délai

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleApprove = async (productId) => {
    try {
      await approveProduct(productId);
      toast.success("Product approved successfully");
      // Recharger les données après approbation
      getPendingProducts(currentPage, 10, {
        category: filters.category !== "all" ? filters.category : undefined,
        gender: filters.gender !== "all" ? filters.gender : undefined,
        search: filters.search,
      });
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
      // Recharger les données après rejet
      getPendingProducts(currentPage, 10, {
        category: filters.category !== "all" ? filters.category : undefined,
        gender: filters.gender !== "all" ? filters.gender : undefined,
        search: filters.search,
      });
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleCategoryFilterChange = (category) => {
    setFilters((prev) => ({ ...prev, category }));
    setCurrentPage(1);
  };

  const handleGenderFilterChange = (gender) => {
    setFilters((prev) => ({ ...prev, gender }));
    setCurrentPage(1);
  };

  const handleSearchInputChange = (searchValue) => {
    setSearchTerm(searchValue);
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
    getPendingProducts(currentPage, 10, {
      category: filters.category !== "all" ? filters.category : undefined,
      gender: filters.gender !== "all" ? filters.gender : undefined,
      search: filters.search,
    });
    toast.success("Data refreshed");
  };

  // Utiliser useMemo pour optimiser le filtrage côté client
  const filteredProducts = useMemo(() => {
    return pendingProducts.filter((product) => {
      const matchesSearch =
        filters.search === "" ||
        product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        (product.seller?.fullName &&
          product.seller.fullName
            .toLowerCase()
            .includes(filters.search.toLowerCase()));

      const matchesCategory =
        filters.category === "all" || product.category === filters.category;
      const matchesGender =
        filters.gender === "all" || product.gender === filters.gender;

      return matchesSearch && matchesCategory && matchesGender;
    });
  }, [pendingProducts, filters.search, filters.category, filters.gender]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-60vh gap-5">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        <p className="text-gray-600">Loading pending products...</p>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans text-gray-900 bg-white min-h-screen">
      <header className="fixed top-0 right-0 z-10 bg-white w-full">
        <AdminNavbar />
      </header>
      <div className="animate-fadeIn">
        <div className="mb-10 pb-6 border-b border-gray-200">
          <h1 className="text-3xl font-light uppercase tracking-wide text-gray-900 mb-2">
            Pending Products Validation
          </h1>
          <p className="text-gray-600">
            Manage new products submitted by vendors
          </p>
        </div>

        {/* Filter and search controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search products or vendors..."
              value={searchTerm}
              onChange={(e) => handleSearchInputChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 bg-gray-50 text-sm transition-colors focus:border-gray-900 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <select
              value={filters.category}
              onChange={(e) => handleCategoryFilterChange(e.target.value)}
              className="px-3 py-2 border border-gray-200 bg-gray-50 text-sm cursor-pointer transition-colors focus:border-gray-900 focus:bg-white focus:outline-none min-w-40"
            >
              <option value="all">All Categories</option>
              <option value="Mobile Phones">Mobile Phones</option>
              <option value="Laptops">Laptops</option>
              <option value="Tablets">Tablets</option>
              <option value="Cameras">Cameras</option>
              <option value="Accessories">Accessories</option>
              <option value="T-Shirts">T-Shirts</option>
              <option value="Shirts">Shirts</option>
              <option value="Jeans">Jeans</option>
              <option value="Dresses">Dresses</option>
              <option value="Jackets">Jackets</option>
              <option value="Sweaters">Sweaters</option>
              <option value="Shoes">Shoes</option>
              <option value="Cookware">Cookware</option>
              <option value="Bedding">Bedding</option>
              <option value="Decor">Decor</option>
              <option value="Storage">Storage</option>
              <option value="Lighting">Lighting</option>
              <option value="Skincare">Skincare</option>
              <option value="Makeup">Makeup</option>
              <option value="Hair Care">Hair Care</option>
              <option value="Fitness Equipment">Fitness Equipment</option>
              <option value="Athletic Shoes">Athletic Shoes</option>
              <option value="Apparel">Apparel</option>
              <option value="Outdoor Gear">Outdoor Gear</option>
              <option value="Sports Accessories">Sports Accessories</option>
              <option value="Fiction">Fiction</option>
              <option value="Non-Fiction">Non-Fiction</option>
              <option value="Comics">Comics</option>
              <option value="Educational">Educational</option>
              <option value="Children's Books">Children's Books</option>
              <option value="Clothing">Clothing</option>
              <option value="Toys">Toys</option>
              <option value="School Supplies">School Supplies</option>
              <option value="Footwear">Footwear</option>
            </select>

            <select
              value={filters.gender}
              onChange={(e) => handleGenderFilterChange(e.target.value)}
              className="px-3 py-2 border border-gray-200 bg-gray-50 text-sm cursor-pointer transition-colors focus:border-gray-900 focus:bg-white focus:outline-none min-w-32"
            >
              <option value="all">All Genders</option>
              <option value="Men">Men</option>
              <option value="Woman">Women</option>
              <option value="Unisex">Unisex</option>
            </select>

            <button
              onClick={refreshData}
              className="flex items-center gap-2 px-4 py-2 bg-transparent border border-gray-200 text-gray-900 text-sm hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 px-4 bg-gray-50 border border-gray-200">
            <Filter className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-xl font-normal text-gray-600 mb-2">
              No pending products
            </h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
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
                  setSearchTerm("");
                }}
                className="px-4 py-2 bg-transparent border border-gray-200 text-gray-900 text-sm hover:bg-gray-50 transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="border border-gray-200 mb-8 bg-white">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="p-4 text-left text-xs font-medium uppercase tracking-wider text-gray-600 bg-gray-50 border-b border-gray-200">
                      Product
                    </th>
                    <th className="p-4 text-left text-xs font-medium uppercase tracking-wider text-gray-600 bg-gray-50 border-b border-gray-200">
                      Vendor
                    </th>
                    <th className="p-4 text-left text-xs font-medium uppercase tracking-wider text-gray-600 bg-gray-50 border-b border-gray-200">
                      Price
                    </th>
                    <th className="p-4 text-left text-xs font-medium uppercase tracking-wider text-gray-600 bg-gray-50 border-b border-gray-200">
                      Date Submitted
                    </th>
                    <th className="p-4 text-left text-xs font-medium uppercase tracking-wider text-gray-600 bg-gray-50 border-b border-gray-200">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product, index) => (
                    <tr
                      key={product._id}
                      className="hover:bg-gray-50 animate-fadeIn"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <td className="p-4 border-b border-gray-200">
                        <div className="flex gap-4">
                          <div className="w-20 h-20 bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                            {product.imagesVariant?.[0]?.images?.[0] ? (
                              <Link
                                to={`/admin/product-details/${product._id}`}
                              >
                                <img
                                  src={product.imagesVariant[0].images[0]}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              </Link>
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <span className="text-xs text-gray-500">
                                  No image
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col justify-center">
                            <div className="font-medium text-gray-900 mb-1">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-600 capitalize">
                              {product.category}
                            </div>
                            <div className="text-sm text-gray-600 capitalize">
                              {product.gender}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 border-b border-gray-200">
                        <div className="flex flex-col">
                          <div className="font-medium text-gray-900 mb-1">
                            {product.seller?.fullName}
                          </div>
                          <div className="text-sm text-gray-600">
                            {product.seller?.email}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 border-b border-gray-200">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">
                            {product.originalPrice} DH
                          </span>
                          {product.discount > 0 && (
                            <>
                              <span className="font-medium text-gray-900">
                                {product.price} DH
                              </span>
                              <span className="font-medium text-gray-400 line-through">
                                {product.originalPrice} DH
                              </span>
                              <span className="text-xs text-red-500 font-medium">
                                -{product.discount}%
                              </span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="p-4 border-b border-gray-200 text-sm text-gray-600">
                        {formatDate(product.createdAt)}
                      </td>
                      <td className="p-4 border-b border-gray-200 relative">
                        <div className="flex gap-2">
                          <Link
                            to={`/admin/product-details/${product._id}`}
                            className="w-9 h-9 flex items-center justify-center border border-gray-200 hover:border-blue-600 hover:text-blue-600  transition-colors"
                            title="View details"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleApprove(product._id)}
                            className="w-9 h-9 flex items-center justify-center border border-gray-200 hover:border-green-600 hover:text-green-600 transition-colors"
                            title="Approve product"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() =>
                              setRejectingProduct(
                                rejectingProduct === product._id
                                  ? null
                                  : product._id
                              )
                            }
                            className="w-9 h-9 flex items-center justify-center border border-gray-200 hover:border-red-600 hover:text-red-600 transition-colors"
                            title="Reject product"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </div>

                        {rejectingProduct === product._id && (
                          <div className="absolute top-full right-0 mt-2 w-72 p-4 bg-white border border-gray-200 shadow-lg z-10 animate-fadeIn">
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
                              className="w-full p-2 border border-gray-200 text-sm focus:border-gray-900 focus:outline-none"
                            />
                            <div className="flex gap-2 justify-end mt-3">
                              <button
                                onClick={() => setRejectingProduct(null)}
                                className="px-3 py-1 text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleReject(product._id)}
                                className="px-3 py-1 text-sm bg-red-600 text-white hover:bg-red-700 transition-colors"
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
              <div className="flex justify-center items-center gap-5 mt-8">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-900 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>

                <div className="text-sm text-gray-600">
                  Page {currentPage} of {pendingPagination.pages}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pendingPagination.pages}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-900 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
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
