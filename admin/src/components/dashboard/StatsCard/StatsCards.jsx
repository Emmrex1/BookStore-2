
import React, { useEffect, useState, useContext } from "react";
import {
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingCart,
  DollarSign,
  Eye,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AdminContextApi } from "@/context/api/AdmincontexApi";
import axios from "axios";
import { toast } from "react-toastify";

const StatsCards = () => {
  const { backendUrl, token } = useContext(AdminContextApi);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      if (!token) return;

      try {
        const res = await axios.get(
          `${backendUrl}/api/auth/dashboard-stats`, 
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
          }
        );
         console.log(res)
        if (res.data.success) {
          setStats(res.data.stats);
        } else {
          setError(true);
          toast.error("Failed to load dashboard stats");
        }
      } catch (error) {
        setError(true);
        console.error("Failed to fetch stats", error);
        toast.error(error.response?.data?.message || "Network error");
      }
    };

    fetchStats();
  }, [backendUrl, token]);

  // Default values when stats are loading or error
  const items = [
    {
      title: "Total Revenue",
      value: stats
        ? `$${stats.totalRevenue?.toLocaleString() || "0"}`
        : error
        ? "N/A"
        : "...",
      change:
        stats?.revenueChange !== undefined
          ? `${stats.revenueChange.toFixed(1)}%`
          : "...",
      trend: stats?.revenueChange >= 0 ? "up" : "down",
      icon: DollarSign,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Active Users",
      value: stats ? stats.activeUsers?.toLocaleString() || "0" : error ? "N/A" : "...",
      change:
        stats?.usersChange !== undefined
          ? `${stats.usersChange.toFixed(1)}%`
          : "...",
      trend: stats?.usersChange >= 0 ? "up" : "down",
      icon: Users,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Total Orders",
      value: stats ? stats.totalOrders?.toLocaleString() || "0" : error ? "N/A" : "...",
      change:
        stats?.ordersChange !== undefined
          ? `${stats.ordersChange.toFixed(1)}%`
          : "...",
      trend: stats?.ordersChange >= 0 ? "up" : "down",
      icon: ShoppingCart,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Page Views",
      value: stats ? stats.pageViews?.toLocaleString() || "0" : error ? "N/A" : "...",
      change:
        stats?.viewsChange !== undefined
          ? `${stats.viewsChange.toFixed(1)}%`
          : "...",
      trend: stats?.viewsChange >= 0 ? "up" : "down",
      icon: Eye,
      color: "from-orange-500 to-red-500",
    },
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {items.map((stat, index) => (
        <Card
          key={index}
          className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <div
            className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-5`}
          />
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <div className="flex items-center mt-2">
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      stat.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">
                    vs last month
                  </span>
                </div>
              </div>
              <div
                className={`p-3 rounded-full bg-gradient-to-r ${stat.color}`}
              >
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;