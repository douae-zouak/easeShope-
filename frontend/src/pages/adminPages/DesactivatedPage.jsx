// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  Mail,
  AlertTriangle,
  Shield,
  HelpCircle,
  ArrowRight,
  Lock,
  UserX,
} from "lucide-react";

const DesactivatedPage = () => {
  // Sample deactivation data (would typically come from props or global state)
  const deactivationData = {
    reason: "Violation of terms of service - selling counterfeit products",
    date: "September 15, 2023",
    admin: "admin@marketplace.com",
    contactEmail: "support@marketplace.com",
    appealProcess: "You can appeal this decision within 30 days",
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full bg-gray-800/70 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-gray-700"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-800 p-6 text-center">
          <motion.div
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex justify-center mb-4"
          >
            <div className="p-3 bg-white/20 rounded-full">
              <Lock size={40} className="text-white" />
            </div>
          </motion.div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Account Deactivated
          </h1>
          <p className="text-red-100 mt-2">
            Your vendor account has been deactivated by an administrator
          </p>
        </div>
        {/* Main Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="p-6 md:p-8 "
        >
          <motion.div
            variants={itemVariants}
            className="flex items-start mb-4 p-4 bg-red-900/20 rounded-lg border border-red-800/30"
          >
            <AlertTriangle
              className="text-red-400 mr-3 flex-shrink-0"
              size={24}
            />
            <p className="text-red-200">
              Your account was deactivated on{" "}
              <span className="font-semibold">{deactivationData.date}</span>.
              You no longer have access to your vendor dashboard or selling
              capabilities.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="text-center p-4 bg-gray-900/50 rounded-lg border border-gray-700"
          >
            <p className="text-gray-400 text-sm">
              An email has been sent to your account's registered address with
              all details regarding this decision and next steps.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <motion.div
              variants={itemVariants}
              className="bg-gray-700/30 p-5 rounded-xl border border-gray-600/50"
            >
              <h3 className="font-medium text-white mb-3 flex items-center">
                <Mail size={18} className="mr-2 text-blue-400" />
                Contact Support
              </h3>
              <p className="text-gray-400 text-sm mb-3">
                For questions about this deactivation, please contact:
              </p>
              <a
                href={`mailto:${deactivationData.contactEmail}`}
                className="text-blue-400 hover:text-blue-300 transition-colors text-sm inline-flex items-center"
              >
                {deactivationData.contactEmail}{" "}
                <ArrowRight size={14} className="ml-1" />
              </a>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-gray-700/30 p-5 rounded-xl border border-gray-600/50"
            >
              <h3 className="font-medium text-white mb-3 flex items-center">
                <Shield size={18} className="mr-2 text-blue-400" />
                Platform Policies
              </h3>
              <p className="text-gray-400 text-sm mb-3">
                Review our platform policies to understand community guidelines
                and terms of service.
              </p>
              <a
                href="/policies"
                className="text-sm bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center w-full"
              >
                View Policies <ArrowRight size={14} className="ml-1" />
              </a>
            </motion.div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="bg-gray-900/80 p-4 text-center"
        >
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Marketplace. All rights reserved.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DesactivatedPage;
