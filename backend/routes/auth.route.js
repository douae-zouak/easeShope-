const express = require("express");
const { body, param } = require("express-validator");

const authController = require("../controllers/auth.controller");
const rateLimitMiddleware = require("../middlewares/rateLimit.middleware");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

// Signin
router.post(
  "/signin",
  [
    body("email", "Enter a valid email").notEmpty().isEmail().normalizeEmail(),
    body("fullName", "A valid name is required")
      .notEmpty()
      .isLength({ min: 3, max: 20 })
      .isString()
      .trim(),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 8 })
      .withMessage("Password too short")
      .trim(),
    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Password do not match");
        }
        return true; // validation réussie
      }),
  ],
  rateLimitMiddleware.authLimiter,
  authController.postSignin
);

router.post("/verify-email", authController.verifyEmail);

router.post("/resend-verification", authController.resendVerification);

// Login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email").normalizeEmail(),
    body("password")
      .notEmpty()
      .withMessage("enter a correct credentials")
      .trim(),
  ],
  rateLimitMiddleware.authLimiter,
  authController.postLogin
);

// Logout
router.post("/logout", authController.postLogout);

// Forgot password
router.post(
  "/request-password-reset",
  [body("email").isEmail().withMessage("Invalid email").normalizeEmail()],
  rateLimitMiddleware.passwordResetLimiter,
  authController.requestPasswordReset
);

// Password reset route
router.post(
  "/reset-password/:token",
  [
    param("token").isString().trim().escape(),
    // .escape() : Remplace les caractères spéciaux HTML (<, >, ", ', etc.) par des entités HTML sécurisées.
    // Protège contre les attaques XSS (injection de script via le contenu envoyé).
    body("newPassword").trim().isLength({ min: 8 }),
    body("confirmNewPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.newPassword) {
          throw new Error("confirm password and password do have to match");
        }
        return true;
      }),
  ],
  authController.resetPassword
);

router.get("/refresh", authController.refreshTokens);

router.get("/check-session", authController.checkSession);

module.exports = router;
