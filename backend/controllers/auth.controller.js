const createError = require("http-errors");
const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const crypto = require("crypto");

const User = require("../models/user.model");
const RefreshToken = require("../models/refreshToken.model");

const brevoConfig = require("../config/brevo.config");
const jwtConfig = require("../config/jwt.config");
const tokenService = require("../services/tokenService");

exports.postSignin = async (req, res, next) => {
  const { email, password, fullName, role } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0].msg;

    return res.status(400).json({
      success: false,
      error: firstError,
    });
  }

  try {
    const userAlreadyExists = await User.findOne({ email });

    if (userAlreadyExists) {
      res.status(400).json({ error: "Email already used!" });
      // throw createError.Conflict("Email already in use");
    }

    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString(); // to generate OTP

    const user = await User.create({
      email,
      password,
      fullName,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 3600000, //  1 heure
      role,
    });

    await brevoConfig.sendVerificationEmail(user.email, verificationToken);
    //await nodeMailerConfig.sendVerificationEmail(user.email, verificationToken);

    res.status(200).json({
      success: true,
      message: "user successfuly sign up",
      user,
    });
  } catch (error) {
    next(error);
  }
};

exports.verifyEmail = async (req, res, next) => {
  const verificationCode = req.body.verificationCode;

  if (!verificationCode) {
    return res
      .status(422)
      .json({ error: "entrer the verifcation code sent in your email" });
  }

  try {
    const user = await User.findOne({
      verificationToken: verificationCode,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      throw createError.BadRequest("Invalid or expired verification token");
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    await brevoConfig.welcomeEmail(
      user.fullName,
      `${process.env.FRONTEND_URL}/login`,
      user.email
    );

    res
      .status(200)
      .json({ message: "your email verification passed successfuly" });
  } catch (error) {
    next(error);
  }
};

exports.resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    if (user.isVerified) {
      return res
        .status(400)
        .json({ success: false, error: "Email is already verified" });
    }

    // Générer un nouveau code de vérification
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    user.verificationToken = verificationCode;
    user.verificationTokenExpiresAt = Date.now() + 3600000; // 1 heure

    await user.save();

    await brevoConfig.sendVerficationCodeAgain(user.email, verificationCode);

    res.status(200).json({ message: "Verification code resent successfully" });
  } catch (error) {
    next(error);
  }
};

exports.postLogin = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select("+password");
    //tu forces Mongoose à inclure ces champs cachés dans le résultat par select: false

    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    if (user.accountLockedUntil && user.accountLockedUntil > Date.now()) {
      const remainingTime = Math.ceil(
        (user.accountLockedUntil - Date.now()) / (60 * 1000)
      );
      return res.status(400).json({
        error: `Account locked. Try again in ${remainingTime} minutes`,
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      // Increment failed login attempts
      user.loginAttempts += 1;
      await user.save();

      // Lock account after 5 failed attempts for 30 minutes
      if (user.loginAttempts >= 5) {
        user.accountLockedUntil = Date.now() + 1000 * 60 * 30;
        await user.save();
        return res.status(400).json({
          error: "Too many failed attempts. Account locked for 30 minutes",
        });
      }

      return res.status(400).json({ error: "Invalid credentials" });
    }

    user.loginAttempts = 0;
    user.accountLockedUntil = null;
    user.lastLogin = Date.now();
    await user.save();

    if (!user.isVerified) {
      res.json({ error: "Please verify your email first" });
    }

    if (!user.isActive && user.whoDesactivated === "admin") {
      res.json({ error: "Your account is desactivated" });
    }

    // Generate tokens
    const accessToken = jwtConfig.generateAccessToken(user._id);
    const refreshToken = jwtConfig.generateRefreshToken(user._id);

    // génère un ID unique comme "a9b72d8b-1d88-47e4-88db-50f4a9e90b9a"
    const deviceId = uuidv4();

    // Store refresh token in database
    await RefreshToken.create({
      userId: user._id,
      token: refreshToken,
      deviceId: deviceId,
    });

    // Set cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true, //prevent xss attacks
      secure: process.env.NODE_ENV === "production",
      // envoyés seulement via HTTPS
      sameSite: "lax",
      maxAge: 30 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return res.status(200).json({ user, message: "login successfuly" });
  } catch (error) {
    next(error);
  }
};

exports.refreshTokens = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    console.log("refresh token existes : ", refreshToken);

    const result = await tokenService.refreshTokenService(res, refreshToken);

    // ⚡ envoyer le nouvel accessToken au frontend
    return res.status(200).json({
      user: result.user,
    });
  } catch (error) {
    // Nettoyer les cookies en cas d'erreur
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    next(error);
  }
};

exports.checkSession = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(200).json({ user: null, isAuthenticated: false });
    }

    const tokenDoc = await RefreshToken.findOne({ token: refreshToken });
    if (!tokenDoc) {
      return res.status(200).json({ user: null, isAuthenticated: false });
    }

    const decoded = jwtConfig.verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(200).json({ user: null, isAuthenticated: false });
    }

    return res.status(200).json({ user, isAuthenticated: true });
  } catch (error) {
    return res.status(200).json({ user: null, isAuthenticated: false });
  }
};

exports.postLogout = async (req, res, next) => {
  try {
    const refreshToken = req.refreshToken;

    await jwtConfig.deleteToken(refreshToken);

    // Clear cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(200).json({ success: true, message: "logout successfuly" });
  } catch (error) {
    next(error);
  }
};

exports.requestPasswordReset = async (req, res, next) => {
  const email = req.body.email;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw createError.NotFound("User not found");
    }

    // generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 min
    await user.save();

    await brevoConfig.sendResetPasswordEmail(
      user.email,
      `${process.env.FRONTEND_URL}/auth/reset-password/${resetToken}`
    );

    res.status(200).json({
      succes: true,
      message: "password link sent to your email ",
    });
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  const newPassword = req.body.password;
  const token = req.params.token;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      throw createError.BadRequest("Invalid or expired verification token");
    }

    // update password
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    // send email
    await brevoConfig.sendResetSuccesEmail(user.email);

    res.status(200).json({
      succes: true,
      message: "password reset successfuly",
    });
  } catch (error) {
    next(error);
  }
};
