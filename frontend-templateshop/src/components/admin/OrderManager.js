import React, { useState, useEffect } from 'react';
import { getAllOrdersAdmin, deleteOrderAdmin } from '../../services/orderService';

const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await getAllOrdersAdmin();
      setOrders(response.data)
    } catch (err) {
      setError('Không thể tải danh sách đơn hàng.')
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDelete = async (orderId) => {
    if (window.confirm('Bạn có chắc muốn xóa đơn hàng này không?')) {
      try {
        await deleteOrderAdmin(orderId);
        await fetchOrders();
      } catch (err) {
        setError(` Lỗi khi xóa đơn hàng: ${err.response?.data || err.message}`);
      }
    }
  };

  const formattedPrice = (price) => new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-4">Quản lý Đơn hàng</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 text-left">ID Đơn hàng</th>
              <th className="py-2 px-4 text-left">Khách hàng</th>
              <th className="py-2 px-4 text-left">Ngày đặt</th>
              <th className="py-2 px-4 text-left">Tổng tiền</th>
              <th className="py-2 px-4 text-left">Trạng thái</th>
              <th className="py-2 px-4 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="6" className="text-center py-4">Đang tải...</td></tr>
            ) : (
              orders.map(order => {
                const isCompleted = order.status === 'Đã thanh toán';
                const statusColor = isCompleted
                  ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
                return (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4 font-semibold">#{order.id}</td>
                    <td className="py-2 px-4" >{order.user?.fullName || 'N/A'} ({order.user?.email})</td>
                    <td className="py-2 px-4" >{new Date(order.orderDate).toLocaleDateString('vi-VN')}</td>
                    <td className="py-2 px-4" >{formattedPrice(order.totalAmount)}</td>
                    <td className="py-2 px-4" >
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColor}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-2 px-4" >
                      <button onClick={() => handleDelete(order.id)} className="text-red-500 hover:underline">
                        Xóa
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManager;