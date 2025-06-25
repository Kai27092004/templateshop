import axios from 'axios';

// Tạo một instance của axios với cấu hình cơ bản
const api = axios.create({
  baseURL: "http://localhost:8080/api/v1", //URL gốc của backend
  headers: {
    'Content-Type': 'application/json'
  },
});

export default api;