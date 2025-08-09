import api from './api';

// Hàm gọi API để lấy tất cả các template
export const getAllTemplates = () => {
  return api.get('/templates');
};

export const getTemplateBySlug = (slug) => {
  return api.get(`/templates/${slug}`);
};

// --- API cho Admin ---
export const createTemplate = (formData) => {
  // Thêm /admin vào đường dẫn
  return api.post('/admin/templates', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const updateTemplate = (id, formData) => {
  // Thêm /admin vào đường dẫn
  return api.put(`/admin/templates/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteTemplate = (id) => {
  // Thêm /admin vào đường dẫn
  return api.delete(`/admin/templates/${id}`);
};