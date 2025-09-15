const express = require("express");
const returnsController = require("../../controllers/buyer/returns.controller");
const {
  uploadReturnImages,
} = require("../../middlewares/returnUpload.middleware");

const router = express.Router();

router.post(
  "/requestReturn",
  uploadReturnImages,
  returnsController.requestReturn
);

module.exports = router;
