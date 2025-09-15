const jwt = require("jsonwebtoken");
const createError = require("http-errors");

const RefreshToken = require("../models/refreshToken.model");

exports.generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET_KEY, {
    expiresIn: "30m",
  });
};


exports.generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET_KEY, {
    expiresIn: "1d",
  });
};

exports.verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
    // retourne le payload decode {userId : 123}
  } catch (err) {
    throw createError.Unauthorized("Invalid or expired access token");
  }
};

exports.verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET_KEY);
    //retourne le payload si correct
  } catch (err) {
    throw createError.Unauthorized("Invalid or expired access token");
  }
};

exports.refreshToken = async (refreshToken) => {
  const decoded = exports.verifyRefreshToken(refreshToken);

  const token = await RefreshToken.findOne({ token: refreshToken });
  // Quand un utilisateur se déconnecte, tu supprimes son refresh token de la base de données.
  // Mais… le token JWT reste valide mathématiquement (il n’est pas encore expiré).
  // Donc, si quelqu’un essaie de le réutiliser ca va marcher si je ne verifier pas son existance en db

  if (!token) {
    throw createError.Unauthorized("Invalid refresh token");
  }

  // Generate new tokens
  const accessToken = exports.generateAccessToken(decoded.userId);
  const newRefreshToken = exports.generateRefreshToken(decoded.userId);
  console.log(newRefreshToken);

  // Replace old refresh token with new one
  await RefreshToken.findOneAndUpdate(
    { token: refreshToken },
    { token: newRefreshToken }
  );

  return { accessToken, newRefreshToken };
};

exports.deleteToken = async (refreshToken) => {
  await RefreshToken.deleteOne({ token: refreshToken });
};
