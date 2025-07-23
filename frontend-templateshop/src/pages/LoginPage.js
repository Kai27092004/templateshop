import React, { useState } from 'react';
import { loginUser } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || "/";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Gọi api để đăng nhập
      const response = await loginUser(formData);
      // Nếu thành công, gọi hàm login từ context để lưu token
      login(response.data.accessToken);
      // Điều hướng về trang chủ 
      navigate(from, { replace: true });
    } catch (err) {
      setError('Đăng nhập thất bại. Vui lòng kiểm tra email hoặc mật khẩu.');
    }
  };
  return (
    <div className="min-h-screen bg-[#eaf3f7] py-10 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#7c3aed] mb-6 text-center">Đăng nhập</h1>
        {/* Form đăng nhập */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Nhập email"
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#7c3aed]"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Nhập mật khẩu"
              required
              minLength="6"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#7c3aed]"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          {/* Hiển thị thông báo lỗi */}
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div>
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#38bdf8] text-white font-semibold shadow hover:from-[#6d28d9] hover:to-[#0ea5e9] transition text-lg mt-2"
            >
              Đăng nhập
            </button>
          </div>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          Chưa có tài khoản? {' '}
          <Link to="/register" className="text-[#7c3aed] font-medium hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;