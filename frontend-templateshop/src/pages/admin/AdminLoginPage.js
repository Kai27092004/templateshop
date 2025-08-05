import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext'; // <<<<<< SỬA DÒNG N
import { loginUser } from '../../services/authService';
import GradientButton from "../../components/ui/GradientButton";

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { loginAdmin } = useAdminAuth(); // <<<<<< SỬA DÒNG NÀY
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

      // Gọi hàm loginAdmin để cập nhật trạng thái admin
      const adminPayload = loginAdmin(token);

      if (adminPayload) {
        // Nếu là admin, chuyển hướng đến dashboard
        navigate('/admin');
      } else {
        // Nếu không phải admin, báo lỗi. Hàm loginAdmin đã xử lý việc không lưu token
        setError('Tài khoản của bạn không có quyền quản trị.');
      }
    } catch (err) {
      setError('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
    }
  };

  return (
    <div className="bg-sky-100 flex justify-center items-center h-screen">
      <div className="w-1/2 h-screen hidden lg:block">
        <img src="https://img.freepik.com/fotos-premium/imagen-fondo_910766-187.jpg?w=826" alt="Login" className="object-cover w-full h-full" />
      </div>
      <div className="lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">
        <h1 className="text-2xl font-semibold mb-4">Đăng Nhập</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 bg-sky-100">
            <label htmlFor="email" className="block text-gray-600">Email</label>
            <input type="email"
              name="email"
              id="email"
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={formData.email}
              onChange={handleChange} />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-800">Password</label>
            <input type="password"
              name="password"
              id="password"
              required
              minLength="6"
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={formData.password}
              onChange={handleChange} />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <GradientButton type="submit">
            Đăng Nhập
          </GradientButton>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;