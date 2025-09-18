import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Package, MoveLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";

import { useOrderStore } from "../../store/order.store";
import OrderHeader from "../../components/OrderHeader";
import ClientOrders from "../../components/ClientOrders";
import ProductDetailsNav from "../../components/ProductDetailsNav";

const Orders = () => {
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [sortBy, setSortBy] = useState("newest");

  const { clientOrders, getClientOrders, isLoading } = useOrderStore();

  useEffect(() => {
    getClientOrders();
  }, []);

  // Filtrer et trier les commandes
  const filteredOrders = clientOrders
    .filter((order) => {
      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "processing" &&
          order.items.some(
            (item) =>
              item.itemStatus === "processing" || item.itemStatus === "packing"
          )) ||
        order.items.some((item) => item.itemStatus === filterStatus);

      const matchesSearch =
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.items.some((item) =>
          item.productName.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "newest")
        return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "oldest")
        return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === "total-high") return b.total - a.total;
      if (sortBy === "total-low") return a.total - b.total;
      return 0;
    });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <ProductDetailsNav />
      <div className="flex flex-row items-center gap-3 pt-5 ml-16">
        <Link to="/home">
          <MoveLeft
            size={18}
            className="fill-blue-500 text-blue-500 cursor-pointer hover:scale-110 transition-transform"
          />
        </Link>
        <div className="flex flex-row items-center gap-2">
          <Link
            to="/home"
            className="text-blue-500 cursor-pointer hover:text-blue-700 font-semibold"
          >
            Home
          </Link>
          <span className="text-blue-500 font-bold">-</span>
          <Link className="text-blue-500 cursor-pointer hover:text-blue-700 font-semibold">
            Orders
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <OrderHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        {/* Orders list */}

        {filteredOrders.length === 0 ? (
          <motion.div
            className="bg-white rounded-xl shadow-md p-8 text-center border border-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              No orders found
            </h3>
            <p className="mt-1 text-gray-500">
              No orders match your search criteria.
            </p>
          </motion.div>
        ) : (
          <ClientOrders filteredOrders={filteredOrders} />
        )}
      </div>
    </div>
  );
};

export default Orders;
