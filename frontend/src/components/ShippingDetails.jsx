import { Calendar, Package, RotateCcw, Truck } from "lucide-react";

const ShippingDetails = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
      <h1 className="text-gray-900 text-2xl font-medium font-title">
        Shipping
      </h1>
      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center">
          <Truck size={20} className="text-indigo-600" />
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">Free Shipping</p>
            <p className="text-sm text-gray-500">
              Enjoy fast and free delivery
            </p>
          </div>
        </div>

        <div className="flex items-center">
          <RotateCcw size={20} className="text-indigo-600" />
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">Free Returns</p>
            <p className="text-sm text-gray-500">10 days to change your mind</p>
          </div>
        </div>

        <div className="flex items-center">
          <Calendar size={20} className="text-indigo-600" />
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">Delivery Time</p>
            <p className="text-sm text-gray-500">Shipped within 48h</p>
          </div>
        </div>

        <div className="flex items-center">
          <Package size={20} className="text-indigo-600" />
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">Package</p>
            <p className="text-sm text-gray-500">Full protection</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingDetails;
