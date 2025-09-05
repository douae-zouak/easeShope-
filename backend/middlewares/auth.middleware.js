const createError = require("http-errors");

const User = require("../models/user.model");
const RefreshToken = require("../models/refreshToken.model");
const jwtConfig = require("../config/jwt.config");

exports.ckeckTokens = async (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwtConfig.verifyAccessToken(token);
    const user = await User.findById(decoded.userId).select("-password");

      if (!user) throw createError.Unauthorized("User not found");
      if (!user.isVerified) {
        throw createError.Forbidden("Please verify your email first");
      }

      req.user = user;
      return next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

// exports.checkAccessToken = async (req, res, next) => {
//   try {
//     const token = req.cookies.accessToken;

//     // Si pas de access token, vérifier refresh token
//     if (!token) {
//       return await handleTokenRefresh(req, res, next);
//     }

//     try {
//       // Vérifier le access token
//       const decoded = jwtConfig.verifyAccessToken(token);
//       const user = await User.findById(decoded.userId).select("-password");

//       if (!user) throw createError.Unauthorized("User not found");
//       if (!user.isVerified) {
//         throw createError.Forbidden("Please verify your email first");
//       }

//       req.user = user;
//       return next();
//     } catch (error) {
//       console.log("du cath : ", error);
//     }
//   } catch (error) {
//     clearAuthCookies(res);
//     return res.status(401).json({
//       error: error.message || "Unauthorized",
//       shouldLogout: true,
//     });
//   }
// };

// function setAuthCookies(res, accessToken, refreshToken) {
//   res.cookie("accessToken", accessToken, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "strict",
//     maxAge: 60 * 1000, // 10 minutes
//   });

//   res.cookie("refreshToken", refreshToken, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "strict",
//     maxAge: 24 * 60 * 60 * 1000, // 1 day
//   });
// }

// function clearAuthCookies(res) {
//   res.clearCookie("accessToken");
//   res.clearCookie("refreshToken");
// }

// async function handleTokenRefresh(req, res, next) {
//   const refreshToken = req.cookies.refreshToken;

//   if (!refreshToken) {
//     clearAuthCookies(res);
//     console.log("noooooo refresh token");
//     return res.status(401).json({
//       error: "Session expired. Please log in again.",
//       shouldLogout: true,
//     });
//   }

//   try {
//     const { accessToken, newRefreshToken, user } =
//       await TokenService.refreshTokenService(refreshToken);

//     setAuthCookies(res, accessToken, newRefreshToken);
//     req.user = user;
//     return next();
//   } catch (error) {
//     clearAuthCookies(res);
//     return res.status(401).json({
//       error: "Session expired. Please log in again.",
//       shouldLogout: true,
//     });
//   }
// }

// roles peut être une chaîne ou un tableau de chaînes
exports.authorize = (req, res, next) => {
  if (!req.user) {
    return next(createError.Unauthorized());
  }

  if (req.user.role !== "vendor") {
    return next(
      createError.Forbidden(`You don't have the allowed permission `)
    );
  }

  next();
};
