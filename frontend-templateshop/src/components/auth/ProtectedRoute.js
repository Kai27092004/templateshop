import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  // Nếu người dùng chưa được xác thực (chưa đăng nhập)
  if (!isAuthenticated) {
    // Chuyển hướng họ đến trang đăng nhập
    // `state={{ from: location }}`: Lưu lại trang họ đang cố truy cập
    // để có thể quay lại sau khi đăng nhập thành công.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  // Nếu đã đăng nhập, hiển thị component con (trang được bảo vệ)
  return children;
};

export default ProtectedRoute;