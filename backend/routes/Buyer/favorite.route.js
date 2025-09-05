const express = require("express");
const favoriteController = require("../../controllers/buyer/favorite.controller");

const router = express.Router();

router.post("/toggle", favoriteController.toggleToFavorite);

// router.get("/", favoriteController.getFavorite);

module.exports = router;
