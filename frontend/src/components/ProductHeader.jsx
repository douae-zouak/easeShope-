import { Archive, Filter, Plus } from "lucide-react";

const ProductHeader = ({
  onAddProduct,
  onCategoryFilterChange,
  onStatusFilterChange,
  category,
  status,
}) => {

  const CATEGORIES = [
    "All",
    "Mobile Phones",
    "Laptops",
    "Tablets",
    "Cameras",
    "T-Shirts",
    "Shirts",
    "Jeans",
    "Dresses",
    "Jackets",
    "Sweaters",
    "Shoes",
    "Cookware",
    "Bedding",
    "Decor",
    "Storage",
    "Lighting",
    "Skincare",
    "Makeup",
    "Hair Care",
    "Accessories",
    "Fitness Equipment",
    "Athletic Shoes",
    "Apparel",
    "Outdoor Gear",
    "Sports Accessories",
    "Fiction",
    "Non-Fiction",
    "Comics",
    "Educational",
    "Children's Books",
    "Clothing",
    "Toys",
    "School Supplies",
    "Footwear",
  ];

  const STATUS = ["All", "draft", "pending", "active", "out_of_stock", "rejected"];

  return (
    <>
      <h1 className="text-xl font-medium flex items-center gap-2 ">
        <Archive size={20} />
        <span>Your Products</span>
      </h1>

      {/* Left Side - Filters */}
      <div className="flex items-center gap-6">
        {/* Category Filter */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
            <Filter className="w-4 h-4 text-purple-600" />
            Category
          </label>
          <select
            value={category || "All"}
            onChange={(e) =>
              onCategoryFilterChange(
                e.target.value === "All" ? null : e.target.value
              )
            }
            className="w-44 px-4 py-2 border border-gray-300 rounded-xl bg-white text-gray-800 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-300 transition-all duration-200"
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
            <Filter className="w-4 h-4 text-purple-600" />
            Status
          </label>
          <select
            value={status || "All"}
            onChange={(e) =>
              onStatusFilterChange(
                e.target.value === "All" ? null : e.target.value
              )
            }
            className="w-44 px-4 py-2 border border-gray-300 rounded-xl bg-white text-gray-800 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-300 transition-all duration-200"
          >
            {STATUS.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Add Button */}
      <button
        type="button"
        className="flex items-center gap-2 px-5 py-2.5 text-md font-medium bg-[#7D6BFB] text-white hover:bg-[#6a59d6] rounded-xl shadow-md transition-all duration-200 cursor-pointer"
        onClick={onAddProduct}
      >
        <Plus size={18} />
        <span>Add New Product</span>
      </button>
    </>
  );
};

export default ProductHeader;
