import axios from 'axios';

export const API_BASE_URL = 'http://localhost:8080/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
});

// SỬA ĐỔI INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    let token;

    // Kiểm tra xem URL của request có phải là dành cho admin không
    if (config.url.startsWith('/admin')) {
      // Nếu là API admin, ưu tiên lấy admin_token
      token = localStorage.getItem('admin_token');
    } else {
      // Ngược lại, lấy user_token cho các API thông thường
      token = localStorage.getItem('user_token');
    }

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export default api;