const rateLimit = require("express-rate-limit");
// permet de créer un middleware pour limiter le nombre de requêtes qu’un utilisateur peut envoyer à un serveur dans un laps de temps donné.

exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // sur 15 minutes
  max: 10, // 10 tentatives autorisées par IP
  message: "Too many requests from this IP, please try again later",
  skipSuccessfulRequests: true, // si l'inscription est réussie, elle n'est pas comptée
});

exports.passwordResetLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // sur 15 minutes
  max: 3, // 10 tentatives autorisées par IP
  message: "Too many password reset requests, please try again later",
});
