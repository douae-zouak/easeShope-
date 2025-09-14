import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const VendorFilters = ({ filters, setFilters }) => {
  const [searchTerm, setSearchTerm] = useState(filters.search || "");

  // Update search instantly on input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setFilters({ ...filters, search: e.target.value });
  };

  const handleStatusChange = (e) => {
    setFilters({ ...filters, status: e.target.value });
  };

  const handleSortByChange = (e) => {
    setFilters({ ...filters, sortBy: e.target.value });
  };

  const handleSortOrderChange = (e) => {
    setFilters({ ...filters, sortOrder: e.target.value });
  };

  const handleReset = () => {
    setSearchTerm("");
    setFilters({
      search: "",
      status: "active",
      sortBy: "createdAt",
      sortOrder: "desc",
    });
  };

  return (
    <motion.div
      className="bg-white rounded-none shadow-sm p-5 mb-6 border border-gray-100"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
        {/* Simple Search Input */}
        <div className="flex-1 relative">
          <motion.div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </motion.div>
          <motion.input
            type="text"
            placeholder="Search vendors by name or email..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-none focus:ring-1 focus:ring-black focus:border-black"
          />
        </div>

        {/* Status Filter */}
        <motion.select
          value={filters.status}
          onChange={handleStatusChange}
          className="px-4 py-2 border border-gray-300 rounded-none focus:ring-1 focus:ring-black focus:border-black"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="all">All</option>
        </motion.select>

        {/* Sort By */}
        <motion.select
          value={filters.sortBy}
          onChange={handleSortByChange}
          className="px-4 py-2 border border-gray-300 rounded-none focus:ring-1 focus:ring-black focus:border-black"
        >
          <option value="createdAt">Join Date</option>
          <option value="totalSales">Total Sales</option>
          <option value="totalProducts">Total Products</option>
          <option value="lastActivity">Last Activity</option>
        </motion.select>

        {/* Sort Order */}
        <motion.select
          value={filters.sortOrder}
          onChange={handleSortOrderChange}
          className="px-4 py-2 border border-gray-300 rounded-none focus:ring-1 focus:ring-black focus:border-black"
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </motion.select>

        {/* Reset Button */}
        <motion.button
          onClick={handleReset}
          className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-none hover:bg-gray-50"
          whileHover={{ backgroundColor: "#000", color: "#fff" }}
          whileTap={{ scale: 0.95 }}
        >
          Reset
        </motion.button>
      </div>
    </motion.div>
  );
};

export default VendorFilters;
