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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center text-gray-900">Đăng ký tài khoản</h2>
        {/* Form đăng ký */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="fullName" className="text-sm font-medium text-gray-700">Họ và tên</label>
            <input
              type="text"
              name="fullName"
              id="fullName"
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>
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
          {/* Hiển thị thông báo lỗi hoặc thành công */}
          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Đăng ký
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-gray-600">
          Đã có tài khoản {' '}
          <Link to="/login" className="font-medium text-blue-600 hover:underline">
            Đăng nhập ngay
          </Link>
        </p>
      </div>

    </div>
  );
};

export default RegisterPage;