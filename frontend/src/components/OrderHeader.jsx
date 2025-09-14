// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { ChevronDown, Filter, Search } from "lucide-react";

const OrderHeader = ({
  searchQuery,
  setSearchQuery,
  filterStatus,
  setFilterStatus,
  sortBy,
  setSortBy
}) => {
  return (
    <>
      <motion.h1
        className="text-3xl font-bold text-gray-900 mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Order Tracking
      </motion.h1>

      {/* Filters and search */}
      <motion.div
        className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-200"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search for an order or a product..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-white placeholder-gray-400 focus:outline-none focus:border-indigo-200 focus:ring-1 focus:ring-indigo-500 transition"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <select
                className="appearance-none  w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg shadow-sm leading-tight focus:outline-none focus:border-indigo-200 focus:ring-1 focus:ring-indigo-500 transition"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All statuses</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="packing">Packing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <Filter size={16} />
              </div>
            </div>

            <div className="relative">
              <select
                className="appearance-none  w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg shadow-sm focus:outline-none focus:border-indigo-200 focus:ring-1 focus:ring-indigo-500 transition"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="total-high">Total (high to low)</option>
                <option value="total-low">Total (low to high)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default OrderHeader;
