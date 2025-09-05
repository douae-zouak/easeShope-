const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { isEmail } = require("validator");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      validate: [isEmail, "Please provide a valid email"],
      // en coullise mongoose fit verifier :
      // if (!isEmail(this.email)) {
      //   throw new Error('Please enter a valid email');
      // }
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false, // 👈 très important !
      // 🔐 Pour protéger les données sensibles (comme les mots de passe hashés) contre une exposition accidentelle.
      //  ce champ sera exclu des résultats de requêtes par défaut (comme find(), findOne(), etc.).
      //console.log(user.password); // ➡️ undefined ❌
    },
    fullName: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "buyer", "vendor"],
      default: "buyer",
    },
    isVerified: { type: Boolean, default: false },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
    lastLogin: Date,
    loginAttempts: {
      type: Number,
      default: 0,
    },
    accountLockedUntil: {
      type: Date,
    },
    profilePhoto: { type: String, default: "" },
    phoneNumber: Number,
  },
  { timestamps: true }
);
// createdAt and updateAt fields will be automatically added into the document

// function (next) {} :
// Crée son propre contexte this, lié à l'instance du document Mongoose.
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (error) {
    next(error);
    // elle sert à transférer l'erreur à un middleware de gestion d’erreurs dans Express, et interrompt le reste du traitement de la requête.
  }
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("user", userSchema);
