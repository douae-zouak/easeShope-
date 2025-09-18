const express = require("express");
const vendorStatController = require("../../controllers/vendor/stat.controller");

const router = express.Router();

router.get("/", vendorStatController.getVendorStats);

module.exports = router;
