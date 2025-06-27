import axios from 'axios';

// Tạo một instance của axios với cấu hình cơ bản
const api = axios.create({
  baseURL: "http://localhost:8080/api/v1", //URL gốc của backend
  headers: {
    'Content-Type': 'application/json'
  },
});

api.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage
    const token = localStorage.getItem('token');
    // Nếu có token, đính kèm nó vào header Authorization
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config; // Trả về config đã được chỉnh sửa
  },
  (error) => {
    // Xử lý lỗi nếu có
    return Promise.reject(error);
  }
);

export default api;