const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { cloudinary } = require("../config/cloudinary.config");
const createError = require("http-errors");

// Storage spécifique pour les reviews
const reviewStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "product-reviews", 
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 800, height: 800, crop: "limit" }],
  },
});

const uploadReview = multer({
  storage: reviewStorage, // Utilisez le storage spécifique aux reviews
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image")) {
      return cb(createError(400, "Only image files are allowed!"), false);
    }
    cb(null, true);
  },
});

// Middleware spécifique pour les images de reviews
const uploadReviewImages = uploadReview.array("images", 4); // max 4 images

module.exports = { uploadReviewImages };
