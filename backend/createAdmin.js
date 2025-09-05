const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/user.model"); // ton modèle mongoose

async function createAdmin() {
  try {
    await mongoose.connect(
      "mongodb+srv://douaezouak6:SMNmxIEileI7K6DO@cluster0.d9ddy0c.mongodb.net/auth_db?retryWrites=true&w=majority&"
    );

    // Mot de passe en clair (tu peux choisir)
    const plainPassword = "admin1234";

    // Hachage
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Création de l’admin
    const adminUser = new User({
      email: "douaezouak96@gmail.com",
      password: hashedPassword,
      fullName: "Admin User",
      role: "admin", // très important
      isVerified: true,
    });

    await adminUser.save();
    console.log("✅ Admin créé avec succès !");
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Erreur :", error);
  }
}

createAdmin();
