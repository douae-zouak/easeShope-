const mongoose = require("mongoose");

const refreshToken = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    // le type utilisé par MongoDB pour identifier de manière unique un document
    required: true,
    ref: "User",
    // permet de faire une référence à un autre modèle.
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "1d", // Automatically delete after 1 day
  },
  deviceId: String,
});

module.exports = mongoose.model("refreshToken", refreshToken);
