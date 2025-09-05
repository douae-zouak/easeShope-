const express = require("express");
const profileController = require("../../controllers/vendor/profile.controller");
const multerConfig = require("../../config/multer.config");

const router = express.Router();

// Get vendor profile
router.get("/profile", profileController.getProfile);

// Update vendor profile
router.put("/profile", profileController.updateProfile);

// Upload profile photo
router.post(
  "/upload-photo",
  multerConfig.upload.single("profilePhoto"),
  profileController.uploadProfilePhoto
);


module.exports = router;