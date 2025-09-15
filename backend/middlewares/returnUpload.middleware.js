const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { cloudinary } = require("../config/cloudinary.config");
const createError = require("http-errors");

// Storage spécifique pour les reviews
const returnStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "return-requests",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 800, height: 800, crop: "limit" }],
  },
});

const uploadReview = multer({
  storage: returnStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image")) {
      return cb(createError(400, "Only image files are allowed!"), false);
    }
    cb(null, true);
  },
});

// Middleware spécifique pour les images de reviews
const uploadReturnImages = uploadReview.array("images", 4); // max 4 images

module.exports = { uploadReturnImages };
