import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { useAuthStore } from "./store/auth.store";

import AddProductPage from "./pages/adminPages/AddProductPage";
import ProfilePage from "./pages/adminPages/ProfilePage";
import ClientProfilePage from "./pages/clientPages/ProfilePage";
import ProductsPage from "./pages/adminPages/productsPage";
import OrdersPage from "./pages/adminPages/OrdersPage";
import ForgotPasswordPage from "./pages/authPages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/authPages/ResetPasswordPage";
import ResendEmailVerification from "./pages/authPages/ResendEmailVerification";
import { SigninPage } from "./pages/authPages/SigninPage";
import LoginPage from "./pages/authPages/LoginPage";
import EmailVerificationPage from "./pages/authPages/EmailVerificationPage";
import AuthLayout from "./layouts/AuthLayout";
import NotFoundPage from "./pages/authPages/NotFoundPage";
import VendorLayout from "./layouts/VendorLayout";
import DashboardPage from "./pages/adminPages/DashboardPage";
import EditProductPage from "./pages/adminPages/EditProductPage";

import AuthInitializer from "./components/AuthInitializer";
import HomePage from "./pages/clientPages/HomePage";
import SuccessPage from "./pages/clientPages/SuccessPage";
import CancelPage from "./pages/clientPages/CancelPage";
import ProductDetailsPage from "./pages/clientPages/ProductDetailsPage";
import CartPage from "./pages/clientPages/CartPage";
import ProductPage from "./pages/clientPages/ProductPage";
import ProductsByCategory from "./pages/clientPages/ProductsByCategory";

import { AnimatePresence } from "framer-motion";
import Transition from "./transition";
import DiscountProduct from "./pages/clientPages/DiscountProduct";
import { useEffect } from "react";
import LikePage from "./pages/clientPages/LikePage";
import Orders from "./pages/clientPages/Orders";

// protect routes that require authentication
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (!user.isVerified) {
    return <Navigate to="/auth/verify-email" replace />;
  }

  // Rôle non autorisé
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
    // tu peux créer une page Unauthorized avec un message d’erreur
  }

  return children;
};

const BuyerProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/home" replace />;
  }

  if (!user.isVerified) {
    return <Navigate to="/auth/verify-email" replace />;
  }

  // Rôle non autorisé
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
    // tu peux créer une page Unauthorized avec un message d’erreur
  }

  return children;
};

// redirect authenticated users to home page
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user.isVerified) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AuthRoutes = () => (
  <RedirectAuthenticatedUser>
    <AuthLayout>
      <Routes>
        <Route path="signin" element={<SigninPage />} />
        <Route path="verify-email" element={<EmailVerificationPage />} />
        <Route
          path="resend-verification-code"
          element={<ResendEmailVerification />}
        />
        <Route path="login" element={<LoginPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthLayout>
  </RedirectAuthenticatedUser>
);

const VendorRoutes = () => (
  <ProtectedRoute allowedRoles={["vendor"]}>
    <VendorLayout>
      <Routes>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="add-product" element={<AddProductPage />} />
        <Route path="edit-product/:id" element={<EditProductPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </VendorLayout>
  </ProtectedRoute>
);

// Appliquez la transition à chaque page
const HomeWithTransition = Transition(HomePage);
const ProductWithTransition = Transition(ProductPage);
const ProductDetailsWithTransition = Transition(ProductDetailsPage);
const CartWithTransition = Transition(CartPage);
const ProfileWithTransition = Transition(ClientProfilePage);
const NotFoundWithTransition = Transition(NotFoundPage);
const ProductsByCategoryWithTransition = Transition(ProductsByCategory);
const DiscountProductWithTransition = Transition(DiscountProduct);

const BuyerRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="home" element={<HomeWithTransition />} />
        <Route path="products" element={<ProductWithTransition />} />
        <Route
          path="products/:category"
          element={<ProductsByCategoryWithTransition />}
        />
        <Route
          path="product-details/:id"
          element={<ProductDetailsWithTransition />}
        />
        <Route
          path="discount-product"
          element={<DiscountProductWithTransition />}
        />
        <Route path="complete-payment" element={<SuccessPage />} />
        <Route path="cancel-payment" element={<CancelPage />} />

        <Route path="cart" element={<CartWithTransition />} />
        <Route path="wishlist" element={<LikePage />} />
        <Route path="orders" element={<Orders />} />
        <Route path="profile" element={<ProfileWithTransition />} />
        <Route path="*" element={<NotFoundWithTransition />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  const { isAuthenticated, checkAuth } = useAuthStore();
  console.log(isAuthenticated);

  useEffect(() => {
    (async () => {
      await checkAuth();
    })();
  }, []);

  return (
    <div>
      <AuthInitializer>
        <Routes>
          {/* Toutes les routes d'authentification */}
          <Route path="/auth/*" element={<AuthRoutes />} />

          {/* Vendor */}
          <Route path="/vendor/*" element={<VendorRoutes />} />

          {/* Buyer */}
          <Route path="/*" element={<BuyerRoutes />} />
        </Routes>
      </AuthInitializer>

      <Toaster />
    </div>
  );
}

export default App;
