const multer = require("multer");
const { storage } = require("../config/cloudinary.config");
const createError = require("http-errors");

// Configurer multer avec Cloudinary storage
const upload = multer({
  // storage: où stocker les fichiers (ici Cloudinary).
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    // Le type MIME (Multipurpose Internet Mail Extensions) est une chaîne standard qui décrit la nature et le format d’un fichier.
    if (!file.mimetype.startsWith("image")) {
      return cb(createError(400, "Only image files are allowed!"), false);
    }
    cb(null, true);
  },
});

// Middleware multer pour uploader plusieurs images
const uploadProductImages = upload.array("images", 10); // max 10 images

module.exports = { uploadProductImages };
