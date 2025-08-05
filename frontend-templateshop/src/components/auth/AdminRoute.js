import React from 'react';
import { Navigate } from 'react-router-dom';
// SỬA LẠI IMPORT
import { useAdminAuth } from '../../contexts/AdminAuthContext';

const AdminRoute = ({ children }) => {
  // SỬA LẠI HOOK VÀ CÁC BIẾN
  const { isAuthenticated, isAdmin, loading } = useAdminAuth();

  if (loading) {
    return <div>Đang tải dữ liệu.....</div>;
  }

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminRoute;