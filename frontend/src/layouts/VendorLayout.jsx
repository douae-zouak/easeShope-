import Sidebar from "../components/Sidebar";

const VendorLayout = ({ children }) => {
  return (
    <>
      <div className="flex h-screen">
        <div className="fixed z-10">
          <Sidebar />
        </div>

        <div className="flex-1 flex flex-col pl-20">
          <main className="flex-1 pl-10 pt-7 pr-10 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </>
  );
};

export default VendorLayout;
