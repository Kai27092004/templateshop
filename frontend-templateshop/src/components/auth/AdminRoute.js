import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <div>Đang tải dữ liệu.....</div>;
  }

  if (!isAuthenticated || !isAdmin) {
    // Nếu không đăng nhập hoặc không phải admin, đá về trang chủ
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminRoute;