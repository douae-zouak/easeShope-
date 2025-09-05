import { useEffect } from "react";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useProductStore } from "../../store/product.store";
import PaymentSidebar from "../../components/PaymentSidebar";
import CartFooter from "../../components/CartFooter";
import CheckoutHeader from "../../components/CheckoutHeader";
import CartItem from "../../components/CartItem";

export default function CartPage() {
  const { getCart, cart, updateQuantity, deleteProductFromCart, total } =
    useProductStore();

  useEffect(() => {
    getCart();
  }, []);

  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <CheckoutHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center gap-4 bg-white rounded-lg shadow-md p-6 text-center max-w-md mx-auto">
            <ShoppingBag className="h-16 w-16 text-purple-400 mb-4" />
            <h2 className="text-xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">
              Start shopping to add items to your cart
            </p>
            <Link to="/home">
              <button className="flex items-center text-purple-600 hover:text-purple-700 transition-colors duration-200 font-medium cursor-pointer px-4 py-2 border border-purple-600 rounded-lg">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Continue Shopping
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-100">
      {/* Colonne principale (cart + footer) */}
      <div className="flex-1 p-4 lg:p-8">
        <CheckoutHeader />

        {/* Zone scrollable */}
        <div className="flex-1 flex flex-col gap-4 overflow-y-auto h-[calc(100vh-180px)]">
          {cart.map((item) => (
            <CartItem
              key={item._id}
              item={item}
              updateQuantity={updateQuantity}
              deleteProductFromCart={deleteProductFromCart}
            />
          ))}
        </div>

        {/* Footer */}
        <CartFooter total={total} />
      </div>

      {/* Sidebar paiement fixe à droite */}
      <div className="w-full lg:w-auto">
        <PaymentSidebar total={total} cart={cart} />
      </div>
    </div>
  );
}
