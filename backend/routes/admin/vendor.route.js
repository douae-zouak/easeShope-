const express = require("express");
const authMiddleware = require("../../middlewares/auth.middleware");
const adminController = require("../../controllers/admin/vendor.controller");

const router = express.Router();

// Routes protégées pour l'admin uniquement
router.get("/vendors", authMiddleware.ckeckTokens, adminController.getVendors);

router.get(
  "/vendor/:id",
  authMiddleware.ckeckTokens,
  adminController.getVendorDetails
);

router.patch(
  "/vendor/desactivate/:id",
  authMiddleware.ckeckTokens,
  adminController.deactivateVendor
);

router.patch(
  "/vendor/activate/:id",
  authMiddleware.ckeckTokens,
  adminController.activateVendor
);

router.delete(
  "/vendor/delete/:id",
  authMiddleware.ckeckTokens,
  adminController.deleteVendor
);

module.exports = router;
