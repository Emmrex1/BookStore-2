import React from "react";
import { FaBoxOpen, FaChevronDown, FaChevronUp } from "react-icons/fa";

const OrderRow = ({
  order,
  currency,
  isExpanded,
  toggleExpand,
  statusHandler,
  statusOptions,
  viewDetails,
}) => {
  return (
    <div className="border-b last:border-b-0 hover:bg-gray-50 transition-colors">
      <div
        className="p-4 cursor-pointer grid grid-cols-1 md:grid-cols-[auto_1fr] gap-4"
        onClick={toggleExpand}
      >
        <div className="flex items-center justify-center">
          <div className="bg-blue-50 rounded-xl p-3">
            <FaBoxOpen className="text-xl text-blue-600" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Customer
            </p>
            <p className="font-medium">
              {order.address.firstName} {order.address.lastName}
            </p>
            <p className="text-gray-600 text-sm">{order.address.phone}</p>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Order Info
            </p>
            <p className="text-gray-700">
              ID: <span className="font-mono">{order._id.slice(-8)}</span>
            </p>
            <p className="text-gray-700 text-sm">
              {new Date(order.date).toLocaleDateString()}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Amount
              </p>
              <p className="font-bold text-lg text-gray-800">
                {currency}
                {order.amount}
              </p>
            </div>

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

              <button className="text-gray-500">
                {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Order Details */}
      {isExpanded && (
        <div className="p-4 pt-0 border-t bg-blue-50 bg-opacity-30">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Items</p>
              <div className="space-y-1">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span>
                      {currency}
                      {item.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Address</p>
              <p className="text-sm text-gray-600">
                {order.address.street}, {order.address.city}
              </p>
              <p className="text-sm text-gray-600">
                {order.address.state}, {order.address.country} -{" "}
                {order.address.zipcode}
              </p>
            </div>

            <div>
              <div className="mb-2">
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Payment
                </p>
                <div className="flex justify-between text-sm">
                  <span>Method:</span>
                  <span className="font-medium">
                    {order.paymentMethod === "cod"
                      ? "Cash on Delivery"
                      : order.paymentMethod === "stripe"
                      ? "Credit Card"
                      : order.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Status:</span>
                  <span
                    className={`font-medium ${
                      order.payment ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {order.payment ? "Completed" : "Pending"}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <select
                  onChange={(event) => statusHandler(event, order._id)}
                  value={order.status}
                  className="flex-1 text-xs border rounded py-1.5 px-2 bg-white focus:ring-1 focus:ring-blue-500"
                >
                  {statusOptions.slice(1).map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <button
                  onClick={viewDetails}
                  className="text-xs bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-1.5 rounded transition-colors"
                >
                  Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderRow;
