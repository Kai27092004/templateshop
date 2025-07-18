import React, { useState, useEffect, useMemo } from "react";
import { EyeIcon, PencilIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { getAllOrdersAdmin, deleteOrderAdmin } from "../../services/orderService"; // Import API services
import CustomPagination from "../ui/CustomPagination";
import ConfirmModal from "../ui/ConfirmModal";
import SuccessToast from "../ui/SuccessToast";

const OrderManager = () => {
  // State quản lý dữ liệu và UI
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // State cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // State cho modal và toast
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [toastInfo, setToastInfo] = useState({ show: false, message: '' });

  // State cho sắp xếp
  const [sortType, setSortType] = useState('date_desc');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await getAllOrdersAdmin();
      // Sắp xếp đơn hàng mới nhất lên đầu
      setOrders(response.data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)));
      setError('');
    } catch (err) {
      setError('Không thể tải danh sách đơn hàng. Vui lòng thử lại.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // CẢI TIẾN: Tự động quay về trang 1 khi lọc hoặc tìm kiếm
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowViewModal(true);
  };

  const handleEditOrder = (order) => {
    alert('Chức năng chỉnh sửa đang được phát triển!');
  };

  // Hàm mở modal xác nhận xóa
  const handleDeleteClick = (orderId) => {
    setOrderToDelete(orderId);
    setIsModalOpen(true);
  };

  // Hàm xác nhận xóa sau khi bấm nút trong modal
  const handleConfirmDelete = async () => {
    if (!orderToDelete) return;
    try {
      await deleteOrderAdmin(orderToDelete);
      setIsModalOpen(false);
      setOrderToDelete(null);
      fetchOrders(); // Tải lại danh sách
      setToastInfo({ show: true, message: 'Xóa đơn hàng thành công!' });
    } catch (err) {
      setError(`Lỗi khi xóa đơn hàng: ${err.response?.data || err.message}`);
      setIsModalOpen(false);
    }
  };

  const getStatusColor = (statusText) => {
    if (statusText === 'Đã thanh toán') return "bg-green-100 text-green-800";
    if (statusText === 'Chờ thanh toán') return "bg-yellow-100 text-yellow-800";
    if (statusText === 'Đã hủy') return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };

  // Lọc và Sắp xếp đơn hàng
  const processedOrders = useMemo(() => {
    // 1. Lọc
    let filtered = orders.filter((order) => {
      const lowerSearchTerm = searchTerm.toLowerCase();
      const matchesSearch =
        (order.user?.fullName.toLowerCase() || '').includes(lowerSearchTerm) ||
        (order.user?.email.toLowerCase() || '').includes(lowerSearchTerm) ||
        order.id.toString().includes(lowerSearchTerm);
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    // 2. Sắp xếp
    filtered.sort((a, b) => {
      switch (sortType) {
        case 'date_desc':
          return new Date(b.orderDate) - new Date(a.orderDate);
        case 'date_asc':
          return new Date(a.orderDate) - new Date(b.orderDate);
        case 'id_asc':
          return parseInt(a.id, 10) - parseInt(b.id, 10);
        case 'id_desc':
        default:
          return parseInt(b.id, 10) - parseInt(a.id, 10);
      }
    });
    return filtered;
  }, [orders, searchTerm, statusFilter, sortType]);


  // Logic phân trang
  const totalPages = Math.ceil(processedOrders.length / itemsPerPage);
  const currentOrders = processedOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  if (loading) {
    return <div className="p-6">Đang tải danh sách đơn hàng...</div>
  }

  return (
    <>
      <SuccessToast
        show={toastInfo.show}
        message={toastInfo.message}
        onClose={() => setToastInfo({ show: false, message: '' })}
      />
      <ConfirmModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa đơn hàng"
        message={`Bạn có chắc chắn muốn xóa đơn hàng #${orderToDelete}? Hành động này không thể hoàn tác.`}
      />

      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="bg-white shadow rounded-lg p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Quản lý Đơn hàng</h1>
              <p className="text-gray-600 mt-1 text-sm">Quản lý tất cả đơn hàng của khách hàng</p>
            </div>
            <div className="text-center sm:text-right">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600">{processedOrders.length}</div>
              <div className="text-sm text-gray-500">Đơn hàng</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="text" placeholder="Tìm theo tên, email, hoặc mã ĐH..." className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:col-span-1" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">Tất cả trạng thái</option>
              <option value="Chờ thanh toán">Chờ thanh toán</option>
              <option value="Đã thanh toán">Đã thanh toán</option>
              <option value="Đã hủy">Đã hủy</option>
            </select>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" value={sortType} onChange={(e) => setSortType(e.target.value)}>
              <option value="date_desc">Ngày đặt: Mới nhất</option>
              <option value="date_asc">Ngày đặt: Cũ nhất</option>
              <option value="id_desc">Mã ĐH: Lớn nhất</option>
              <option value="id_asc">Mã ĐH: Nhỏ nhất</option>
            </select>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        {/* Orders List */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Desktop Table View (ẩn trên mobile) */}
          <div className="overflow-x-auto hidden md:block">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã ĐH</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Khách hàng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày đặt</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tổng tiền</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hành động</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.user?.fullName}</div>
                      <div className="text-sm text-gray-500">{order.user?.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.orderDate).toLocaleDateString("vi-VN")}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{new Intl.NumberFormat('vi-VN').format(order.totalAmount)} đ</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>{order.status}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button onClick={() => handleViewOrder(order)} className="text-indigo-600 hover:text-indigo-900 p-1" title="Xem chi tiết"><EyeIcon className="h-4 w-4" /></button>
                        <button onClick={handleEditOrder} className="text-green-600 hover:text-green-900 p-1" title="Chỉnh sửa"><PencilIcon className="h-4 w-4" /></button>
                        <button onClick={() => handleDeleteClick(order.id)} className="text-red-600 hover:text-red-900 p-1" title="Xóa"><TrashIcon className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View (hiển thị trên mobile, ẩn trên desktop) */}
          <div className="md:hidden">
            {currentOrders.map((order) => (
              <div key={order.id} className="border-b p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-gray-900">#{order.id}</p>
                    <p className="text-sm text-gray-700">{order.user?.fullName}</p>
                    <p className="text-xs text-gray-500">{order.user?.email}</p>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>{order.status}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">{new Date(order.orderDate).toLocaleDateString("vi-VN")}</span>
                  <span className="font-semibold text-blue-600">{new Intl.NumberFormat('vi-VN').format(order.totalAmount)} đ</span>
                </div>
                <div className="flex justify-end space-x-2 pt-2 border-t">
                  <button onClick={() => handleViewOrder(order)} className="p-2 text-indigo-600 hover:bg-gray-100 rounded-full" title="Xem"><EyeIcon className="h-5 w-5" /></button>
                  <button onClick={handleEditOrder} className="p-2 text-green-600 hover:bg-gray-100 rounded-full" title="Sửa"><PencilIcon className="h-5 w-5" /></button>
                  <button onClick={() => handleDeleteClick(order.id)} className="p-2 text-red-600 hover:bg-gray-100 rounded-full" title="Xóa"><TrashIcon className="h-5 w-5" /></button>
                </div>
              </div>
            ))}
          </div>

          <CustomPagination count={totalPages} page={currentPage} onChange={handlePageChange} />
        </div>

        {/* View Order Modal */}
        {
          showViewModal && selectedOrder && (
            <div className="fixed inset-0 bg-gray-500/30 shadow-lg flex items-center justify-center z-50 p-4 view-modal">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">
                    Chi tiết đơn hàng #{selectedOrder.id}
                  </h3>
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                  {/* Customer Info */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Thông tin khách hàng
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-400 font-bold">
                          Tên khách hàng:
                        </span>
                        <p className="font-medium">{selectedOrder.user.fullName}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-400 font-bold">Email:</span>
                        <p className="font-medium break-all">
                          {selectedOrder.user.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Info */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Thông tin đơn hàng
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-400 font-bold">Ngày đặt:</span>
                        <p className="font-medium">
                          {new Date(selectedOrder.orderDate).toLocaleDateString("vi-VN")}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-400 font-bold">Trạng thái:</span>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            selectedOrder.status
                          )}`}
                        >
                          {selectedOrder.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Sản phẩm đặt mua
                    </h4>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 font-bold uppercase">
                                Sản phẩm
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 font-bold uppercase">
                                Số lượng
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 font-bold uppercase">
                                Đơn giá
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {selectedOrder.orderDetails.map(item => (
                              <tr key={item.template.id}>
                                <td className="px-4 py-2 text-sm text-gray-900">
                                  {item.template.name}
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-400 font-bold">
                                  {item.quantity}
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-900 font-medium">
                                  {new Intl.NumberFormat('vi-VN').format(item.priceAtPurchase)} đ
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Tổng cộng:</span>
                      <span className="text-blue-600">
                        {new Intl.NumberFormat('vi-VN').format(selectedOrder.totalAmount)} đ
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        }
      </div>
    </>
  );
};

export default OrderManager;