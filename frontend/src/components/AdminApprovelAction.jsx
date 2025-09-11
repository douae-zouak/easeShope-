import { useState } from "react";
import { useProductStore } from "../store/product.store";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  XCircle,
  Shield,
  ChevronDown,
  AlertCircle,
} from "lucide-react";

const AdminApprovalAction = ({ id }) => {
  const { approveProduct, rejectProduct } = useProductStore();
  const [rejectionReason, setRejectionReason] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);
  const [showRejectionForm, setShowRejectionForm] = useState(false);
  const navigate = useNavigate();

  const handleApprove = async () => {
    try {
      await approveProduct(id);
      toast.success("Product approved successfully");
      navigate("/admin/products-activation");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    try {
      await rejectProduct(id, rejectionReason);
      toast.success("Product rejected successfully");
      navigate("/admin/products-activation");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const commonReasons = [
    "Low quality images",
    "Incomplete description",
    "Pricing not compliant",
    "Incorrect category",
    "Missing information",
  ];

  return (
    <div className="bg-white border border-gray-200 p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Shield size={20} className="text-blue-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">
          Product Validation
        </h2>
      </div>

      {/* Main actions */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <button
          onClick={handleApprove}
          className="flex flex-col items-center justify-center p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors group"
        >
          <div className="p-2 bg-green-100 rounded-full mb-2 group-hover:bg-green-200 transition-colors">
            <CheckCircle size={20} className="text-green-600" />
          </div>
          <span className="text-sm font-medium text-green-800">Approve</span>
        </button>

        <button
          onClick={() => {
            setIsRejecting(true);
            setShowRejectionForm(!showRejectionForm);
          }}
          className="flex flex-col items-center justify-center p-4 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors group"
        >
          <div className="p-2 bg-red-100 rounded-full mb-2 group-hover:bg-red-200 transition-colors">
            <XCircle size={20} className="text-red-600" />
          </div>
          <span className="text-sm font-medium text-red-800">Reject</span>
        </button>
      </div>

      {/* Rejection form (appears only when Reject is clicked) */}
      {isRejecting && (
        <div className="border-t pt-6">
          <div
            className="flex items-center justify-between cursor-pointer mb-4"
            onClick={() => setShowRejectionForm(!showRejectionForm)}
          >
            <div className="flex items-center gap-2">
              <AlertCircle size={16} className="text-red-500" />
              <span className="text-sm font-medium text-red-700">
                Rejection Reason
              </span>
            </div>
            <ChevronDown
              size={16}
              className={`text-red-500 transition-transform ${
                showRejectionForm ? "rotate-180" : ""
              }`}
            />
          </div>

          {showRejectionForm && (
            <div className="space-y-4">
              {/* Common reasons */}
              <div className="grid grid-cols-2 gap-2">
                {commonReasons.map((reason, index) => (
                  <button
                    key={index}
                    onClick={() => setRejectionReason(reason)}
                    className="text-xs p-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 transition-colors"
                  >
                    {reason}
                  </button>
                ))}
              </div>

              {/* Custom reason textarea */}
              <div>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Describe the reason for rejection..."
                  className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows="3"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleReject}
                  disabled={!rejectionReason.trim()}
                  className="flex-1 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Confirm Rejection
                </button>
                <button
                  onClick={() => {
                    setIsRejecting(false);
                    setRejectionReason("");
                    setShowRejectionForm(false);
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Approval message (optional) */}
      {!isRejecting && (
        <div className="text-center text-sm text-gray-600 mt-4">
          Ensure the product complies with all guidelines before approval.
        </div>
      )}
    </div>
  );
};

export default AdminApprovalAction;
