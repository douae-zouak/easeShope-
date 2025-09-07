import { useState } from "react";
import { useProductStore } from "../store/product.store";
import { useAuthStore } from "../store/auth.store";
import { ShoppingCart, Filter, Search, User, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const ClientNavbar = () => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { getColor, getInitial, searchProducts } = useProductStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  // const loadProducts = async () => {
  //   await getProducts(); // tu peux adapter getProducts côté store
  // };

  // useEffect(() => {
  //   getProducts();
  // }, [getProducts]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    searchProducts(value);
  };

  const handleLogout = async () => {
    await logout(); // ta fonction logout (clear store + appel backend)
    navigate("/auth/login"); // redirection vers home
  };

  const API_URL = import.meta.env.VITE_API_URL;
  const photo = user?.profilePhoto ? `${API_URL}${user.profilePhoto}` : null;

  return (
    <div className="flex justify-between items-center px-6 py-3 shadow-md bg-white">
      {/* Logo */}
      <Link to="/home">
        <img
          src="/logo.png"
          alt="logo"
          className="w-24 cursor-pointer"
          onClick={() => navigate("/")}
        />
      </Link>

      {/* Search */}
      <div className="flex items-center w-90">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-[400px] pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          <Search className="absolute left-3 top-2.5 text-gray-500 w-5 h-5" />
        </div>
      </div>

      {/* User actions */}
      <div>
        {user?.role === "buyer" ? (
          <div className="flex items-center space-x-6">
            {/* Cart */}
            <Link to="/cart">
              <button className="relative p-2 rounded-full hover:bg-gray-100 transition">
                <ShoppingCart className="w-6 h-6 text-gray-700" />
                {/* Badge d'items si tu veux */}
                {/* <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1">3</span> */}
              </button>
            </Link>

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
                    to="/profile"
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
        ) : (
          <button
            type="button"
            className="w-32 flex justify-center items-center gap-1 px-4 py-2 text-md font-medium bg-[#7D6BFB] text-white hover:bg-[#6a59d6] rounded-lg cursor-pointer transition-colors duration-200"
            onClick={() => navigate("/auth/login")}
          >
            <span>Login</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ClientNavbar;
