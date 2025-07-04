import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../../services/dashboardService';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Đăng ký các thành phần cần thiết cho Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Component con để hiển thị một thẻ thống kê
const StatCard = ({ title, value, icon }) => {
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
    <div className="bg-blue-100 p-3 rounded-full">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
};

const DashboardStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getDashboardStats();
        setStats(response.data);
      } catch (err) {
        setError('Không thể tải dữ liệu thống kê.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [])

  if (loading) return <p>Đang tải thống kê....</p>;
  if (error) return <p className="text-red-500">{error}</p>
  if (!stats) return null;

  // Dữ liệu cho biểu đồ cột
  const chartData = {
    labels: ['Người dùng', 'Đơn hàng', 'Sản phẩm'],
    datasets: [{
      label: 'Tổng số',
      data: [stats.totalUsers, stats.totalOrders, stats.totalTempltes],
      backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)', 'rgba(75, 192, 192, 0.6)'],
      borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)'],
      borderWidth: 1,
    },],
  };

  const formattedRevenue = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats.totalRevenue);

  return (
    <div className="space-y-8">
      {/* Các thẻ thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Tổng Doanh thu" value={formattedRevenue} icon={'💰'} />
        <StatCard title="Tổng số Khách hàng" value={stats.totalUsers} icon={'👥'} />
        <StatCard title="Tổng số Đơn hàng" value={stats.totalOrders} icon={'🛒'} />
        <StatCard title="Tổng số Sản phẩm" value={stats.totalTemplates} icon={'📄'} />
      </div>

      {/* Biểu đồ */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4">Tổng quan hệ thống</h3>
        <Bar data={chartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
      </div>
    </div>
  );
};

export default DashboardStats;