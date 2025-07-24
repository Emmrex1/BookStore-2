// App.jsx
import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import Navbar from "./components/Navbar";
import Home from "./pages/home/Home";
import Shop from "./pages/Shop/Shop";
import Contact from "./pages/Contact/Contact";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import LoginPage from "./pages/Auth/Login/Login";
import Register from "./pages/Auth/Register/Register";
import ForgotPassword from "./pages/Auth/forgotpassword/forgotpassword";
import ResetPassword from "./pages/Auth/resetpassword/resetpassword";
import ResetSuccess from "./pages/Auth/ResetSuccess/ResetSuccess";
import ProfileSettings from "./setting/Profile/profile";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import ProductDetails from "./pages/ProductDetails/ProductDetails";
import ChangePassword from "./setting/Profile/ChangePassword/ChangePassword";
import Order from "./pages/Order/Order";
import Notifications from "./pages/Notifications/Notifications";
import About from "./pages/About/About";
import Error404 from "./pages/Error404/Error404";
import ContactForm from "./pages/Contact/Contact";


function App() {
  const location = useLocation();
  const currentPath = location.pathname;

  // Define paths where navbar should be hidden
  const noNavbarPaths = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-success",
    "/reset-password",
  ];

  // Check if current path should hide navbar
  const shouldHideNavbar = noNavbarPaths.some((path) =>
    currentPath.startsWith(path)
  );

  return (
    <div className="dark:bg-slate-900 dark:text-white min-h-screen">
      {!shouldHideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/product/:id" element={<ProductDetails />} />

        {/* Authentication routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/reset-success" element={<ResetSuccess />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/shop" element={<Shop />} />
          <Route path="/place-order" element={<PlaceOrder />} />
          <Route path="/order" element={<Order />} />
          <Route path="/profile" element={<ProfileSettings />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/contact" element={<ContactForm />} />
        </Route>

        <Route path="*" element={<Error404 />} />
      </Routes>

      <Toaster richColors position="top-right" />
    </div>
  );
}

export default App;
