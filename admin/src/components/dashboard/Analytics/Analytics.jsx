import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Analytics = ({ analyticsData, currency }) => {
  if (!analyticsData) return null;

  const {
    statusCounts,
    revenueByStatus,
    totalRevenue,
    completedRevenue,
    totalOrders,
    chartData,
  } = analyticsData;

  return (
    <div className="bg-white border rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Order Analytics</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-2">Status Summary</h3>
          <ul className="text-sm space-y-1">
            {Object.entries(statusCounts).map(([status, count]) => (
              <li key={status}>
                <span className="font-medium">{status}:</span> {count} orders
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Revenue Summary</h3>
          <ul className="text-sm space-y-1">
            <li>
              <span className="font-medium">Total Revenue:</span> {currency}
              {totalRevenue}
            </li>
            <li>
              <span className="font-medium">Completed Revenue:</span>{" "}
              {currency}
              {completedRevenue}
            </li>
            {Object.entries(revenueByStatus).map(([status, amount]) => (
              <li key={status}>
                <span className="font-medium">{status}:</span> {currency}
                {amount}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6">
        <Bar data={chartData} />
      </div>

      <p className="mt-6 text-sm">
        <strong>Total Orders:</strong> {totalOrders}
      </p>
    </div>
  );
};

export default Analytics;
