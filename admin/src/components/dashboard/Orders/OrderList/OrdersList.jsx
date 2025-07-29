import React, { useState } from "react";
import {
  FaBoxOpen,
  FaFileExport,
  FaFilePdf,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import OrderRow from "../OrderRow/OrderRow";


const OrdersList = ({
  loading,
  ordersPerPage,
  currentOrders,
  filteredOrders,
  currency,
  statusHandler,
  statusOptions,
  setSelectedOrder,
  currentPage,
  totalPages,
  setCurrentPage,
}) => {
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const toggleOrderExpand = (orderId) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  // Export to CSV
  const handleExportCSV = () => {
    const csvData = filteredOrders.map((order) => ({
      "Order ID": order._id,
      Customer: `${order.address.firstName} ${order.address.lastName}`,
      Phone: order.address.phone,
      Address: `${order.address.street}, ${order.address.city}`,
      Amount: `${currency}${order.amount}`,
      Payment: order.payment ? "Done" : "Pending",
      Method: order.paymentMethod,
      Date: new Date(order.date).toLocaleDateString(),
      Status: order.status,
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `orders_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  // Export to PDF
  const handleExportPDF = () => {
    const input = document.getElementById("orders-table");
    if (!input) return;

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`orders_report_${new Date().toISOString().slice(0, 10)}.pdf`);
    });
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">All Orders</h2>
          <p className="text-gray-600 text-sm">
            Showing{" "}
            {Math.min(
              currentPage * ordersPerPage - ordersPerPage + 1,
              filteredOrders.length
            )}
            -{Math.min(currentPage * ordersPerPage, filteredOrders.length)} of{" "}
            {filteredOrders.length} orders
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2.5 rounded-lg transition-colors"
          >
            <FaFileExport />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 px-4 py-2.5 rounded-lg transition-colors"
          >
            <FaFilePdf />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div
        className="bg-white rounded-xl shadow overflow-hidden"
        id="orders-table"
      >
        {loading ? (
          Array(ordersPerPage)
            .fill()
            .map((_, idx) => (
              <div
                key={idx}
                className="animate-pulse p-6 border-b last:border-b-0"
              >
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-1/3 mt-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mt-3"></div>
              </div>
            ))
        ) : currentOrders.length > 0 ? (
          currentOrders.map((order) => (
            <OrderRow
              key={order._id}
              order={order}
              currency={currency}
              isExpanded={expandedOrderId === order._id}
              toggleExpand={() => toggleOrderExpand(order._id)}
              statusHandler={statusHandler}
              statusOptions={statusOptions}
              viewDetails={() => setSelectedOrder(order)}
            />
          ))
        ) : (
          <div className="p-12 text-center">
            <FaBoxOpen className="mx-auto text-4xl text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              No orders found
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredOrders.length > ordersPerPage && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>

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

            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let page;
              if (totalPages <= 5) page = i + 1;
              else if (currentPage <= 3) page = i + 1;
              else if (currentPage >= totalPages - 2) page = totalPages - 4 + i;
              else page = currentPage - 2 + i;

              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-full ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  {page}
                </button>
              );
            })}

            {totalPages > 5 && currentPage < totalPages - 2 && (
              <span className="px-2 text-gray-500">...</span>
            )}

            {totalPages > 5 && currentPage < totalPages - 2 && (
              <button
                onClick={() => setCurrentPage(totalPages)}
                className={`w-10 h-10 rounded-full ${
                  currentPage === totalPages
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                {totalPages}
              </button>
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
    </>
  );
};

export default OrdersList;
