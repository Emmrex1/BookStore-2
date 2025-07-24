import { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  BarChart3,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  PackagePlus,
  LogOut,
} from "lucide-react";
import { Toaster } from "sonner";

import StatsCards from "../dashboard/StatsCard/StatsCards";
import ChartSection from "../dashboard/ChartSection/ChartSection";
import RecentActivity from "../dashboard/RecentActivity/RecentActivity";
import UserTable from "../dashboard/UserTable/UserTable";
import ProductManagement from "../dashboard/ProductManage/ProductManage";
import ProductListTable from "../dashboard/ProductList/ProductList";

import { AdminContextApi } from "@/context/api/AdmincontexApi";
import Orders from "../dashboard/Orders/Orders";
import OrderAnalytics from "../dashboard/Analytics/Analytics";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showDropdown, setShowDropdown] = useState(false);

  const { logout, user, token } = useContext(AdminContextApi);
  const navigate = useNavigate();
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", icon: LayoutDashboard, id: "dashboard" },
    { name: "Product Management", icon: PackagePlus, id: "productManagement" },
    { name: "Product List", icon: PackagePlus, id: "productList" },
    { name: "Users", icon: Users, id: "users" },
    { name: "Orders", icon: ShoppingCart, id: "orders" },
    { name: "Analytics", icon: BarChart3, id: "analytics" },
    { name: "Settings", icon: Settings, id: "settings" },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <StatsCards />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartSection />
              <RecentActivity />
            </div>
          </div>
        );
      case "users":
        return <UserTable />;
      case "productManagement":
        return <ProductManagement />;
      case "productList":
        return <ProductListTable />;
      case "orders":
        return <Orders />;
      case "analytics":
        return <OrderAnalytics/>;
      default:
        const section = navigation.find((n) => n.id === activeSection);
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                {section?.name || "Unknown Section"}
              </h3>
              <p className="text-gray-500">This section is under development</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Toaster position="top-right" richColors />

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Emmrex Admin P
          </h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            {navigation.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    setActiveSection(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    activeSection === item.id
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md hover:bg-gray-100 mr-2"
              >
                <Menu className="h-5 w-5" />
              </button>
              <h2 className="text-2xl font-semibold text-gray-900 capitalize">
                {navigation.find((n) => n.id === activeSection)?.name}
              </h2>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button className="p-2 rounded-full hover:bg-gray-100 relative">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Profile Dropdown */}
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
                    className="w-8 h-8 rounded-full object-cover cursor-pointer border-2"
                  />
                ) : (
                  <button
                    onClick={() => navigate("/admin-login")}
                    className="flex items-center gap-1 px-3 py-1 text-sm border rounded transition"
                  >
                    Login
                  </button>
                )}

                {/* Dropdown */}
                {showDropdown && token && user && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg p-3 text-sm z-50">
                    {/* User Info */}
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
                      <div className="text-left">
                        <p className="font-medium text-gray-800 dark:text-white">
                          {user.name}
                        </p>
                      </div>
                    </div>

                    {/* Settings */}
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setShowDropdown(false);
                      }}
                      className="block w-full text-left px-3 py-2 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-700 rounded"
                    >
                      Settings
                    </button>

                    {/* Logout */}
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
            </div>
          </div>

          {/* Breadcrumb */}
          <div className="px-6 py-2 text-sm text-gray-500">
            Home / {navigation.find((n) => n.id === activeSection)?.name}
          </div>
        </header>

        {/* Main Section */}
        <main className="p-6 flex-1 overflow-y-auto">{renderContent()}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
