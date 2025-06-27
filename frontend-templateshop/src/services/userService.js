import api from './api';

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