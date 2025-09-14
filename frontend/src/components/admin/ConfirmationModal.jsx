import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  actionType,
  vendor,
  reason,
  setReason,
}) => {
  const [localOpen, setLocalOpen] = useState(isOpen);

  useEffect(() => {
    setLocalOpen(isOpen);
  }, [isOpen]);

  const getTitle = () => {
    switch (actionType) {
      case "desactivate":
        return "Deactivate Vendor";
      case "activate":
        return "Activate Vendor";
      case "delete":
        return "Delete Vendor";
      default:
        return "Confirm Action";
    }
  };

  const getDescription = () => {
    switch (actionType) {
      case "desactivate":
        return `Are you sure you want to deactivate ${vendor?.fullName}'s account? This will prevent them from logging in and managing their products.`;
      case "activate":
        return `Are you sure you want to activate ${vendor?.fullName}'s account?`;
      case "delete":
        return `Are you sure you want to permanently delete ${vendor?.fullName}'s account? This action cannot be undone.`;
      default:
        return "Are you sure you want to proceed with this action?";
    }
  };

  const getButtonText = () => {
    switch (actionType) {
      case "desactivate":
        return "Deactivate";
      case "activate":
        return "Activate";
      case "delete":
        return "Delete";
      default:
        return "Confirm";
    }
  };

  const getButtonColor = () => {
    switch (actionType) {
      case "desactivate":
        return "bg-yellow-500 hover:bg-yellow-600 focus-visible:ring-yellow-500";
      case "activate":
        return "bg-green-500 hover:bg-green-600 focus-visible:ring-green-500";
      case "delete":
        return "bg-red-500 hover:bg-red-600 focus-visible:ring-red-500";
      default:
        return "bg-indigo-500 hover:bg-indigo-600 focus-visible:ring-indigo-500";
    }
  };

  const getIcon = () => {
    switch (actionType) {
      case "desactivate":
        return "⚠️";
      case "activate":
        return "✅";
      case "delete":
        return "🗑️";
      default:
        return "❓";
    }
  };

  const handleClose = () => {
    setLocalOpen(false);
    setTimeout(() => {
      onClose();
      setReason("");
    }, 300);
  };

  const handleConfirm = () => {
    setLocalOpen(false);
    setTimeout(() => {
      onConfirm();
    }, 300);
  };

  return (
    <AnimatePresence>
      {localOpen && (
        <Transition show={localOpen} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-50 overflow-y-auto bg-black/50"
            onClose={handleClose}
          >
            <div className="min-h-screen px-4 text-center">
              <span
                className="inline-block h-screen align-middle"
                aria-hidden="true"
              >
                &#8203;
              </span>

              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <motion.div
                  className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl"
                  initial={{ y: 50, opacity: 0, scale: 0.9 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: 50, opacity: 0, scale: 0.9 }}
                  transition={{
                    type: "spring",
                    damping: 25,
                    stiffness: 300,
                    mass: 0.8,
                  }}
                >
                  {/* Header with icon */}
                  <motion.div
                    className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                  >
                    <span className="text-2xl">{getIcon()}</span>
                  </motion.div>

                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 text-center"
                  >
                    {getTitle()}
                  </Dialog.Title>

                  <div className="mt-2">
                    <motion.p
                      className="text-sm text-gray-500 text-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {getDescription()}
                    </motion.p>

                    {(actionType === "desactivate" ||
                      actionType === "delete") && (
                      <motion.div
                        className="mt-4"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ delay: 0.3 }}
                      >
                        <label
                          htmlFor="reason"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Reason *
                        </label>
                        <motion.textarea
                          id="reason"
                          rows={3}
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-200 focus:ring-1 focus:ring-indigo-500  transition-all duration-200  sm:text-sm p-2"
                          placeholder="Please provide a reason for this action..."
                          required
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.4 }}
                        />
                      </motion.div>
                    )}
                  </div>

                  <motion.div
                    className="mt-6 flex space-x-3 justify-end"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <motion.button
                      type="button"
                      className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-md  focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 hover:scale-105 hover:bg-[#e5e7eb]"
                      onClick={handleClose}
                      whileTap={{ scale: 0.95 }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="button"
                      disabled={
                        (actionType === "desactivate" ||
                          actionType === "delete") &&
                        !reason
                      }
                      className={`inline-flex justify-center px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${getButtonColor()} disabled:opacity-50 disabled:cursor-not-allowed`}
                      onClick={handleConfirm}
                      whileHover={{
                        scale:
                          (actionType === "desactivate" ||
                            actionType === "delete") &&
                          !reason
                            ? 1
                            : 1.05,
                        boxShadow:
                          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                      }}
                      whileTap={{
                        scale:
                          (actionType === "desactivate" ||
                            actionType === "delete") &&
                          !reason
                            ? 1
                            : 0.95,
                      }}
                    >
                      {getButtonText()}
                    </motion.button>
                  </motion.div>
                </motion.div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal;
