import React, { useState, useContext, useEffect, createContext } from "react";

// 1. Tạo Context
const AuthContext = createContext();

// 2. Tạo Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // useEffect này bây giờ chỉ chạy một lần lúc khởi động
  useEffect(() => {
    const tokenFromStorage = localStorage.getItem('token');
    if (tokenFromStorage) {
      setToken(tokenFromStorage);
    }
    setLoading(false);
  }, []);

  // Hàm để đăng nhập
  const login = (newToken) => {
    localStorage.setItem('token', newToken); // Lưu vào localStorage
    setToken(newToken); // Cập nhật state
  };

  // Hàm để đăng xuất
  const logout = () => {
    localStorage.removeItem('token'); // Xóa khỏi localStorage
    setToken(null); // Cập nhật state
    setUser(null);
  };

  const authContextValue = {
    token,
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!token, // Một boolean tiện ích để kiểm tra đã đăng nhập chưa
  };

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