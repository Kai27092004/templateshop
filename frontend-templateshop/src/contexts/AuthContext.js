import React, { useState, useContext, useEffect, createContext } from "react";
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('user_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Đổi sang 'user_token'
    const tokenFromStorage = localStorage.getItem('user_token');
    if (tokenFromStorage) {
      try {
        const decodedToken = jwtDecode(tokenFromStorage);
        if (decodedToken.exp * 1000 < Date.now()) {
          logout();
        } else {
          setToken(tokenFromStorage);
          setUser({ email: decodedToken.sub, roles: decodedToken.roles || [] });
        }
      } catch (error) {
        console.error("Invalid user token found in localStorage", error);
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = (newToken) => {
    try {
      const decodedToken = jwtDecode(newToken);
      const userPayload = { email: decodedToken.sub, roles: decodedToken.roles || [] };

      // Đổi sang 'user_token'
      localStorage.setItem('user_token', newToken);
      setToken(newToken);
      setUser(userPayload);
      return userPayload;
    } catch (error) {
      console.error("Failed to decode token on login", error);
      logout();
      return null;
    }
  };

  const logout = () => {
    // Đổi sang 'user_token'
    localStorage.removeItem('user_token');
    setToken(null);
    setUser(null);
  };

  const authContextValue = {
    token,
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!token,
    // Xóa isAdmin vì Context này không quản lý admin nữa
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};