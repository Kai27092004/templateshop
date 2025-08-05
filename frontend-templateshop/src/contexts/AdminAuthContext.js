import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem('admin_token');
        } else if (decoded.roles && decoded.roles.includes('ROLE_ADMIN')) {
          setAdminUser({ email: decoded.sub, roles: decoded.roles });
        }
      } catch (e) {
        console.error("Invalid admin token", e);
        localStorage.removeItem('admin_token');
      }
    }
    setLoading(false);
  }, []);

  const loginAdmin = (token) => {
    try {
      const decoded = jwtDecode(token);
      if (decoded.roles && decoded.roles.includes('ROLE_ADMIN')) {
        const adminPayload = { email: decoded.sub, roles: decoded.roles };
        localStorage.setItem('admin_token', token);
        setAdminUser(adminPayload);
        return adminPayload;
      }
      return null;
    } catch (error) {
      console.error("Failed to decode admin token", error);
      return null;
    }
  };

  const logoutAdmin = () => {
    localStorage.removeItem('admin_token');
    setAdminUser(null);
  };

  const value = {
    adminUser,
    // SỬA LẠI DÒNG NÀY: Kiểm tra adminUser trước khi truy cập roles
    isAdmin: adminUser ? adminUser.roles.includes('ROLE_ADMIN') : false,
    isAuthenticated: !!adminUser,
    loading,
    loginAdmin,
    logoutAdmin,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  return useContext(AdminAuthContext);
};