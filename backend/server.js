const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
//const mongoSanitize = require("express-mongo-sanitize");
// Prevents NoSQL Injection attacks like: malicious inputs with $/.
//const xssClean = require("xss-clean");
const helmet = require("helmet");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/connectDB");
const authRoutes = require("./routes/auth.route");
const productRoutes = require("./routes/vendor/product.route");
const profileRoutes = require("./routes/vendor/profile.route");
const ordersRoutes = require("./routes/vendor/order.route");
const errorMiddleware = require("./middlewares/error.middleware");
const clientRoutes = require("./routes/Buyer/products.route");
const cartRoutes = require("./routes/Buyer/cart.route");
const favoriteRoutes = require("./routes/Buyer/favorite.route");
const paypalRoutes = require("./routes/Buyer/paypal.route");
const sellerReviewRoutes = require("./routes/Buyer/sellerReview.route");
const authMiddleware = require("./middlewares/auth.middleware");

dotenv.config();

const app = express();

// pour que le serveur démarre seulement si DB OK	: Plus fiable, gestion d’erreurs
connectDB();

// middlewares

// helmet doit être en premier pour ajouter les headers de sécurité avant toute réponse.
// ⚡ Autoriser le cross-origin pour les images
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
// cors avant le traitement des données.
app.use(
  cors({
    origin: [process.env.FRONTEND_URL, process.env.FRONTEND_URL_2],
    credentials: true,
  })
);

// Parsers (express.json, urlencoded, cookieParser) avant nettoyage (mongoSanitize).
app.use(express.json({ limit: "50mb" })); //allows us to parse incoming requests
// Utilise le module qs (plus puissant) pour parser les données.
// Permet de parser des objets imbriqués complexes,
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
// protège l'application contre les injections MongoDB,
// facilite l'acces au infos stocker dans les cookies
app.use(cookieParser());

// Nettoyage avant logique métier (auth, routes).
// Nettoyage anti-XSS
//app.use(xssClean());
// Nettoyage injection MongoDB
//app.use(mongoSanitize());

// Ici __dirname = project/
app.use("/uploads", express.static(path.join(__dirname, "config", "uploads")));

// Routes
app.use("/auth", authRoutes);

app.use("/product", authMiddleware.ckeckTokens, productRoutes);
app.use("/profile", authMiddleware.ckeckTokens, profileRoutes);
app.use("/orders", authMiddleware.ckeckTokens, ordersRoutes);

app.use("/", clientRoutes);
app.use("/cart", authMiddleware.ckeckTokens, cartRoutes);
app.use("/favorite", authMiddleware.ckeckTokens, favoriteRoutes);
app.use("/paypal", authMiddleware.ckeckTokens, paypalRoutes);
app.use("/sellerReview", authMiddleware.ckeckTokens, sellerReviewRoutes);

// Error handling
app.use(errorMiddleware.notFoundHandler);
app.use(errorMiddleware.errorHandler);

// Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("server running on port 3000");
});
