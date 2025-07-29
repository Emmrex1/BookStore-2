
import React from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import { format } from "date-fns";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const AnalyticsDashboard = ({
  analyticsData,
  statusOptions = [],
  currency = "$",
}) => {
  // Optional chaining and fallback values to prevent crashes
  const totalOrders = analyticsData?.totalOrders ?? 0;
  const completedRevenue = analyticsData?.completedRevenue ?? 0;
  const pendingRevenue = analyticsData?.pendingRevenue ?? 0;
  const totalRevenue = analyticsData?.totalRevenue ?? 0;
  const chartData = analyticsData?.chartData ?? { labels: [], datasets: [] };
  const paymentData = analyticsData?.paymentMethodChartData ?? {
    labels: [],
    datasets: [],
  };
  const statusCounts = analyticsData?.statusCounts ?? {};
  const revenueByStatus = analyticsData?.revenueByStatus ?? {};

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Order Analytics</h2>
        <div className="text-sm text-gray-500">
          {format(new Date(), "MMMM d, yyyy")}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card label="Total Orders" value={totalOrders} color="blue" />
        <Card
          label="Completed Revenue"
          value={`${currency}${completedRevenue.toFixed(2)}`}
          color="green"
        />
        <Card
          label="Pending Revenue"
          value={`${currency}${pendingRevenue.toFixed(2)}`}
          color="purple"
        />
        <Card
          label="Total Revenue"
          value={`${currency}${totalRevenue.toFixed(2)}`}
          color="amber"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCard title="Orders by Status">
          <Bar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { position: "top" } },
              scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
            }}
          />
        </ChartCard>
        <ChartCard title="Payment Methods">
          <Pie
            data={paymentData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { position: "right" } },
            }}
          />
        </ChartCard>
      </div>

      {/* Order breakdown by status */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4">
        {statusOptions.slice(1).map((status) => {
          const count = statusCounts[status.value] || 0;
          const revenue = revenueByStatus[status.value]?.toFixed(2) || "0.00";
          const percentage = totalOrders
            ? Math.round((count / totalOrders) * 100)
            : 0;

          return (
            <div
              key={status.value}
              className="p-4 rounded-lg border flex items-center"
              style={{ borderLeft: `4px solid var(--${status.color}-500)` }}
            >
              <div className="flex-1">
                <p className="font-medium text-gray-700">{status.label}</p>
                <p className="text-xl font-bold">{count}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">
                  {currency}
                  {revenue}
                </p>
                <p className="text-xs text-gray-500">{percentage}%</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Simple card component for DRY stats
const Card = ({ label, value, color }) => (
  <div className={`bg-${color}-50 p-5 rounded-xl border border-${color}-100`}>
    <p className="text-gray-600">{label}</p>
    <p className={`text-2xl font-bold text-${color}-700`}>{value}</p>
  </div>
);

// Reusable chart container
const ChartCard = ({ title, children }) => (
  <div className="bg-white p-4 rounded-xl border border-gray-200 h-80">
    <h3 className="font-medium text-gray-800 mb-4">{title}</h3>
    {children}
  </div>
);

export default AnalyticsDashboard;
