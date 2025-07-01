import api from './api';

// --- API cho người dùng thường ---
export const getUserProfile = () => {
  return api.get('/account/profile');
};

export const getOrderHistory = () => {
  return api.get('/account/orders');
};

export const getDownloadUrl = (templateId) => {
  const token = localStorage.getItem('token');
  return `${api.defaults.baseURL}/account/download/${templateId}?token=${token}`;
}

// --- API cho Admin ---
export const getAllUsers = () => {
  return api.get('/admin/users');
};

export const deleteUser = (userId) => {
  return api.delete(`/admin/users/${userId}`);
};

export const createUser = (data) => {
  return api.post('/admin/users', data);
};

export const updateUser = (userId, data) => {
  return api.put(`/admin/users/${userId}`, data)
};