import React, { useState, useContext, useEffect, createContext } from "react";
import { jwtDecode } from 'jwt-decode';

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
      try {
        const decodedToken = jwtDecode(tokenFromStorage);
        // Kiểm tra xem token đã hết hạn chưa
        if (decodedToken.exp * 1000 < Date.now()) {
          logout(); // Nếu hết hạn, tự động đăng xuất
        } else {
          setToken(tokenFromStorage);
          // Lưu thông tin người dùng (email và roles) vào state
          setUser({ email: decodedToken.sub, roles: decodedToken.roles || [] });
        }
      } catch (error) {
        console.error("Invalid token found in localStorage", error);
        logout();
      }
    }
    setLoading(false);
  }, []);

  // Hàm để đăng nhập
  const login = (newToken) => {
    try {
      const decodedToken = jwtDecode(newToken);
      const userPayload = { email: decodedToken.sub, roles: decodedToken.roles || [] };

      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userPayload);

      return userPayload; // Trả về thông tin user để nơi gọi có thể dùng ngay
    } catch (error) {
      console.error("Failed to decode token on login", error);
      logout(); // Nếu token lỗi, dọn dẹp state
      return null;
    }
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
    isAdmin: user?.roles.includes('ROLE_ADMIN'), // Một boolean tiện ích để kiểm tra quyền admin
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