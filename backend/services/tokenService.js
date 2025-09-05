const createError = require("http-errors");
const User = require("../models/user.model");
const RefreshToken = require("../models/refreshToken.model");
const jwtConfig = require("../config/jwt.config");

exports.refreshTokenService = async (res, refreshToken) => {
  console.log("refresh token received:", refreshToken);

  if (!refreshToken) {
    console.log("No refresh token found in cookies");
    // return res.status(401).json({
    //   error: "No refresh token provided",
    //   shouldLogout: true,
    // });
    throw createError.Unauthorized("No refresh token provided");
  }

  console.log("Looking for refresh token in database:", refreshToken);
  const tokenDoc = await RefreshToken.findOne({ token: refreshToken });
  if (!tokenDoc) {
    console.log("Refresh token not found in database");
    throw createError.Unauthorized("Invalid refresh token");
  }

  console.log("refresh token in db and Verifying refresh token");
  const decoded = jwtConfig.verifyRefreshToken(refreshToken);
  console.log("Decoded token:", decoded);
  const user = await User.findById(decoded.userId);

  if (!user) {
    console.log("User not found for ID:", decoded.userId);
    throw createError.Unauthorized("User not found");
  }

  const { accessToken, newRefreshToken } = await jwtConfig.refreshToken(
    refreshToken
  );

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000,
  });

  // Mettre à jour le refresh token en base
  tokenDoc.token = newRefreshToken;
  await tokenDoc.save();

  console.log("succeed");
  return { accessToken, newRefreshToken, user };
};
