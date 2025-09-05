import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const VendorLayout = ({ children }) => {
  return (
    <>
      <div className="flex h-screen">
        <div className="fixed z-10">
          <Sidebar />
        </div>

        <div className="flex-1 flex flex-col pl-20">
          <header className="fixed top-0 left-20 right-0 h-16 z-10">
            <Navbar />
          </header>

          <main className="flex-1 pl-10 pt-18 pr-10 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </>
  );
};

export default VendorLayout;
