// src/pages/ProfilePage.js
import React, { useState, useEffect } from 'react';
import { getUserProfile, getOrderHistory } from '../services/userService';
import api from '../services/api'; // Import api instance

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const profilePromise = getUserProfile();
        const ordersPromise = getOrderHistory();
        const [profileResponse, ordersResponse] = await Promise.all([profilePromise, ordersPromise]);

        setProfile(profileResponse.data);
        setOrders(ordersResponse.data);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        setError('Không thể tải dữ liệu người dùng. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDownload = (templateId, fileName) => {
    api({
      url: `/account/download/${templateId}`,
      method: 'GET',
      responseType: 'blob',
    }).then((response) => {
      // SỬA LẠI 1: Đổi createdObjectUrl -> createObjectURL
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName || 'template.zip');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url); // Giải phóng bộ nhớ
    }).catch(err => {
      console.error("Download error:", err);
      alert("Bạn không có quyền tải file này hoặc đã có lỗi xảy ra.");
    });
  };

  if (loading) return <div className="text-center mt-10">Đang tải trang hồ sơ...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;



  return (
    <div className="container mx-auto p-4">
      {/* Phần thông tin cá nhân */}
      {profile && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold mb-4">Thông tin cá nhân</h2>
          <div className="space-y-2">
            <p><strong>Họ và tên:</strong> {profile.fullName}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Ngày tham gia:</strong> {new Date(profile.createdAt).toLocaleDateString('vi-VN')}</p>
          </div>
        </div>
      )}

      {/* Phần lịch sử đơn hàng */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Các sản phẩm đã mua</h2>
        {orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map(order => {
              const isCompleted = order.status === 'Đã thanh toán';
              const statusColor = isCompleted
                ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
              return (
                <div key={order.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
                    <h3 className="text-lg font-bold">Đơn hàng #{order.id}</h3>
                    {/* Hiển thị trạng thái với màu sắc */}
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${statusColor}`}>
                      {order.status}
                    </span>
                    <span className="text-sm text-gray-500">{new Date(order.orderDate).toLocaleString('vi-VN')}</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    {order.orderDetails.map(detail => (
                      <div key={detail.template.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                        <span>{detail.template.name} x {detail.quantity}</span>
                        {/* Chỉ hiển thị nút tải xuống nếu đơn hàng đã hoàn thành */}
                        {isCompleted && (
                          <button
                            onClick={() => handleDownload(detail.template.id, `${detail.template.slug}.zip`)}
                            className="bg-green-500 text-white py-1 px-3 rounded text-sm hover:bg-green-600 transition-colors"
                          >
                            Tải xuống
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end font-bold text-lg mt-2 border-t pt-2">
                    <span>Tổng cộng: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p>Bạn chưa mua sản phẩm nào.</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
