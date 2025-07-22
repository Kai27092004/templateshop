import React, { useState, useEffect, useMemo } from "react";
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon, MagnifyingGlassIcon, UserGroupIcon, ShieldCheckIcon, UserIcon } from "@heroicons/react/24/outline";
import { getAllUsers, createUser, updateUser, deleteUser } from "../../services/userService";
import ConfirmModal from "../../components/ui/ConfirmModal";
import SuccessToast from "../../components/ui/SuccessToast";
import CustomPagination from "../../components/ui/CustomPagination";
import { useAuth } from "../../contexts/AuthContext";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals & Toast states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [toastInfo, setToastInfo] = useState({ show: false, message: '' });

  // Filter & Pagination states
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const { user: currentAdmin } = useAuth();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getAllUsers();
      setUsers(response.data);
      setError('');
    } catch (err) {
      setError('Không thể tải danh sách người dùng.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter]);

  const handleOpenEditModal = (user = null) => {
    if (user) {
      setEditingUser({ id: user.id, fullName: user.fullName, email: user.email, role: user.role, password: '' });
    } else {
      setEditingUser({ fullName: '', email: '', role: 'USER', password: '' });
    }
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setEditingUser(null);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const isEditing = !!editingUser.id;
    try {
      if (isEditing) {
        await updateUser(editingUser.id, editingUser);
        setToastInfo({ show: true, message: 'Cập nhật người dùng thành công!' });
      } else {
        await createUser(editingUser);
        setToastInfo({ show: true, message: 'Thêm người dùng thành công!' });
      }
      fetchUsers();
      handleCloseModal();
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data || err.message;
      setError(`Lỗi: ${errorMsg}`);
    }
  };

  const handleDeleteClick = (userId) => setUserToDelete(userId);

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await deleteUser(userToDelete);
      setToastInfo({ show: true, message: 'Xóa người dùng thành công!' });
      fetchUsers();
    } catch (err) {
      setError(`Lỗi khi xóa: ${err.response?.data?.message || err.message}`);
    } finally {
      setUserToDelete(null);
    }
  };

  const getRoleInfo = (role) => (
    role === "ADMIN"
      ? { color: "bg-purple-100 text-purple-800", text: "Quản trị viên" }
      : { color: "bg-blue-100 text-blue-800", text: "Khách hàng" }
  );

  const processedUsers = useMemo(() => {
    let filtered = users.filter(user => {
      const lowerSearch = searchTerm.toLowerCase();
      const matchesSearch = user.fullName.toLowerCase().includes(lowerSearch) || user.email.toLowerCase().includes(lowerSearch);
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });

    filtered.sort((a, b) => {
      if (a.role === 'ADMIN' && b.role !== 'ADMIN') return -1;
      if (a.role !== 'ADMIN' && b.role === 'ADMIN') return 1;
      return b.id - a.id;
    });
    return filtered;
  }, [users, searchTerm, roleFilter]);

  const totalPages = Math.ceil(processedUsers.length / itemsPerPage);
  const currentUsers = processedUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const handlePageChange = (event, value) => setCurrentPage(value);

  const statsData = useMemo(() => ({
    total: users.length,
    admin: users.filter((u) => u.role === "ADMIN").length,
    user: users.filter((u) => u.role === "USER").length,
  }), [users]);

  if (loading) return <div className="p-6 text-center">Đang tải...</div>;

  return (
    <>
      <SuccessToast show={toastInfo.show} message={toastInfo.message} onClose={() => setToastInfo({ show: false, message: '' })} />
      <ConfirmModal open={!!userToDelete} onClose={() => setUserToDelete(null)} onConfirm={handleConfirmDelete} title="Xác nhận xóa" message={`Bạn có chắc muốn xóa người dùng #${userToDelete}?`} />

      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="bg-white shadow rounded-lg p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Quản lý Người dùng</h1>
              <p className="text-gray-600 mt-1 text-sm">Quản lý tất cả người dùng và quyền hạn</p>
            </div>
            <div className="flex w-full sm:w-auto items-center justify-between gap-4">
              <div className="text-right">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600">{users.length}</div>
                <div className="text-sm text-gray-500">Tổng người dùng</div>
              </div>
              <button onClick={() => handleOpenEditModal()} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2">
                <PlusIcon className="h-4 w-4" />
                <span>Thêm người dùng</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="flex items-center p-4 bg-white shadow rounded-lg hover:shadow-xl transition-shadow duration-300">
            <div className="p-2 sm:p-3 bg-blue-100 rounded-lg mr-4">
              <UserGroupIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <div className="text-sm">
              <p className="text-gray-500">Tổng số</p>
              <p className="font-bold text-2xl text-blue-600">{statsData.total}</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-white shadow rounded-lg hover:shadow-xl transition-shadow duration-300">
            <div className="p-2 sm:p-3 bg-purple-100 rounded-lg mr-4">
              <ShieldCheckIcon className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
            </div>
            <div className="text-sm">
              <p className="text-gray-500">Quản trị viên</p>
              <p className="font-bold text-2xl text-purple-600">{statsData.admin}</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-white shadow rounded-lg hover:shadow-xl transition-shadow duration-300">
            <div className="p-2 sm:p-3 bg-green-100 rounded-lg mr-4">
              <UserIcon className="h-5 w-5 sm:h-6 sm:w-6  text-green-600" />
            </div>
            <div className="text-sm">
              <p className="text-gray-500">Khách hàng</p>
              <p className="font-bold text-2xl text-green-600">{statsData.user}</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input type="text" placeholder="Tìm theo tên hoặc email..." className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
              <option value="all">Tất cả vai trò</option>
              <option value="ADMIN">Quản trị viên</option>
              <option value="USER">Khách hàng</option>
            </select>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        {/* Users List */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Desktop Table View */}
          <div className="overflow-x-auto hidden md:block">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Người dùng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vai trò</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày tham gia</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thống kê</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hành động</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleInfo(user.role).color}`}>{getRoleInfo(user.role).text}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString("vi-VN")}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{user.orderCount} đơn hàng</div>
                      <div className="text-green-600 font-medium">{new Intl.NumberFormat('vi-VN').format(user.totalSpent)} đ</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {currentAdmin.email !== user.email && (
                        <div className="flex space-x-2">
                          <button onClick={() => handleOpenEditModal(user)} className="text-green-600 p-1" title="Sửa">
                            <PencilIcon className="h-4 w-4" />
                          </button
                          ><button onClick={() => handleDeleteClick(user.id)} className="text-red-600 p-1" title="Xóa">
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Mobile Card View */}
          <div className="md:hidden">
            {currentUsers.map((user) => (
              <div key={user.id} className="border-b p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-gray-900">{user.fullName}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleInfo(user.role).color}`}>{getRoleInfo(user.role).text}</span>
                </div>
                <div className="flex justify-between items-center text-sm pt-2 border-t">
                  <div>
                    <p className="text-gray-500">{user.orderCount} đơn hàng</p>
                    <p className="text-green-600 font-medium">{new Intl.NumberFormat('vi-VN').format(user.totalSpent)} đ</p>
                  </div>
                  {currentAdmin.email !== user.email && (
                    <div className="flex justify-end space-x-2">
                      <button onClick={() => handleOpenEditModal(user)} className="p-2 text-green-600" title="Sửa">
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button onClick={() => handleDeleteClick(user.id)} className="p-2 text-red-600" title="Xóa">
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <CustomPagination count={totalPages} page={currentPage} onChange={handlePageChange} />
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-gray-500/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-medium">{editingUser.id ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}</h3>
              <button onClick={handleCloseModal}><XMarkIcon className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên *</label>
                  <input required name="fullName" value={editingUser.fullName} onChange={(e) => setEditingUser({ ...editingUser, fullName: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input required type="email" name="email" value={editingUser.email} onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu {editingUser.id ? "(Để trống nếu không đổi)" : "*"}</label>
                  <input type={editingUser.id ? "password" : "text"} name="password" required={!editingUser.id} minLength={!editingUser.id ? 6 : 0} value={editingUser.password} onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
                  <select name="role" value={editingUser.role} onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm">
                    <option value="USER">Khách hàng</option>
                    <option value="ADMIN">Quản trị viên</option>
                  </select>
                </div>
              </div>
              <div className="px-6 py-4 border-t flex justify-end gap-3">
                <button type="button" onClick={handleCloseModal} className="px-4 py-2 text-sm bg-white border rounded-md hover:bg-gray-50">Hủy</button>
                <button type="submit" className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700">{editingUser.id ? "Lưu thay đổi" : "Thêm mới"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UsersPage;