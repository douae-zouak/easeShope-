const User = require("../../models/user.model");

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, profilePhoto } = req.body;

    const updatedVendor = await User.findByIdAndUpdate(
      req.user._id,
      {
        fullName,
        email,
        phoneNumber,
        profilePhoto,
      },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({ user: updatedVendor });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const profilePhotoUrl = `/uploads/profile-photos/${req.file.filename}`;

    // Update admin with new photo URL
    await User.findByIdAndUpdate(req.user._id, {
      profilePhoto: profilePhotoUrl,
    });

    res.json({ profilePhotoUrl });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
