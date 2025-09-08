import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../../store/auth.store";
import { Check } from "lucide-react";
import { useProductStore } from "../../store/product.store";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, uploadProfilePhoto, updateProfile } = useAuthStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const fileInputRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL;
  const [previewImage, setPreviewImage] = useState(
    user?.profilePhoto ? `${API_URL}${user.profilePhoto}` : null
  );

  const { getColor, getInitial } = useProductStore();

  // Initialiser les champs avec les données utilisateur
  useEffect(() => {
    if (user) {
      setName(user.fullName || "");
      setEmail(user.email || "");
      setPhoneNumber(user.phoneNumber || "");
      setPreviewImage(
        user.profilePhoto ? `${API_URL}${user.profilePhoto}` : null
      );
    }
  }, [user, API_URL]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // First upload photo if selected
      let photoUrl = user?.profilePhoto;
      if (previewImage && fileInputRef.current.files[0]) {
        const formData = new FormData();
        formData.append("profilePhoto", fileInputRef.current.files[0]);
        photoUrl = await uploadProfilePhoto(formData);
      }

      // Update profile with all data including new photo URL
      await updateProfile({
        fullName: name,
        email,
        phoneNumber,
        profilePhoto: photoUrl,
      });

      toast.success("Profile updated successfully!");
      navigate("/vendor/dashboard");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="m-auto mt-12 w-xl p-10 bg-gray-100 rounded-lg shadow-2xl">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center">
        Update Profil
      </h2>

      <div className="flex flex-col items-center">
        <div
          className="relative w-32 h-32 rounded-full overflow-hidden cursor-pointer group shadow-lg"
          onClick={triggerFileInput}
        >
          {previewImage ? (
            <img
              src={previewImage}
              alt="Profile preview"
              className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
            />
          ) : (
            <div
              className={`w-full h-full rounded-full border flex items-center justify-center text-3xl font-medium hover:ring-2 hover:ring-gray-300 ${getColor(
                user?.fullName
              )}`}
            >
              {" "}
              {getInitial(user?.fullName)}
            </div>
          )}
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
            <span className="text-white text-sm font-medium">Change Photo</span>
          </div>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
      </div>

      <div className="mb-6">
        <label className="text-md" htmlFor="full-name">
          Full Name
        </label>
        <input
          type="text"
          required
          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-200 focus:ring-1 focus:ring-indigo-500  transition-all duration-200"
          onChange={(e) => setName(e.target.value)}
          value={name}
          id="full-name"
        />
      </div>

      <div className="mb-6">
        <label className="text-md" htmlFor="email-adress">
          Email Adress
        </label>
        <input
          type="text"
          required
          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-200 focus:ring-1 focus:ring-indigo-500  transition-all duration-200"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          id="email-adress"
        />
      </div>

      <div className="mb-6">
        <label className="text-md" htmlFor="phone-number">
          Phone Number
        </label>
        <input
          type="text"
          required
          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-200 focus:ring-1 focus:ring-indigo-500  transition-all duration-200"
          onChange={(e) => setPhoneNumber(e.target.value)}
          value={phoneNumber}
          id="phone-number"
        />
      </div>

      <button
        type="button"
        className="w-full flex justify-center items-center gap-1 px-4 py-2 text-md font-medium bg-[#7D6BFB] text-white hover:bg-[#6a59d6] rounded-lg cursor-pointer transition-colors duration-200"
        onClick={handleSubmit}
      >
        <Check size={22} />
        <span>Save Your Profil</span>
      </button>
    </div>
  );
};

export default ProfilePage;