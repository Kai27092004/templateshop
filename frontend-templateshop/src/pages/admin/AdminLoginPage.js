import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { loginUser } from '../../services/authService';
import GradientButton from "../../components/ui/GradientButton";

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
    <div class="bg-sky-100 flex justify-center items-center h-screen">
      <div class="w-1/2 h-screen hidden lg:block">
        <img src="https://img.freepik.com/fotos-premium/imagen-fondo_910766-187.jpg?w=826" alt="Login" class="object-cover w-full h-full" />
      </div>
      <div class="lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">
        <h1 class="text-2xl font-semibold mb-4">Đăng Nhập</h1>
        <form onSubmit={handleSubmit}>
          <div class="mb-4 bg-sky-100">
            <label for="username" class="block text-gray-600">Email</label>
            <input type="email"
              name="email"
              id="email"
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={formData.email}
              onChange={handleChange} />
          </div>
          <div class="mb-4">
            <label for="password" class="block text-gray-800">Password</label>
            <input type="password"
              name="password"
              id="password"
              required
              minLength="6"
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={formData.password}
              onChange={handleChange} />
          </div>
          {/* Hiển thị thông báo lỗi */}
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit">
            <GradientButton>
              Đăng Nhập
            </GradientButton>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;