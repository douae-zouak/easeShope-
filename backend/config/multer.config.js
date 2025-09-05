const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Vérifier si le dossier existe, sinon le créer
const uploadDir = path.join(__dirname, "uploads/profile-photos");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer pour les uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "admin-" + uniqueSuffix + path.extname(file.originalname));
  },
});

exports.upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // limite 5MB
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});
