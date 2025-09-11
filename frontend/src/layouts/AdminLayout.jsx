import Navbar from "../components/Navbar";
import SidebarAdmin from "../components/SidebarAdmin";

const VendorLayout = ({ children }) => {
  return (
    <>
      <div className="flex h-screen">
        <div className="fixed z-10">
          <SidebarAdmin />
        </div>

        <div className="flex-1 flex flex-col pl-20">
          <main className="flex-1 pl-10 pt-10 pr-10 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </>
  );
};

export default VendorLayout;
