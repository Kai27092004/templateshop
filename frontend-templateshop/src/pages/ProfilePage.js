// src/pages/ProfilePage.js
import React, { useState, useEffect } from 'react';
import { getUserProfile, getOrderHistory } from '../services/userService';
import api from '../services/api'; // Import api instance
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../components/ui/ConfirmModal';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const navigate = useNavigate();

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

  const handleContinuePayment = () => {
    if (selectedOrder) {
      navigate(`/payment/${selectedOrder.id}`);
    }
  };

  const handleCloseCancel = () => {
    setShowCancelModal(false);
  };
  const handleCancelOrder = async () => {
    if (!selectedOrder) return;
    setCancelLoading(true);
    try {
      await api.post(`/orders/${selectedOrder.id}/cancel`); // Gọi API cancelOrder
      setShowCancelModal(false);
      // Refresh lại danh sách đơn hàng
      const ordersResponse = await getOrderHistory();
      setOrders(ordersResponse.data);
    } catch (err) {
      alert('Hủy đơn hàng thất bại hoặc không hợp lệ!');
    } finally {
      setCancelLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-10">Đang tải trang hồ sơ...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;



  return (
    <div className="container mx-auto p-4">
      {/* Phần thông tin cá nhân */}
      {profile && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          {/* Left: Avatar + Name + Title */}
          <div className="flex flex-col items-center md:items-center md:flex-row gap-4 w-full md:w-1/2">
            <img
              src={profile.avatarUrl || 'https://i.pravatar.cc/120?img=3'}
              alt="avatar"
              className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
            />
            <div className="md:ml-4 flex flex-col items-center md:items-start justify-center h-full">
              <h2 className="text-2xl md:text-3xl font-bold text-black">{profile.fullName}</h2>
            </div>
          </div>
          {/* Right: Details */}
          <div className="flex flex-col items-start w-full md:w-1/2 md:items-end text-base mt-4 md:mt-0">
            <div className="mb-1"><span className="font-semibold">Tài khoản:</span> {profile.username || profile.email?.split('@')[0] || '---'}</div>
            <div className="mb-1"><span className="font-semibold">Email:</span> {profile.email}</div>
            <div className="mb-1"><span className="font-semibold">Ngày tham gia:</span> <span className="font-bold">{profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('vi-VN') : '---'}</span></div>
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
              const isCancelled = order.status === 'Đã hủy';
              const isPending = order.status === 'Chờ thanh toán';
              let statusColor = '';
              if (isCompleted) {
                statusColor = 'bg-green-100 text-green-800';
              } else if (isCancelled) {
                statusColor = 'bg-red-100 text-red-800';
              } else {
                statusColor = 'bg-yellow-100 text-yellow-800';
              }
              return (
                <div key={order.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
                    <h3 className="text-lg font-bold">Đơn hàng #{order.id}</h3>
                    {/* Trạng thái chỉ hiển thị, không còn onClick */}
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${statusColor}`}>{order.status}</span>
                    <span className="text-sm text-gray-500">{new Date(order.orderDate).toLocaleString('vi-VN')}</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    {order.orderDetails.map(detail => (
                      <div key={detail.template.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                        <span>{detail.template.name} x {detail.quantity}</span>
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
                  <div className="flex items-center justify-between font-bold text-lg mt-2 border-t pt-2">
                    {/* Nút tiếp tục thanh toán và hủy đơn hàng cùng hàng, nằm bên trái */}
                    {isPending ? (
                      <div className="flex gap-2 mr-4">
                        <button
                          className="px-3 py-1 text-sm rounded-full font-semibold bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow hover:from-blue-500 hover:to-blue-700 transition-all duration-200"
                          style={{ minWidth: 120 }}
                          onClick={() => { setSelectedOrder(order); handleContinuePayment(order); }}
                        >
                          Tiếp tục thanh toán
                        </button>
                        <button
                          className="px-3 py-1 text-sm rounded-full font-semibold bg-gradient-to-r from-red-400 to-red-600 text-white shadow hover:from-red-500 hover:to-red-700 transition-all duration-200"
                          style={{ minWidth: 120 }}
                          onClick={() => { setSelectedOrder(order); setShowCancelModal(true); }}
                          disabled={cancelLoading}
                        >
                          {cancelLoading && selectedOrder && selectedOrder.id === order.id ? 'Đang hủy...' : 'Hủy đơn hàng'}
                        </button>
                      </div>
                    ) : <div />}
                    {/* Tổng cộng nằm bên phải */}
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
      {/* Modal xác nhận hủy đơn */}
      <ConfirmModal
        open={showCancelModal}
        onClose={handleCloseCancel}
        onConfirm={handleCancelOrder}
        title="Xác nhận hủy đơn hàng"
        message="Bạn có chắc chắn muốn hủy đơn hàng này? Hành động này không thể hoàn tác."
      />
    </div>
  );
};

export default ProfilePage;