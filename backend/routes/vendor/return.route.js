const express = require("express");
const vendorReturnController = require("../../controllers/vendor/return.controller");

const router = express.Router();

router.get("/", vendorReturnController.getApprovedProducts);

module.exports = router;
