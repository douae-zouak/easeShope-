// pages/adminSupPages/VendorsPage.jsx
import { useEffect, useState } from "react";
import { useAdminVendorStore } from "../../store/VendorsAdmin.store";
import VendorCard from "../../components/admin/VendorCard";
import VendorFilters from "../../components/admin/VendorFilters";
import ConfirmationModal from "../../components/admin/ConfirmationModal";
import { toast } from "react-hot-toast";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

import AdminNavbar from "../../components/AdminNavbar";

const VendorsPage = () => {
  const {
    vendors,
    loading,
    error,
    filters,
    pagination,
    getVendors,
    setFilters,
    setPage,
    desactivateVendor,
    activateVendor,
    deleteVendor,
  } = useAdminVendorStore();

  const [actionType, setActionType] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState("");

  useEffect(() => {
    getVendors();
  }, []);

  const handleAction = (vendor, type) => {
    setSelectedVendor(vendor);
    setActionType(type);
    setShowModal(true);
  };

  const confirmAction = async () => {
    try {
      if (actionType === "desactivate") {
        await desactivateVendor(selectedVendor._id, reason);
        toast.success("Vendor account desactivated successfully");
      } else if (actionType === "activate") {
        await activateVendor(selectedVendor._id);
        toast.success("Vendor account activated successfully");
      } else if (actionType === "delete") {
        await deleteVendor(selectedVendor._id, reason);
        toast.success("Vendor account deleted successfully");
      }

      setShowModal(false);
      setReason("");
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (error) {
    return toast.error(`Error : ${error}`);
  }

  return (
    <motion.div
      className="p-6 bg-gray-50 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <header className="fixed top-0 right-0 z-10 bg-white w-full ">
        <AdminNavbar />
      </header>
      <div className="mb-8 mt-5">
        <motion.h1
          className="text-3xl font-bold text-gray-900 mb-2"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          Vendor Management
        </motion.h1>
        <motion.p
          className="text-gray-600"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          Manage all vendors on your platform
        </motion.p>
      </div>

      <VendorFilters filters={filters} setFilters={setFilters} />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="bg-white rounded-lg shadow-sm p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <div className="h-40 bg-gray-200 rounded-md mb-4 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </motion.div>
          ))}
        </div>
      ) : vendors.length === 0 ? (
        <motion.div
          className="bg-white rounded-lg shadow-sm p-12 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <svg
            className="mx-auto h-16 w-16 text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No vendors found
          </h3>
          <p className="mt-1 text-gray-500">
            Try adjusting your search filters
          </p>
        </motion.div>
      ) : (
        <>
          <AnimatePresence>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {vendors.map((vendor, index) => (
                <VendorCard
                  key={vendor._id || `vendor-${index}`}
                  vendor={vendor}
                  onAction={handleAction}
                  index={index}
                />
              ))}
            </div>
          </AnimatePresence>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <motion.div
              className="mt-8 flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <nav className="flex items-center space-x-1">
                {[...Array(pagination.totalPages)].map((_, i) => {
                  const pageNumber = i + 1;
                  return (
                    <motion.button
                      key={pageNumber}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setPage(pageNumber)}
                      className={`px-3 py-1.5 rounded-sm text-sm ${
                        pagination.page === pageNumber
                          ? "bg-black text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {pageNumber}
                    </motion.button>
                  );
                })}
              </nav>
            </motion.div>
          )}
        </>
      )}

      <ConfirmationModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setReason("");
        }}
        onConfirm={confirmAction}
        actionType={actionType}
        vendor={selectedVendor}
        reason={reason}
        setReason={setReason}
      />
    </motion.div>
  );
};

export default VendorsPage;
