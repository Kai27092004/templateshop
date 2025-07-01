import React, { useState, useEffect } from 'react';
import { getAllUsers, deleteUser, updateUser, createUser } from '../../services/userService';
import { useAuth } from '../../contexts/AuthContext';
import UserForm from './UserForm';

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { user: currentAdmin } = useAuth();

  // State để quản lý form
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await getAllUsers();
      setUsers(response.data);
    } catch (err) {
      setError('Không thể tải danh sách người dùng');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này không?')) {
      try {
        await deleteUser(userId);
        await fetchUsers();
      } catch (err) {
        setError(` Lỗi khi xóa người dùng: ${err.response?.data || err.message}`);
      }
    }
  };

  // 2. Hàm xử lý khi submit form
  const handleFormSubmit = async (data) => {
    setError('');
    try {
      if (editingUser) {
        await updateUser(editingUser.id, data);
      } else {
        await createUser(data);
      }
      closeForm();
      await fetchUsers();
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data || err.message;
      setError(`Đã có lỗi xảy ra: ${errorMsg}`);
    }
  };

  // 3. Các hàm để mở và đóng form
  const openCreateForm = () => {
    setEditingUser(null);
    setIsFormVisible(true);
  };

  const openEditForm = (user) => {
    setEditingUser(user);
    setIsFormVisible(true);
  };

  const closeForm = () => {
    setIsFormVisible(false);
    setEditingUser(null);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold mb-4">Quản lý Người dùng</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button onClick={openCreateForm} className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
          + Thêm Người dùng
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 text-left">ID</th>
              <th className="py-2 px-4 text-left">Họ và tên</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Vai trò</th>
              <th className="py-2 px-4 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="5" className="text-center py-4">Đang tải...</td></tr>
            ) : (
              users.map(user => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{user.id}</td>
                  <td className="py-2 px-4">{user.fullName}</td>
                  <td className="py-2 px-4">{user.email}</td>
                  <td>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'ADMIN' ? 'bg-green-200 text-green-800' : 'bg-blue-200 text-blue-800'
                      }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-2 px-4">
                    {currentAdmin?.email !== user.email && (
                      <div className="flex space-x-2">
                        <button onClick={() => openEditForm(user)} className="text-yellow-500 hover:underline">Sửa</button>
                        <button onClick={() => handleDelete(user.id)}>Xóa</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 4. Hiển thị form modal */}
      {isFormVisible && (
        <UserForm
          initialData={editingUser}
          onSubmit={handleFormSubmit}
          onCancel={closeForm}
        />
      )}
    </div>
  );
};

export default UserManager;