import React from "react";
import { FaPrint, FaTimes } from "react-icons/fa";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const OrderDetailsModal = ({
  selectedOrder,
  closeOrderDetails,
  statusHandler,
  statusOptions,
  currency,
}) => {
  const handlePrintInvoice = () => {
    const input = document.getElementById("order-details-content");
    if (!input) return;

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`invoice_${selectedOrder._id}.pdf`);
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800">Order Details</h3>
          <button
            onClick={closeOrderDetails}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            &times;
          </button>
        </div>

        <div
          id="order-details-content"
          className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8"
        >
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
                <span className="font-medium">Email:</span>{" "}
                {selectedOrder.address.email || "N/A"}
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
                {selectedOrder.address.state}, {selectedOrder.address.country} -{" "}
                {selectedOrder.address.zipcode}
              </p>
            </div>

            <h4 className="font-semibold text-gray-700 mt-6 mb-3">
              Payment Details
            </h4>
            <div className="space-y-2 text-gray-600">
              <p>
                <span className="font-medium">Method:</span>{" "}
                {selectedOrder.paymentMethod === "cod"
                  ? "Cash on Delivery"
                  : selectedOrder.paymentMethod === "stripe"
                  ? "Credit Card"
                  : selectedOrder.paymentMethod}
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
                <span className="font-bold text-blue-600">
                  {currency}
                  {selectedOrder.amount}
                </span>
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-700 mb-3">Order Items</h4>
            <div className="border rounded-lg overflow-hidden">
              <div className="grid grid-cols-3 bg-gray-100 p-2 font-semibold text-sm">
                <div>Item</div>
                <div className="text-center">Quantity</div>
                <div className="text-right">Price</div>
              </div>
              {selectedOrder.items.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-3 p-2 border-b last:border-b-0"
                >
                  <div className="font-medium">{item.name}</div>
                  <div className="text-center">{item.quantity}</div>
                  <div className="text-right">
                    {currency}
                    {item.price}
                  </div>
                </div>
              ))}
              <div className="p-2 bg-gray-50 font-bold flex justify-between">
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
            <div className="flex items-center gap-3 mb-4">
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
                className="border rounded py-1.5 px-3 bg-white focus:ring-1 focus:ring-blue-500 text-sm"
              >
                {statusOptions.slice(1).map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-sm text-gray-600">
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

        <div className="p-6 border-t flex justify-end gap-3">
          <button
            onClick={closeOrderDetails}
            className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-medium"
          >
            Close
          </button>
          <button
            onClick={handlePrintInvoice}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium flex items-center gap-2"
          >
            <FaPrint /> Print Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
