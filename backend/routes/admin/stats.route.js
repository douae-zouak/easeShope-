const express = require("express");
const adminStatsController = require("../../controllers/admin/stats.controller");

const router = express.Router();

// Route pour les statistiques générales
router.get("/", adminStatsController.getAdminStats);

// Route pour les statistiques par période
router.get("/:range", adminStatsController.getTimeRangeStats);

module.exports = router;
