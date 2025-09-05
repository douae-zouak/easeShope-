const createError = require("http-errors");

exports.errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err); // Ne pas réémettre une réponse
  }

  // Si l'erreur n'a pas de status, on met 500 par défaut (erreur serveur)
  const statusCode = err.status || 500;

  res.status(statusCode).json({
    status: "error",
    statusCode,
    message: err.message || "Internal Server Error",
    // En dev, on peut aussi renvoyer la stack pour debug
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
  //   En mode développement (development), on veut souvent voir la pile d’appels (stack) complète de l’erreur pour debug.

  // En production, on ne veut pas exposer cette info sensible à l’utilisateur (risque de fuite d’infos techniques).
};

exports.notFoundHandler = (req, res, next) => {
  next(createError.NotFound("Route not found"));
};
