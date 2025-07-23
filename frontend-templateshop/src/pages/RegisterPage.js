import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authService';

const RegisterPage = () => {
  // Dùng useNavigate để điều hướng sau khi đăng ký thành công
  const navigate = useNavigate();

  // Dùng useState để quản lý trạng thái của form
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Hàm xử lý khi người dùng thay đổi giá trị trong input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Hàm xử lý khi form được submit
  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định của form
    setError('');
    setSuccess('');
    try {
      // Gọi API đăng ký từ authService
      const response = await registerUser(formData);
      setSuccess(response.data); // "Đăng ký người dùng thành công!"
      // Chờ 2 giây rồi chuyển hướng đến trang đăng nhập
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      // Xử lý lỗi trả về từ backend
      if (err.response && err.response.data) {
        // Lỗi validation hoặc email đã tồn tại
        const errorData = err.response.data;
        if (typeof errorData === 'string') {
          setError(errorData);
        } else {
          const errorMessages = Object.values(errorData).join(', ');
          setError(errorMessages);
        }
      } else {
        setError('Đã có lỗi xảy ra. Vui lòng thử lại.');
      }
    }
  };
  return (
    <div className="min-h-screen bg-[#eaf3f7] py-10 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#7c3aed] mb-6 text-center">Đăng ký miễn phí</h1>
        {/* Form đăng ký */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="fullName" className="block text-gray-700 font-medium mb-1">Họ và tên</label>
            <input
              type="text"
              name="fullName"
              id="fullName"
              placeholder="Nhập họ tên"
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Nhập email"
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          {/* Hiển thị thông báo lỗi hoặc thành công */}
          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}
          <div>
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#38bdf8] text-white font-semibold shadow hover:from-[#6d28d9] hover:to-[#0ea5e9] transition text-lg mt-2"
            >
              Đăng ký
            </button>
          </div>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          Đã có tài khoản {' '}
          <Link to="/login" className="text-[#7c3aed] font-medium hover:underline">
            Đăng nhập ngay
          </Link>
        </p>
      </div>

    </div>
  );
};

export default RegisterPage;