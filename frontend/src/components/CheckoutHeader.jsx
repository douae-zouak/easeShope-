import { ShoppingBag } from "lucide-react";

const CheckoutHeader = () => (
  <header className="py-4 flex items-center justify-between ml-10">
    <div className="flex items-center">
      <ShoppingBag className="h-8 w-8 text-purple-600 mr-2" />
      <h1 className="text-3xl md:text-4xl text-gray-900 font-title">
        Your Shopping Cart
      </h1>
    </div>
  </header>
);

export default CheckoutHeader