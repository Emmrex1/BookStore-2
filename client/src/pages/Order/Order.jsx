import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Title from "@/components/Title/Title";
import { ShopContext } from "@/context/ShopContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Download,
  RefreshCcw,
  Truck,
  List,
  Grid3X3,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";

const Badge = ({ text, color = "blue" }) => (
  <span
    className={`text-xs px-2 py-1 rounded-full bg-${color}-100 text-${color}-600`}
  >
    {text}
  </span>
);

const Order = () => {
  const { backendUrl, token, currency, addToCart } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [view, setView] = useState("list");
  const [trackingStates, setTrackingStates] = useState({});

  const loadOrderData = async () => {
    if (!token) return;

    try {
      const response = await axios.post(
        `${backendUrl}/api/order/userorders`,
        { userId: token.id },
        {
          withCredentials: true,
          headers: { token },
        }
      );

      if (response.data.success) {
        const allItems = response.data.orders.flatMap((order) =>
          order.items.map((item) => ({
            ...item,
            orderId: order._id,
            status: order.status,
            payment: order.payment,
            paymentMethod: order.paymentMethod,
            date: order.date,
            trackingNumber:
              order.trackingNumber ||
              `TRK-${order._id.slice(-6).toUpperCase()}`,
            trackingStatus: order.trackingStatus || [],
          }))
        );
        setOrderData(allItems.reverse());
      }
    } catch (error) {
      console.error("❌ Error loading orders:", error);
      toast.error("Failed to load orders.");
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  const downloadInvoice = (item) => {
    toast.info(`📄 Downloading invoice for ${item.name}`);
  };

  const handleReorder = (item) => {
    addToCart(item, item.quantity || 1);
    toast.success(`${item.name} added back to cart`);
  };

  const toggleTracking = (orderId, productId) => {
    setTrackingStates((prev) => ({
      ...prev,
      [`${orderId}-${productId}`]: !prev[`${orderId}-${productId}`],
    }));
  };

  const handleTrack = () => {
    navigate(`/track/${order._id}`);
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="px-2 sm:px-6">
      <div className="flex justify-between items-center mb-4">
        <Title title="My Orders" />
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => setView("list")}>
            <List size={18} />
          </Button>
          <Button variant="outline" size="icon" onClick={() => setView("grid")}>
            <Grid3X3 size={18} />
          </Button>
        </div>
      </div>

      {orderData.length > 0 ? (
        <div
          className={`grid ${
            view === "grid" ? "sm:grid-cols-2" : "grid-cols-1"
          } gap-4`}
        >
          {orderData.map((item, index) => {
            const totalPrice = item.price * item.quantity;
            const trackingKey = `${item.orderId}-${item._id}`;
            const isTrackingVisible = trackingStates[trackingKey];

            return (
              <Card
                key={index}
                className="bg-white shadow-sm rounded-xl hover:shadow-md"
              >
                <CardContent className="p-4">
                  <div className="flex gap-4 items-start">
                    <div className="w-20 h-20 shrink-0 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                      <img
                        src={item.images || "/placeholder.png"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-start">
                        <h3 className="text-md font-semibold text-gray-800">
                          {item.name}
                        </h3>
                        <Badge text={item.paymentMethod} />
                      </div>

                      <div className="text-sm text-gray-500">
                        Qty: <strong>{item.quantity}</strong> | Price:{" "}
                        <strong>
                          {currency}
                          {item.price}
                        </strong>
                      </div>

                      <div className="text-sm text-gray-700 flex items-center gap-1">
                        <Truck size={14} />
                        <span>Status:</span>
                        <Badge
                          text={item.status}
                          color={
                            item.status === "Delivered"
                              ? "green"
                              : item.status === "Cancelled"
                              ? "red"
                              : "yellow"
                          }
                        />
                      </div>

                      <div className="flex justify-between items-center mt-2">
                        <span className="text-lg font-bold text-blue-600">
                          {currency}
                          {totalPrice.toFixed(2)}
                        </span>

                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => downloadInvoice(item)}
                          >
                            <Download className="w-4 h-4 mr-1" /> Invoice
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              toggleTracking(item.orderId, item._id)
                            }
                          >
                            <MapPin className="w-4 h-4 mr-1" /> Track
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleReorder(item)}
                          >
                            <RefreshCcw className="w-4 h-4 mr-1" /> Reorder
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tracking Timeline */}
                  {isTrackingVisible && item.trackingStatus.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100 animate-fade-in">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium text-gray-800 flex items-center gap-1">
                          <Truck className="w-4 h-4" /> Tracking Information
                        </h4>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {item.trackingNumber}
                        </span>
                      </div>

                      <div className="relative pl-6 border-l-2 border-gray-200">
                        {item.trackingStatus.map((step, idx) => (
                          <div
                            key={idx}
                            className={`mb-4 relative ${
                              idx === item.trackingStatus.length - 1
                                ? "pb-0"
                                : "pb-4"
                            }`}
                          >
                            <div
                              className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 ${
                                idx === item.trackingStatus.length - 1
                                  ? "bg-green-500 border-green-500"
                                  : "bg-white border-blue-500"
                              }`}
                            ></div>
                            <div className="text-sm font-medium text-gray-800">
                              {step.status}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {formatDate(step.time)} at {formatTime(step.time)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-16">
          <img
            src="/empty-orders.svg"
            alt="No Orders"
            className="w-40 mx-auto mb-4"
          />
          <p>No orders found. Start shopping now!</p>
        </div>
      )}
    </div>
  );
};

export default Order;
