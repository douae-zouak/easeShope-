const express = require("express");
const adminVendorController = require("../../controllers/admin/vendor.controller");

const router = express.Router();

// Routes protégées pour l'admin uniquement
router.get("/", adminVendorController.getVendors);

router.get("/:id", adminVendorController.getVendorDetails);

router.patch("/desactivate/:id", adminVendorController.desactivateVendor);

router.patch("/activate/:id", adminVendorController.activateVendor);

router.delete("/delete/:id", adminVendorController.deleteVendor);

module.exports = router;
