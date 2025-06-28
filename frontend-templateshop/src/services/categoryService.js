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
  return api.post('/categories', data);
};

export const updateCategory = (id, data) => {
  return api.put(`/categories/${id}`, data);
};

export const deleteCategory = (id) => {
  return api.delete(`/categories/${id}`);
};