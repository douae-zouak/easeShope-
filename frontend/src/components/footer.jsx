import React from "react";
import {
  CreditCard,
  Truck,
  Shield,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Heart,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black text-gray-200 mt-15">
      {/* Trust Badges */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center">
              <div className="bg-gray-800 p-3 rounded-full mr-4">
                <Truck size={24} className="text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold">Free Shipping</h3>
                <p className="text-sm text-gray-400">On orders over 500DH</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="bg-gray-800 p-3 rounded-full mr-4">
                <CreditCard size={24} className="text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold">Secure Payment</h3>
                <p className="text-sm text-gray-400">Safe & fast checkout</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="bg-gray-800 p-3 rounded-full mr-4">
                <Shield size={24} className="text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold">Satisfaction Guarantee</h3>
                <p className="text-sm text-gray-400">10-day return policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-30">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">ShopEase</h3>
            <p className="text-gray-400 mb-4">
              Your one-stop destination for all your shopping needs. Quality
              products at affordable prices.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Track Order
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Shipping & Returns
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Size Guide
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <MapPin className="mt-1 mr-3 flex-shrink-0" size={18} />
                <span className="text-gray-400">Rabat, Morocco</span>
              </div>
              <div className="flex items-center">
                <Phone className="mr-3" size={18} />
                <span className="text-gray-400">+212 7 63 81 88 93</span>
              </div>
              <div className="flex items-center">
                <Mail className="mr-3" size={18} />
                <span className="text-gray-400">support@shopease.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto">
            <h3 className="text-lg font-semibold text-center mb-2">
              Subscribe to Our Newsletter
            </h3>
            <p className="text-gray-400 text-center mb-4">
              Get the latest updates on new products and upcoming sales
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-3 bg-gray-800 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
              <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-r-md font-medium transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods & Copyright */}
      <div className="container mx-auto px-4 py-6">
        <p className="text-gray-500 text-sm mb-4 md:mb-0 text-center">
          © 2023 ShopEase. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
