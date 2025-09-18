const express = require("express");
const adminReturnController = require("../../controllers/admin/return.controller");

const router = express.Router();

router.get("/", adminReturnController.getReturnedProducts);

router.patch("/update", adminReturnController.updateRequestedProductStatus);

module.exports = router;
