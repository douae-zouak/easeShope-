import { useState } from "react";
import { Archive, Filter, Plus, ChevronDown } from "lucide-react";

const ProductHeader = ({
  onAddProduct,
  onCategoryFilterChange,
  onStatusFilterChange,
  category,
  status,
  products,
}) => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  const CATEGORIES = [
    "All Categories",
    "Electronics",
    "Clothing",
    "Shoes",
    "Accessories",
    "Home & Kitchen",
    "Beauty",
    "Sports",
    "Books",
    "Girls",
    "Boys",
    "Toys",
    "Babies",
  ];

  const STATUS = [
    "All Status",
    "draft",
    "pending",
    "active",
    "out_of_stock",
    "rejected",
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm ">
      {/* Header with title and button */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Archive size={24} className="text-indigo-600" />
          <h1 className="text-2xl font-semibold text-gray-900">
            Your Products
          </h1>
          <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-lg text-center">
            {products.length} products
          </span>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Category Filter */}
            <div className="relative">
              <button
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="flex items-center gap-2 px-4 py-2.5 border border-gray-200  bg-white text-gray-800 hover:bg-gray-50 transition-all duration-200 w-full sm:w-48 justify-between"
              >
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-indigo-500" />
                  <span>{category || "All Categories"}</span>
                </div>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    isCategoryOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isCategoryOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200  shadow-lg z-10 max-h-60 overflow-y-auto">
                  {CATEGORIES.map((cat) => (
                    <div
                      key={cat}
                      onClick={() => {
                        onCategoryFilterChange(
                          cat === "All Categories" ? null : cat
                        );
                        setIsCategoryOpen(false);
                      }}
                      className={`px-4 py-2.5 hover:bg-indigo-50 cursor-pointer transition-colors ${
                        category === cat ||
                        (!category && cat === "All Categories")
                          ? "bg-indigo-50 text-indigo-700"
                          : ""
                      }`}
                    >
                      {cat}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Status Filter */}
            <div className="relative text-center">
              <button
                onClick={() => setIsStatusOpen(!isStatusOpen)}
                className="flex items-center gap-2 px-4 py-2.5 border border-gray-200  bg-white text-gray-800 hover:bg-gray-50 transition-all duration-200 w-full sm:w-44 justify-between"
              >
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-indigo-500" />
                  <span>{status || "All Status"}</span>
                </div>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    isStatusOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isStatusOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200  shadow-lg z-10">
                  {STATUS.map((st) => (
                    <div
                      key={st}
                      onClick={() => {
                        onStatusFilterChange(st === "All Status" ? null : st);
                        setIsStatusOpen(false);
                      }}
                      className={`px-4 py-2.5 hover:bg-indigo-50 cursor-pointer transition-colors ${
                        status === st || (!status && st === "All Status")
                          ? "bg-indigo-50 text-indigo-700"
                          : ""
                      }`}
                    >
                      {st}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          type="button"
          className="flex items-center justify-center gap-2 px-5 py-3 text-md font-medium bg-indigo-500 text-white hover:bg-indigo-600 rounded-xl transition-all duration-200 cursor-pointer w-full lg:w-auto shadow-sm hover:shadow-md"
          onClick={onAddProduct}
        >
          <Plus size={18} />
          <span>Add New Product</span>
        </button>
      </div>
    </div>
  );
};

export default ProductHeader;
