import React, { useState, useContext, useEffect, createContext } from "react";
import api from "../services/api";

// 1. Tạo Context
const AuthContext = createContext();

// 2. Tạo Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mỗi khi token thay đổi, cập nhật header của axios
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer &{token}`;
      localStorage.setItem('token', token);
      // Bạn có thể thêm logic để lấy thông tin user từ token ở đây nếu cần
    } else {
      delete api.defaults.headers.common['Authoriztion'];
      localStorage.removeItem('token');
    }
    setLoading(false);
  }, [token]);

  // Hàm để đăng nhập
  const login = (newToken) => {
    setToken(newToken);
  };

  // Hàm để đăng xuất
  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const authContextValue = {
    token,
    user,
    login,
    logout,
    isAuthenticated: !!token, // Một boolean tiện ích để kiểm tra đã đăng nhập chưa
  };

  if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Tạo một custom hook để sử dụng Context dễ dàng hơn
export const useAuth = () => {
  return useContext(AuthContext);
};