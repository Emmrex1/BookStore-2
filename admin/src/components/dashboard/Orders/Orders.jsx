
import React, { useState, useEffect, useContext, useMemo } from "react";
import { AdminContextApi } from "@/context/api/AdmincontexApi";
import AnalyticsDashboard from "../Analytics/Analytics";
import FiltersSection from "./FiltersSection/FilterSection";
import OrdersList from "./OrderList/OrdersList";
import OrderDetailsModal from "./OrderDetailsModal/OrderDetailsModal";
import { FaChartLine, FaFilter } from "react-icons/fa";
import { toast } from "sonner";
import axios from "axios";


const Orders = () => {
  const { backendUrl, token, currency } = useContext(AdminContextApi);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 6;
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateRange, setDateRange] = useState([null, null]);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("All");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  // Status options
  const statusOptions = [
    { value: "All", label: "All Statuses", color: "gray" },
    { value: "Order Placed", label: "Order Placed", color: "gray" },
    { value: "Packing", label: "Packing", color: "yellow" },
    { value: "Shipped", label: "Shipped", color: "blue" },
    { value: "Out for delivery", label: "Out for Delivery", color: "orange" },
    { value: "Delivered", label: "Delivered", color: "green" },
  ];

  // Payment method options
  const paymentMethodOptions = [
    { value: "All", label: "All Methods" },
    { value: "cod", label: "Cash on Delivery" },
    { value: "stripe", label: "Credit Card (Stripe)" },
    { value: "paypal", label: "PayPal" },
  ];

  // Payment status options
  const paymentStatusOptions = [
    { value: "All", label: "All Statuses" },
    { value: "true", label: "Paid" },
    { value: "false", label: "Pending" },
  ];

  // Fetch orders
  const fetchAllOrders = async () => {
    if (!token) return;
    setLoading(true);

    try {
        const response = await axios.post(
        `${backendUrl}/api/order/list`,
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setOrders(response.data.orders);
        setFilteredOrders(response.data.orders);
      } else {
        toast.error(response.data.message || "Failed to fetch orders.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters
  useEffect(() => {
    let result = orders;

   if (searchTerm) {
     const lowerSearch = searchTerm.toLowerCase();

     result = result.filter(
       (order) =>
         (order?.address?.firstName || "")
           .toLowerCase()
           .includes(lowerSearch) ||
         (order?._id || "").toLowerCase().includes(lowerSearch) ||
         (order?.address?.phone || "").includes(searchTerm)
     );
   }


    if (statusFilter !== "All") {
      result = result.filter((order) => order.status === statusFilter);
    }

    if (paymentMethodFilter !== "All") {
      result = result.filter(
        (order) => order.paymentMethod === paymentMethodFilter
      );
    }

    if (paymentStatusFilter !== "All") {
      const isPaid = paymentStatusFilter === "true";
      result = result.filter((order) => order.payment === isPaid);
    }

    const [startDate, endDate] = dateRange;
    if (startDate && endDate) {
      result = result.filter((order) => {
        const orderDate = new Date(order.date);
        return orderDate >= startDate && orderDate <= endDate;
      });
    }

    setFilteredOrders(result);
    setCurrentPage(1);
  }, [
    orders,
    searchTerm,
    statusFilter,
    paymentMethodFilter,
    paymentStatusFilter,
    dateRange,
  ]);

  // Order analytics data
  const analyticsData = useMemo(() => {
    const statusCounts = {
      "Order Placed": 0,
      Packing: 0,
      Shipped: 0,
      "Out for delivery": 0,
      Delivered: 0,
    };

    const revenueByStatus = { ...statusCounts };
    const paymentMethodCounts = { cod: 0, stripe: 0, paypal: 0 };

    let totalRevenue = 0;
    let completedRevenue = 0;
    let pendingRevenue = 0;

    orders.forEach((order) => {
      statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;

      if (order.payment) {
        revenueByStatus[order.status] += order.amount;
        totalRevenue += order.amount;
        if (order.status === "Delivered") completedRevenue += order.amount;
      } else {
        pendingRevenue += order.amount;
      }

      if (order.paymentMethod) {
        paymentMethodCounts[order.paymentMethod]++;
      }
    });

    const paymentMethods = Object.keys(paymentMethodCounts).filter(
      (method) => paymentMethodCounts[method] > 0
    );

    return {
      statusCounts,
      revenueByStatus,
      paymentMethodCounts,
      totalRevenue,
      completedRevenue,
      pendingRevenue,
      totalOrders: orders.length,
      chartData: {
        labels: Object.keys(statusCounts),
        datasets: [
          {
            label: "Orders by Status",
            data: Object.values(statusCounts),
            backgroundColor: [
              "rgba(107, 114, 128, 0.7)",
              "rgba(234, 179, 8, 0.7)",
              "rgba(59, 130, 246, 0.7)",
              "rgba(249, 115, 22, 0.7)",
              "rgba(34, 197, 94, 0.7)",
            ],
            borderWidth: 1,
          },
        ],
      },
      paymentMethodChartData: {
        labels: paymentMethods.map((method) => {
          if (method === "cod") return "Cash on Delivery";
          if (method === "stripe") return "Credit Card";
          if (method === "paypal") return "PayPal";
          return method;
        }),
        datasets: [
          {
            data: paymentMethods.map((method) => paymentMethodCounts[method]),
            backgroundColor: [
              "rgba(59, 130, 246, 0.7)",
              "rgba(34, 197, 94, 0.7)",
              "rgba(234, 179, 8, 0.7)",
            ],
            borderWidth: 1,
          },
        ],
      },
    };
  }, [orders]);

  // Update order status
  const statusHandler = async (event, orderId) => {
    try {
     const response = await axios.post(
        `${backendUrl}/api/order/status`,
        { orderId, status: event.target.value },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Order status updated");
        await fetchAllOrders();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setPaymentMethodFilter("All");
    setPaymentStatusFilter("All");
    setDateRange([null, null]);
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  return (
    <div className="px-4 sm:px-6 py-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Order Management
            </h1>
            <p className="text-gray-600 mt-1">
              {filteredOrders.length} orders found •{" "}
              {analyticsData.completedRevenue.toFixed(2)} {currency} revenue
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors ${
                showAnalytics
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <FaChartLine />
              <span>{showAnalytics ? "Hide" : "Show"} Analytics</span>
            </button>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors ${
                showFilters
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <FaFilter />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Analytics Dashboard */}
        {showAnalytics && (
          <AnalyticsDashboard
            analyticsData={analyticsData}
            statusOptions={statusOptions}
            currency={currency}
          />
        )}

        {/* Filters Section */}
        {showFilters && (
          <FiltersSection
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            dateRange={dateRange}
            setDateRange={setDateRange}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            paymentMethodFilter={paymentMethodFilter}
            setPaymentMethodFilter={setPaymentMethodFilter}
            paymentStatusFilter={paymentStatusFilter}
            setPaymentStatusFilter={setPaymentStatusFilter}
            statusOptions={statusOptions}
            paymentMethodOptions={paymentMethodOptions}
            paymentStatusOptions={paymentStatusOptions}
            clearFilters={clearFilters}
          />
        )}

        {/* Orders List */}
        <OrdersList
          loading={loading}
          ordersPerPage={ordersPerPage}
          currentOrders={currentOrders}
          filteredOrders={filteredOrders}
          currency={currency}
          statusHandler={statusHandler}
          statusOptions={statusOptions}
          setSelectedOrder={setSelectedOrder}
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />

        {/* Order Details Modal */}
        {selectedOrder && (
          <OrderDetailsModal
            selectedOrder={selectedOrder}
            closeOrderDetails={() => setSelectedOrder(null)}
            statusHandler={statusHandler}
            statusOptions={statusOptions}
            currency={currency}
          />
        )}
      </div>
    </div>
  );
};

export default Orders;