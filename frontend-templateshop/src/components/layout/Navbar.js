import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

const Navbar = () => {
  // Lấy trạng thái và hàm logout
  const { isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  // Chuyển về trang đăng nhập sau khi logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  return (
    <nav className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">TemplateShop</Link>
        <div className="space-x-4">
          <Link to="/" className="hover:text-gray-300">Trang Chủ</Link>
          <Link to="/cart" className="relative hover:text-gray-300">
            Giỏ hàng
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
          {isAuthenticated ? (
            // Nếu đã đăng nhập
            <>
              <Link to="/profile" className="hover:text-gray-300">Hồ sơ</Link>
              <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded">
                Đăng xuất
              </button>
            </>
          ) : (
            // Nếu chưa đăng nhập
            <>
              <Link to="/login" className="hover:text-gray-300">Đăng Nhập</Link>
              <Link to="/register" className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded">Đăng Ký</Link>
            </>
          )
          }
        </div>
      </div>
    </nav>
  );
};

export default Navbar;