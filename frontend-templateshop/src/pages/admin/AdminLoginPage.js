import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { loginUser } from '../../services/authService';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { login, logout } = useAuth(); // Lấy cả hàm logout
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await loginUser(formData);
      const token = response.data.accessToken;

      // Gọi hàm login thật sự để cập nhật trạng thái toàn cục
      const userPayload = login(token);

      // Kiểm tra vai trò từ kết quả trả về của hàm login
      if (userPayload && userPayload.roles.includes('ROLE_ADMIN')) {
        // Nếu là admin, chuyển hướng đến dashboard
        navigate('/admin');
      } else {
        // Nếu không phải admin, báo lỗi và đăng xuất ngay lập tức
        setError('Tài khoản của bạn không có quyền quản trị.');
        logout(); // Xóa token và state không hợp lệ
      }
    } catch (err) {
      setError('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center text-gray-900">Đăng Nhập</h2>
        {/* Form đăng nhập */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              required
              minLength="6"
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          {/* Hiển thị thông báo lỗi */}
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Đăng nhập
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;