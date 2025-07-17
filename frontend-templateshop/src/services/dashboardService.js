import api from './api';

export const getDashboardStats = () => {
  return api.get('/admin/dashboard/stats');
};

export const getRevenueChartData = (year) => {
  return api.get('/admin/dashboard/revenue-chart', { params: { year } });
};

export const getOrdersChartData = (year) => {
  return api.get('/admin/dashboard/orders-chart', { params: { year } });
};