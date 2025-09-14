import {
  LayoutDashboard,
  Package,
  User,
  ShoppingBag,
  Repeat2,
  Users,
} from "lucide-react";
import React from "react";
import { useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useProductStore } from "../store/product.store";

const SidebarAdmin = () => {
  const location = useLocation(); // Pour détecter la page active
  const navigate = useNavigate();

  const { getPendingProducts, pendingProducts } = useProductStore();

  // Fonction pour vérifier si un lien est actif
  const isActive = (path) => location.pathname === path;

  // Sauvegarder le dernier chemin visité
  useEffect(() => {
    localStorage.setItem("lastPath", location.pathname);
  }, [location]);

  // Restaurer au chargement
  useEffect(() => {
    const lastPath = localStorage.getItem("lastPath");
    if (lastPath && lastPath !== location.pathname) {
      navigate(lastPath);
    }
  }, []);

  useEffect(() => {
    getPendingProducts(1, 10, {
      category: "all",
      gender: "all",
      search: "",
    });
  }, []);

  return (
    <div className="flex items-center h-screen ">
      <aside
        className={`h-80 w-20 bg-[#7D6BFB] rounded-r-[3.4rem]  flex flex-col items-center justify-center relative `}
      >
        <div className="absolute -top-8 left-0 w-10 h-10 bg-[#7D6BFB]" />
        <div
          className="absolute -left-27 -top-6.5 h-24 w-60 bg-white z-50 rotate-90 "
          style={{
            clipPath: "circle(30% at 19% 10%)",
          }}
        />
        <nav className="h-full flex  items-center  justify-center">
          <ul className="flex-1 px-3">
            <SidebarItem
              icon={<LayoutDashboard size={20} />}
              text="Dashboard"
              active={isActive("/admin/dashboard")}
              link="/admin/dashboard"
            />
            <SidebarItem
              icon={<Package size={20} />}
              text="Products"
              active={
                isActive("/admin/products-activation") ||
                location.pathname.startsWith("/admin/product-details/")
              }
              alert={pendingProducts.length !== 0 ? true : false}
              link="/admin/products-activation"
            />
            <SidebarItem
              icon={<Repeat2 size={20} />}
              text="Returns"
              active={isActive("/admin/returns-requests")}
              link="/admin/returns-requests"
            />
            <SidebarItem
              icon={<Users size={20} />}
              text="Vendors"
              active={isActive("/admin/vendors")}
              link="/admin/vendors"
            />

            <SidebarItem
              icon={<User size={20} />}
              text="Profile"
              active={isActive("/admin/profile")}
              link="/admin/profile"
            />
          </ul>
        </nav>

        <div className="absolute -bottom-8 left-0 w-10 h-10 bg-[#7D6BFB]" />
        <div
          className="absolute -left-28 -bottom-[9.28rem] h-24 w-60 bg-white -rotate-270"
          style={{
            clipPath: "circle(30% at 30% 10%)",
          }}
        />
      </aside>
    </div>
  );
};

const SidebarItem = ({ icon, text, active, alert, link }) => {
  return (
    <Link to={link} className="block">
      <li
        className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group ${
          active
            ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
            : "hover:bg-indigo-50 text-gray-600"
        }`}
      >
        {/* Icône avec couleur conditionnelle */}
        <div className="group-hover:text-[#390c63] transition-colors duration-300">
          {React.cloneElement(icon, {
            className: `${
              active ? "text-[#1A032F]" : "text-[#F0EBF1]"
            } group-hover:text-[#390c63]`,
          })}
        </div>

        {alert && (
          <div
            className={`absolute right-2 w-2 h-2 rounded bg-[#1A032F] top-2 group-hover:bg-[#F0EBF1
          `}
          />
        )}

        <div
          className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-indigo-100 text-indigo-800 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}
        >
          {text}
        </div>
      </li>
    </Link>
  );
};

export default SidebarAdmin;
