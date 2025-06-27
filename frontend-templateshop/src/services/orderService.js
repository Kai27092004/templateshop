import api from './api';

export const createOrder = (orderData) => {
  return api.post('/orders', orderData);
};