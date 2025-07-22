import React, { useState, useEffect } from "react";
import { getDashboardStats, getRevenueChartData, getOrdersChartData } from '../../services/dashboardService';
import { UserGroupIcon, ShoppingBagIcon, ClipboardDocumentListIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";
import RevenueChart from "../../components/ui/RevenueChart";
import OrdersChart from "../../components/ui/OrdersChart";

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear()); // Mặc định là năm hiện tại
  const [revenueData, setRevenueData] = useState([]);
  const [ordersData, setOrdersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const [statsRes, revenueRes, ordersRes] = await Promise.all([
          getDashboardStats(),
          getRevenueChartData(year),
          getOrdersChartData(year)
        ]);
        setStats(statsRes.data);
        setRevenueData(revenueRes.data);
        setOrdersData(ordersRes.data);
        setError('');
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("Không thể tải dữ liệu. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [year]); // Chạy lại khi 'year' thay đổi

  const handleYearChange = (e) => {
    const newYear = parseInt(e.target.value);
    if (!isNaN(newYear)) {
      setYear(newYear);
    }
  };

  const formattedPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const statCards = [
    { name: "Doanh Thu", value: formattedPrice(stats?.totalRevenue || 0), icon: CurrencyDollarIcon, color: "bg-purple-500" },
    { name: "Tổng Người Dùng", value: stats?.totalUsers || 0, icon: UserGroupIcon, color: "bg-green-500" },
    { name: "Tổng Sản Phẩm", value: stats?.totalTemplates || 0, icon: ShoppingBagIcon, color: "bg-blue-500" },
    { name: "Tổng Đơn Hàng", value: stats?.totalOrders || 0, icon: ClipboardDocumentListIcon, color: "bg-yellow-500" },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg text-white p-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Chào mừng trở lại, Admin!</h1>
        <p className="text-blue-100 mt-2 text-sm sm:text-base">Đây là tổng quan hệ thống của bạn.</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
            <div className="p-5 flex items-center">
              <div className={`${stat.color} p-3 rounded-md`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                  <dd className="text-xl sm:text-2xl font-semibold text-gray-900">{stat.value}</dd>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Year Filter Section */}
      <div className="bg-white p-4 rounded-lg shadow flex flex-col sm:flex-row items-center justify-center gap-4">
        <label htmlFor="yearFilter" className="text-sm sm:text-base font-semibold text-gray-700">Xem thống kê theo năm:</label>
        <input
          type="number"
          id="yearFilter"
          value={year}
          onChange={handleYearChange}
          className="border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
          placeholder="YYYY"
        />
        {loading && <div className="text-sm text-blue-500 animate-pulse">Đang tải...</div>}
      </div>
      {error && <div className="p-4 text-center text-red-500 bg-red-100 rounded-md">{error}</div>}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <RevenueChart data={revenueData} />
        <OrdersChart data={ordersData} />
      </div>
    </div>
  );
};

export default DashboardPage;