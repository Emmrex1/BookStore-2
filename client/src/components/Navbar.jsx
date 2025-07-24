// src/components/Navbar.jsx
import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  RiShoppingBag4Line,
  RiUserLine,
  RiMenuLine,
  RiCloseLine,
  RiNotificationLine,
} from "react-icons/ri";
import { ShopContext } from "../context/ShopContext";

function Navbar() {
  const {
    navigate,
    token,
    user,
    getCartCount,
    logout,
    cartItems,
    notifications = [],
  } = useContext(ShopContext);

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [animateCart, setAnimateCart] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "Contact", href: "/contact" },
    { name: "About", href: "/about" },
  ];

  useEffect(() => {
    const root = document.documentElement;
    theme === "dark"
      ? root.classList.add("dark")
      : root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".dropdown-menu")) setShowDropdown(false);
      if (!e.target.closest(".notification-dropdown"))
        setShowNotifications(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setAnimateCart(true);
    const timer = setTimeout(() => setAnimateCart(false), 300);
    return () => clearTimeout(timer);
  }, [cartItems]);

  const avatarBorder = theme === "dark" ? "border-white" : "border-gray-800";

  return (
    <header className="sticky top-0 left-0 w-full z-50 bg-white dark:bg-slate-900 shadow-sm">
      <div className="max-w-screen-xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-bold text-gray-900 dark:text-white"
        >
          Book<span className="text-orange-500">Store</span>
        </Link>

        <nav className="hidden lg:flex space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={`text-sm font-medium transition hover:text-orange-500 ${
                location.pathname === link.href
                  ? "text-orange-500"
                  : "text-gray-700 dark:text-white"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4 relative">
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            title="Toggle Theme"
            className="text-xl text-gray-700 dark:text-white"
          >
            {theme === "dark" ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 3v1m0 16v1m8.66-13.66l-.71.71M5.05 18.95l-.71.71M21 12h-1M4 12H3m16.66 4.66l-.71-.71M6.34 6.34l-.71-.71M12 6a6 6 0 100 12 6 6 0 000-12z"
                />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8 8 0 1010.586 10.586z" />
              </svg>
            )}
          </button>

          {/* Notification Bell */}
          <div className="relative notification-dropdown">
            <button
              title="Notifications"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative text-2xl text-gray-700 dark:text-white"
            >
              <RiNotificationLine />
              {notifications.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {notifications.length}
                </span>
              )}
            </button>

            {/* Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 shadow-lg rounded-md z-50 notification-dropdown">
                <div className="p-3 border-b border-gray-200 dark:border-slate-700 font-semibold text-gray-700 dark:text-white">
                  Notifications
                </div>
                <ul className="max-h-64 overflow-y-auto text-sm">
                  {notifications.slice(0, 4).map((n, i) => (
                    <li
                      key={i}
                      className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer"
                    >
                      {n.message}
                    </li>
                  ))}
                </ul>
                <div className="p-2 text-center border-t border-gray-200 dark:border-slate-700">
                  <Link
                    to="/notifications"
                    className="text-xs text-blue-500 hover:underline"
                    onClick={() => setShowNotifications(false)}
                  >
                    View All
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Cart */}
          <Link to="/cart" className="relative">
            <RiShoppingBag4Line className="text-2xl text-gray-700 dark:text-white" />
            {getCartCount() > 0 && (
              <span
                className={`absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full transition-transform duration-300 ${
                  animateCart ? "scale-125" : "scale-100"
                }`}
              >
                {getCartCount()}
              </span>
            )}
          </Link>

          {/* Avatar / Login */}
          <div className="relative">
            {token && user ? (
              <img
                onClick={() => setShowDropdown(!showDropdown)}
                src={
                  user.avatar
                    ? user.avatar
                    : `https://ui-avatars.com/api/?name=${user.name}&background=random&color=fff&bold=true`
                }
                alt="avatar"
                className={`w-8 h-8 rounded-full object-cover cursor-pointer border-2 ${avatarBorder}`}
              />
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="flex items-center gap-1 px-3 py-1 text-sm border rounded transition"
              >
                Login <RiUserLine />
              </button>
            )}

            {showDropdown && token && user && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg p-3 text-sm z-50 dropdown-menu">
                <div className="flex items-center gap-2 mb-3">
                  <img
                    src={
                      user.avatar
                        ? user.avatar
                        : `https://ui-avatars.com/api/?name=${user.name}&background=random&color=fff&bold=true`
                    }
                    className="w-8 h-8 rounded-full object-cover border"
                    alt="User"
                  />
                  <button
                    onClick={() => {
                      navigate("/profile-settings");
                      setShowDropdown(false);
                    }}
                    className={`font-medium text-left ${
                      location.pathname === "/profile-settings"
                        ? "text-orange-500"
                        : "text-gray-700 dark:text-white"
                    } hover:underline`}
                  >
                    {user.name}
                  </button>
                </div>

                <button
                  onClick={() => {
                    navigate("/profile");
                    setShowDropdown(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-700 rounded"
                >
                  Settings
                </button>
                <button
                  onClick={() => {
                    navigate("/order");
                    setShowDropdown(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-700 rounded"
                >
                  Orders
                </button>
                <button
                  onClick={() => {
                    logout();
                    setShowDropdown(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-600 rounded"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-gray-700 dark:text-white"
          >
            {mobileMenuOpen ? (
              <RiCloseLine className="text-2xl" />
            ) : (
              <RiMenuLine className="text-2xl" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pb-6 bg-white dark:bg-slate-800 border-t dark:border-gray-700">
          <ul className="flex flex-col gap-4 pt-4">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.href}
                  className="block text-gray-700 dark:text-white hover:text-orange-500"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/cart"
                className="flex items-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <RiShoppingBag4Line className="text-xl" /> Cart
              </Link>
            </li>
            <li>
              {token ? (
                <>
                  <button
                    onClick={() => {
                      navigate("/orders");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-gray-700 dark:text-white hover:bg-orange-100 dark:hover:bg-slate-700 rounded"
                  >
                    Orders
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-600 rounded"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="block px-3 py-2 text-gray-700 dark:text-white hover:text-orange-500"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}

export default Navbar;
