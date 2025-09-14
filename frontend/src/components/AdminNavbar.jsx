import { Link, useNavigate } from "react-router-dom";
import { Bell, Search, User, LogOut } from "lucide-react";
import { useAuthStore } from "../store/auth.store";
import { useProductStore } from "../store/product.store";
import { useState } from "react";

const AdminNavbar = () => {
  const { user, logout } = useAuthStore();
  const { getColor, getInitial } = useProductStore();

  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout(); // ta fonction logout (clear store + appel backend)
    navigate("/home"); // redirection vers home
  };

  const API_URL = import.meta.env.VITE_API_URL;
  const photo = user?.profilePhoto ? `${API_URL}${user.profilePhoto}` : null;

  return (
    <nav className="w-full pl-40 px-6 py-3 flex items-center justify-end ">
      <div className="flex items-center space-x-6">
        {/* Notifications */}
        <button className="relative p-2 rounded-full hover:bg-gray-100 transition">
          <Bell className="w-6 h-6 text-gray-700" />
          <span className="absolute top-1 right-1 bg-[#8400ff] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            3
          </span>
        </button>

        {/* Profile avatar */}
        <div className="relative">
          <button onClick={() => setOpen(!open)}>
            {photo ? (
              <img
                src={photo}
                alt="Profile"
                className="w-10 h-10 rounded-full border hover:ring-2 hover:ring-indigo-500 transition"
              />
            ) : (
              <div
                className={`w-10 h-10 rounded-full border flex items-center justify-center text-xl font-medium hover:ring-2 hover:ring-gray-300 ${getColor(
                  user?.fullName
                )}`}
              >
                {getInitial(user?.fullName)}
              </div>
            )}
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
              <Link
                to="/vendor/profile"
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 hover:rounded-lg"
                onClick={() => setOpen(false)}
              >
                <User size={16} />
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 hover:rounded-lg"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
