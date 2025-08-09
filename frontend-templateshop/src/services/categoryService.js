import api from './api';

// --- API Công khai ---
export const getAllCategories = () => {
  return api.get('/categories');
};

export const getCategoryById = (id) => {
  return api.get(`/categories/${id}`);
};

// --- API cho Admin ---
export const createCategory = (data) => {
  // Thêm /admin vào đường dẫn
  return api.post('/admin/categories', data);
};

export const updateCategory = (id, data) => {
  return api.put(`/admin/categories/${id}`, data);
};

export const deleteCategory = (id) => {
  return api.delete(`/admin/categories/${id}`);
};