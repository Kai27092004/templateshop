import api from './api';

export const createOrder = (orderData) => {
  return api.post('/orders', orderData);
};

export const getAllOrdersAdmin = () => {
  return api.get('/admin/orders');
};

export const deleteOrderAdmin = (orderId) => {
  return api.delete(`/admin/orders/${orderId}`);
};

export const confirmOrderPayment = (orderId) => {
  return api.post(`/orders/${orderId}/confirm-payment`);
};

export const cancelOrder = (orderId) => {
  return api.post(`/orders/${orderId}/cancel`);
};