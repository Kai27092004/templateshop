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
  return api.post('/templates', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const updateTemplate = (id, formData) => {
  return api.put(`/templates/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteTemplate = (id) => {
  return api.delete(`/templates/${id}`);
};