import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">TemplateShop</Link>
        <div className="space-x-4">
          <Link to="/" className="hover:text-gray-300">Trang Chủ</Link>
          <Link to="/login" className="hover:text-gray-300">Đăng Nhập</Link>
          <Link to="/register" className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded">Đăng Ký</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;