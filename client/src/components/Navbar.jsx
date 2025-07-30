
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
  const [scrollDir, setScrollDir] = useState("up");
  const [lastScrollY, setLastScrollY] = useState(0);
  const [animateCart, setAnimateCart] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "Contact", href: "/contact" },
    { name: "About", href: "/about" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastScrollY && currentY > 100) {
        setScrollDir("down");
      } else {
        setScrollDir("up");
      }
      setLastScrollY(currentY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

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
    <>
      {/* Navbar */}
      <header
        className={`sticky top-0 left-0 w-full z-50 bg-white dark:bg-slate-900 shadow-sm transition-transform duration-300 ${
          scrollDir === "down" ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="max-w-screen-xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Mobile Menu Icon */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-gray-700 dark:text-white"
          >
            {mobileMenuOpen ? (
              <RiCloseLine size={24} />
            ) : (
              <RiMenuLine size={24} />
            )}
          </button>

          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold text-gray-900 dark:text-white"
          >
            Book<span className="text-orange-500">Store</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex space-x-8 mx-auto">
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

          {/* Right Icons */}
          <div className="flex items-center gap-4 relative">
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-xl text-gray-700 dark:text-white"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>

            {/* Notifications */}
            <div className="relative notification-dropdown hidden lg:block">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative text-2xl text-gray-700 dark:text-white"
              >
                <RiNotificationLine />
                {notifications.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 py-0.5 rounded-full">
                    {notifications.length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 shadow-lg rounded-md z-50 notification-dropdown">
                  <div className="p-3 font-semibold border-b dark:border-slate-700">
                    Notifications
                  </div>
                  <ul className="max-h-64 overflow-y-auto text-sm">
                    {notifications.slice(0, 4).map((n, i) => (
                      <li
                        key={i}
                        className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer"
                      >
                        {n.message}
                      </li>
                    ))}
                  </ul>
                  <div className="p-2 text-center border-t dark:border-slate-700">
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

            {/* Cart Icon */}
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

            {/* User Avatar / Login */}
            <div className="relative">
              {token && user ? (
                <img
                  onClick={() => setShowDropdown(!showDropdown)}
                  src={
                    user.avatar
                      ? user.avatar
                      : `https://ui-avatars.com/api/?name=${user.name}&background=random`
                  }
                  alt="avatar"
                  className={`w-8 h-8 rounded-full border-2 object-cover cursor-pointer ${avatarBorder}`}
                />
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="flex items-center gap-1 px-3 py-1 text-sm border rounded"
                >
                  Login <RiUserLine />
                </button>
              )}

              {showDropdown && token && user && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 shadow-lg rounded p-3 z-50 dropdown-menu">
                  <div className="flex items-center gap-2 mb-3">
                    <img
                      src={
                        user.avatar
                          ? user.avatar
                          : `https://ui-avatars.com/api/?name=${user.name}&background=random`
                      }
                      className="w-8 h-8 rounded-full"
                      alt="User"
                    />
                    <button
                      onClick={() => {
                        navigate("/profile-settings");
                        setShowDropdown(false);
                      }}
                      className="text-sm font-medium hover:underline"
                    >
                      {user.name}
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setShowDropdown(false);
                    }}
                    className="block w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-slate-700"
                  >
                    Settings
                  </button>
                  <button
                    onClick={() => {
                      navigate("/orders");
                      setShowDropdown(false);
                    }}
                    className="block w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-slate-700"
                  >
                    Orders
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setShowDropdown(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-600/20"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-40"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-0 left-0 z-50 h-full w-4/5 max-w-xs bg-white dark:bg-slate-900 shadow-lg p-6 animate-slide-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Menu
              </h2>
              <button onClick={() => setMobileMenuOpen(false)}>
                <RiCloseLine
                  size={24}
                  className="text-gray-700 dark:text-white"
                />
              </button>
            </div>
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-medium text-gray-800 dark:text-white hover:text-orange-500 transition"
                >
                  {link.name}
                </Link>
              ))}
              <hr className="my-4 border-gray-300 dark:border-gray-700" />
              {token && user ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-base font-medium text-gray-800 dark:text-white hover:text-orange-500"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/order"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-base font-medium text-gray-800 dark:text-white hover:text-orange-500"
                  >
                    Orders
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-left text-base text-red-600 hover:text-red-800 transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    navigate("/login");
                    setMobileMenuOpen(false);
                  }}
                  className="text-left text-base font-medium text-gray-800 dark:text-white hover:text-orange-500 transition"
                >
                  Login
                </button>
              )}
            </nav>
          </div>
        </>
      )}

      {/* Floating Cart Button */}
      <button
        onClick={() => navigate("/cart")}
        className="fixed bottom-5 right-5 z-50 bg-orange-500 text-white p-4 rounded-full shadow-lg hover:bg-orange-600 transition-all duration-300"
      >
        <div className="relative">
          <RiShoppingBag4Line className="text-2xl" />
          {getCartCount() > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
              {getCartCount()}
            </span>
          )}
        </div>
      </button>
    </>
  );
}

export default Navbar;
