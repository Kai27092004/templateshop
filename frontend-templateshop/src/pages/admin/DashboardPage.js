import React from 'react';
import CategoryManager from '../../components/admin/CategoryManager';
import TemplateManager from '../../components/admin/TemplateManager';

const DashboardPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold">Trang Quản trị</h1>
      <p className="mt-4">Chào mừng Admin! Đây là nơi bạn sẽ quản lý toàn bộ trang web.</p>

      {/* Tích hợp component quản lý danh mục */}
      <CategoryManager />
      <TemplateManager />
    </div>
  );
};

export default DashboardPage;