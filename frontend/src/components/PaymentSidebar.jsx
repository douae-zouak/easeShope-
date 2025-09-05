import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import toast from "react-hot-toast";

import { useProductStore } from "../store/product.store";
import { useState } from "react";
import { Building2, Mail, MapPin, MapPinned, Phone } from "lucide-react";

const LocationInfo = ({
  city,
  setCity,
  postalCode,
  setPostalCode,
  street,
  setStreet,
  phoneNumber,
  setPhoneNumber,
}) => {
  return (
    <div className="max-w-md mx-auto p-6 ">
      <div className="flex flex-col space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              className="w-full pl-10 pr-3 py-4 rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-700 transition duration-200 outline-none"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-700">
              <Building2 size={20} />
            </div>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Postal Code"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              maxLength="19"
              required
              className="w-full pl-10 pr-3 py-4 rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-700 transition duration-200 outline-none"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-700">
              <MapPin size={20} />
            </div>
          </div>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Street"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            required
            className="w-full pl-10 pr-3 py-4 rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-700 transition duration-200 outline-none"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-700">
            <MapPinned size={20} />
          </div>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            className="w-full pl-10 pr-3 py-4 rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-700 transition duration-200 outline-none"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-700">
            <Phone size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

const BankCheckoutForm = ({
  total,
  cart,
  city,
  street,
  postalCode,
  phoneNumber,
}) => {
  const { checkout, approve } = useProductStore();
  const navigate = useNavigate();

  const initialOptions = {
    clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
    currency: "USD",
    intent: "capture",
    components: "buttons", // Seulement les boutons
    enableFunding: "paypal", // Seulement PayPal
    disableFunding: "card,venmo", // Désactive les autres méthodes
    dataSdkIntegrationSource: "developer-studio",
  };

  const styles = {
    shape: "rect",
    layout: "vertical",
    color: "gold",
  };

  const items = Array.isArray(cart) ? cart : [];

  const onCreateOrder = async () => {
    try {
      const result = await checkout(total, items);

      if (!result.orderId) {
        throw new Error("No order ID received from server");
      }

      return result.orderId;
    } catch (error) {
      console.error("Error in onCreateOrder:", error);
      toast.error("Failed to create order: " + error.message);

      // Pour PayPal Buttons, on doit retourner une promesse rejetée
      throw new Error("ORDER_CREATION_FAILED");
    }
  };

  const onApprove = async (data, actions) => {
    try {
      console.log("Payment approved:", data);

      // Option 1: Capturer via PayPal
      const details = await actions.order.capture();
      console.log("Payment captured:", details);

      // Capturer via notre backend avec les données d'adresse
      const addressData = {
        total,
        city,
        postalCode,
        street,
        phoneNumber,
      };

      const result = await approve(data.orderID, addressData);
      console.log("Backend capture result:", result);

      navigate("/complete-payment", {
        state: {
          orderId: data.orderID,
          paymentData: details,
          order: result.order,
        },
      });
    } catch (error) {
      console.error("Error in onApprove:", error);
      toast.error("Payment failed: " + error.message);
      navigate("/cancel-payment");
    }
  };

  const onError = (err) => {
    console.error("PayPal error:", err);
    toast.error("Payment error occurred");
  };

  const onCancel = (data) => {
    console.log("Payment cancelled:", data);
    navigate("/cancel-payment");
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <PayPalButtons
        style={styles}
        createOrder={onCreateOrder}
        onApprove={onApprove}
        onError={onError}
        onCancel={onCancel}
        disabled={!city || !postalCode || !street || !phoneNumber}
      />
    </PayPalScriptProvider>
  );
};

const PaymentSidebar = ({ total, cart }) => {
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [street, setStreet] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col justify-between h-screen w-[500px] p-6 bg-white shadow-xl "
    >
      <div>
        <h2 className="text-2xl font-title mb-6">Shipping Details</h2>

        <motion.div
          initial={{ opacity: 0, x: 500 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.5 }}
          className="mb-6"
        >
          <img
            src="/carte-credit-noire.png"
            alt="credit-card"
            className="w-full mx-auto"
          />
        </motion.div>
      </div>

      <div className="mb-5">
        <LocationInfo
          city={city}
          setCity={setCity}
          postalCode={postalCode}
          setPostalCode={setPostalCode}
          street={street}
          setStreet={setStreet}
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
        />

        <BankCheckoutForm
          total={total}
          cart={cart}
          city={city}
          postalCode={postalCode}
          street={street}
          phoneNumber={phoneNumber}
        />
      </div>
    </motion.div>
  );
};

export default PaymentSidebar;
