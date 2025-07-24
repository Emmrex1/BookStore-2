import React, { useState, useEffect, useContext, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaBoxOpen, FaSearch, FaFileExport, FaFilter, FaChartLine } from "react-icons/fa";
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import { AdminContextApi } from "@/context/api/AdmincontexApi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Chart from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';

const Orders = () => {
  const { backendUrl, token, currency } = useContext(AdminContextApi);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 4;
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // New: Status options with colors
  const statusOptions = [
    { value: "All", label: "All Statuses", color: "gray" },
    { value: "Order Placed", label: "Order Placed", color: "gray" },
    { value: "Packing", label: "Packing", color: "yellow" },
    { value: "Shipped", label: "Shipped", color: "blue" },
    { value: "Out for delivery", label: "Out for Delivery", color: "orange" },
    { value: "Delivered", label: "Delivered", color: "green" },
  ];

  // New: Fetch orders with analytics
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
    //  console.log(response)
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

  // New: Handle status filter
  const handleStatusFilter = (status) => {
    setStatusFilter(status);
  };

  // New: Handle date filter
  useEffect(() => {
    let result = orders;
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(order => 
        order.address.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order._id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== "All") {
      result = result.filter(order => order.status === statusFilter);
    }
    
    // Apply date filter
    if (startDate && endDate) {
      result = result.filter(order => {
        const orderDate = new Date(order.date);
        return orderDate >= startDate && orderDate <= endDate;
      });
    }
    
    setFilteredOrders(result);
    setCurrentPage(1);
  }, [orders, searchTerm, statusFilter, startDate, endDate]);

  // New: Order analytics data
  const analyticsData = useMemo(() => {
    const statusCounts = {
      "Order Placed": 0,
      "Packing": 0,
      "Shipped": 0,
      "Out for delivery": 0,
      "Delivered": 0,
    };
    
    const revenueByStatus = {
      "Order Placed": 0,
      "Packing": 0,
      "Shipped": 0,
      "Out for delivery": 0,
      "Delivered": 0,
    };
    
    let totalRevenue = 0;
    let completedRevenue = 0;
    
    orders.forEach(order => {
      statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
      
      if (order.payment) {
        revenueByStatus[order.status] += order.amount;
        totalRevenue += order.amount;
        
        if (order.status === "Delivered") {
          completedRevenue += order.amount;
        }
      }
    });
    
    return {
      statusCounts,
      revenueByStatus,
      totalRevenue,
      completedRevenue,
      chartData: {
        labels: Object.keys(statusCounts),
        datasets: [
          {
            label: 'Orders by Status',
            data: Object.values(statusCounts),
            backgroundColor: [
              'rgba(107, 114, 128, 0.7)',
              'rgba(234, 179, 8, 0.7)',
              'rgba(59, 130, 246, 0.7)',
              'rgba(249, 115, 22, 0.7)',
              'rgba(34, 197, 94, 0.7)'
            ],
            borderColor: [
              'rgb(75, 85, 99)',
              'rgb(202, 138, 4)',
              'rgb(37, 99, 235)',
              'rgb(249, 115, 22)',
              'rgb(21, 128, 61)'
            ],
            borderWidth: 1
          }
        ]
      }
    };
  }, [orders]);

  // Existing functions with minor improvements
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
      } else {
        toast.error(response.data.message || "Failed to update status.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleExportCSV = () => {
    const csvData = filteredOrders.map((order) => ({
      'Order ID': order._id,
      'Customer': `${order.address.firstName} ${order.address.lastName}`,
      'Phone': order.address.phone,
      'Address': `${order.address.street}, ${order.address.city}, ${order.address.state}, ${order.address.country}`,
      'Zipcode': order.address.zipcode,
      'Items': order.items.map((i) => `${i.name} × ${i.quantity}`).join(", "),
      'Total Items': order.items.length,
      'Amount': `${currency}${order.amount}`,
      'Payment': order.payment ? "Done" : "Pending",
      'Method': order.paymentMethod,
      'Date': new Date(order.date).toLocaleDateString(),
      'Status': order.status,
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `orders_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  // New: View order details
  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
  };

  // New: Close order details
  const closeOrderDetails = () => {
    setSelectedOrder(null);
  };

  return (
    <div className="px-2 sm:px-8 mt-4 sm:mt-14">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="relative w-full md:w-80">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or order ID..."
            className="pl-10 p-2.5 border rounded-lg w-full focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2.5 border rounded-lg bg-white focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <FaFilter className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
          </div>
          
          {/* Date Range Picker */}
          <div className="border rounded-lg flex items-center px-3">
            <DatePicker
              selectsRange={true}
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => setDateRange(update)}
              placeholderText="Date range"
              className="py-2.5 focus:outline-none"
            />
          </div>
          
          {/* Export Button */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-lg transition-colors"
          >
            <FaFileExport />
            <span>Export CSV</span>
          </button>
          
          {/* Analytics Toggle */}
          <button
            onClick={() => setShowAnalytics(!showAnalytics)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors ${
              showAnalytics 
                ? "bg-tertiary text-white" 
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            <FaChartLine />
            <span>Analytics</span>
          </button>
        </div>
      </div>

      {/* Analytics Dashboard */}
      {showAnalytics && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 animate-fadeIn">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Analytics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
              <p className="text-gray-600">Total Orders</p>
              <p className="text-3xl font-bold text-blue-700">{orders.length}</p>
            </div>
            
            <div className="bg-green-50 p-5 rounded-xl border border-green-100">
              <p className="text-gray-600">Completed Revenue</p>
              <p className="text-3xl font-bold text-green-700">
                {currency}{analyticsData.completedRevenue.toFixed(2)}
              </p>
            </div>
            
            <div className="bg-purple-50 p-5 rounded-xl border border-purple-100">
              <p className="text-gray-600">Total Revenue</p>
              <p className="text-3xl font-bold text-purple-700">
                {currency}{analyticsData.totalRevenue.toFixed(2)}
              </p>
            </div>
          </div>
          
          <div className="h-80">
            <Bar 
              data={analyticsData.chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: 'Orders by Status',
                    font: {
                      size: 16
                    }
                  }
                }
              }}
            />
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4">
            {statusOptions.slice(1).map((status) => (
              <div 
                key={status.value}
                className="p-4 rounded-lg border"
                style={{ borderLeft: `4px solid var(--${status.color}-500)` }}
              >
                <p className="font-medium text-gray-700">{status.label}</p>
                <p className="text-2xl font-bold">
                  {analyticsData.statusCounts[status.value] || 0}
                </p>
                <p className="text-sm text-gray-500">
                  {currency}{analyticsData.revenueByStatus[status.value]?.toFixed(2) || '0.00'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Orders List */}
      <div className="flex flex-col gap-5">
        {loading ? (
          Array(ordersPerPage)
            .fill()
            .map((_, idx) => (
              <div
                key={idx}
                className="animate-pulse p-6 bg-white border rounded-xl h-40"
              />
            ))
        ) : currentOrders.length > 0 ? (
          currentOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 p-6">
                {/* Order Icon */}
                <div className="hidden md:flex items-center justify-center">
                  <div className="bg-primary-50 rounded-xl p-5">
                    <FaBoxOpen className="text-4xl text-primary" />
                  </div>
                </div>

                {/* Order Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Customer & Items */}
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Customer
                      </p>
                      <p className="font-medium">
                        {order.address.firstName} {order.address.lastName}
                      </p>
                      <p className="text-gray-600">{order.address.phone}</p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Items
                      </p>
                      <div className="mt-1 space-y-1">
                        {order.items.map((item, index) => (
                          <p key={index} className="text-gray-700">
                            • {item.name} × {item.quantity}
                          </p>
                        ))}
                      </div>
                      <p className="mt-2 text-sm text-gray-600">
                        Total Items: {order.items.length}
                      </p>
                    </div>
                  </div>

                  {/* Address & Payment */}
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Address
                      </p>
                      <p className="text-gray-700">
                        {order.address.street}, {order.address.city}
                      </p>
                      <p className="text-gray-700">
                        {order.address.state}, {order.address.country} -{" "}
                        {order.address.zipcode}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Payment
                      </p>
                      <p className="text-gray-700">
                        Method: {order.paymentMethod}
                      </p>
                      <p className="flex items-center">
                        Status:{" "}
                        <span
                          className={`ml-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                            order.payment
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {order.payment ? "Completed" : "Pending"}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Order Info */}
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Order Info
                      </p>
                      <p className="text-gray-700">
                        ID: <span className="font-mono">{order._id.slice(-8)}</span>
                      </p>
                      <p className="text-gray-700">
                        Date: {new Date(order.date).toLocaleDateString()}
                      </p>
                      <p className="text-gray-700">
                        Amount:{" "}
                        <span className="font-bold text-tertiary">
                          {currency}
                          {order.amount}
                        </span>
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Order Status
                      </p>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold text-white ${
                            order.status === "Delivered"
                              ? "bg-green-600"
                              : order.status === "Out for delivery"
                              ? "bg-orange-500"
                              : order.status === "Shipped"
                              ? "bg-blue-500"
                              : order.status === "Packing"
                              ? "bg-yellow-500"
                              : "bg-gray-500"
                          }`}
                        >
                          {order.status}
                        </span>
                        
                        <select
                          onChange={(event) => statusHandler(event, order._id)}
                          value={order.status}
                          className="ml-2 text-xs border rounded py-1 px-2 bg-white focus:ring-1 focus:ring-primary"
                        >
                          {statusOptions.slice(1).map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => viewOrderDetails(order)}
                      className="text-sm text-primary hover:text-primary-dark font-medium mt-2"
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <FaBoxOpen className="mx-auto text-4xl text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              No orders found
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {searchTerm || statusFilter !== "All" || dateRange[0]
                ? "Try adjusting your search or filter criteria"
                : "No orders have been placed yet. Orders will appear here once placed."}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredOrders.length > ordersPerPage && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
          <p className="text-gray-600">
            Showing {Math.min(indexOfFirstOrder + 1, filteredOrders.length)}-
            {Math.min(indexOfLastOrder, filteredOrders.length)} of{" "}
            {filteredOrders.length} orders
          </p>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-full ${
                    currentPage === page
                      ? "bg-primary text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  {page}
                </button>
              )
            )}
            
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800">
                  Order Details
                </h3>
                <button
                  onClick={closeOrderDetails}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  &times;
                </button>
              </div>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">
                  Customer Information
                </h4>
                <div className="space-y-2 text-gray-600">
                  <p>
                    <span className="font-medium">Name:</span>{" "}
                    {selectedOrder.address.firstName}{" "}
                    {selectedOrder.address.lastName}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span>{" "}
                    {selectedOrder.address.phone}
                  </p>
                  <p>
                    <span className="font-medium">Address:</span>{" "}
                    {selectedOrder.address.street}, {selectedOrder.address.city}
                  </p>
                  <p>
                    {selectedOrder.address.state},{" "}
                    {selectedOrder.address.country} -{" "}
                    {selectedOrder.address.zipcode}
                  </p>
                </div>
                
                <h4 className="font-semibold text-gray-700 mt-6 mb-3">
                  Payment Details
                </h4>
                <div className="space-y-2 text-gray-600">
                  <p>
                    <span className="font-medium">Method:</span>{" "}
                    {selectedOrder.paymentMethod}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span>{" "}
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        selectedOrder.payment
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {selectedOrder.payment ? "Completed" : "Pending"}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium">Amount:</span>{" "}
                    <span className="font-bold text-tertiary">
                      {currency}
                      {selectedOrder.amount}
                    </span>
                  </p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">
                  Order Items
                </h4>
                <div className="border rounded-lg">
                  {selectedOrder.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border-b last:border-b-0"
                    >
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium">
                        {currency}
                        {item.price}
                      </p>
                    </div>
                  ))}
                  <div className="p-3 bg-gray-50 font-bold flex justify-between">
                    <span>Total</span>
                    <span>
                      {currency}
                      {selectedOrder.amount}
                    </span>
                  </div>
                </div>
                
                <h4 className="font-semibold text-gray-700 mt-6 mb-3">
                  Order Status
                </h4>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold text-white ${
                      selectedOrder.status === "Delivered"
                        ? "bg-green-600"
                        : selectedOrder.status === "Out for delivery"
                        ? "bg-orange-500"
                        : selectedOrder.status === "Shipped"
                        ? "bg-blue-500"
                        : selectedOrder.status === "Packing"
                        ? "bg-yellow-500"
                        : "bg-gray-500"
                    }`}
                  >
                    {selectedOrder.status}
                  </span>
                  
                  <select
                    onChange={(event) => {
                      statusHandler(event, selectedOrder._id);
                      closeOrderDetails();
                    }}
                    value={selectedOrder.status}
                    className="border rounded py-1.5 px-3 bg-white focus:ring-1 focus:ring-primary text-sm"
                  >
                    {statusOptions.slice(1).map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="mt-4 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Order ID:</span>{" "}
                    {selectedOrder._id}
                  </p>
                  <p>
                    <span className="font-medium">Order Date:</span>{" "}
                    {new Date(selectedOrder.date).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t flex justify-end">
              <button
                onClick={closeOrderDetails}
                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;

