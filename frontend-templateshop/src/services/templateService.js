import api from './api';

// Hàm gọi API để lấy tất cả các template
export const getAllTemplates = () => {
  return api.get('/templates');
};

export const getTemplateBySlug = (slug) => {
  return api.get(`/templates/${slug}`);
};
