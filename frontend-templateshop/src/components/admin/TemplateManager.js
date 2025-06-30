import React, { useState, useEffect } from 'react';
import { getAllTemplates, deleteTemplate, updateTemplate, createTemplate } from '../../services/templateService';
import TemplateForm from './TemplateForm';
import { API_BASE_URL } from '../../services/api';

const TemplateManager = () => {

  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // State để quản lý việc hiển thị modal form
  const [isFormVisible, setIsFormVisible] = useState(false);
  // State để lưu dữ liệu của template đang được chỉnh sửa
  const [editingTemplate, setEditingTemplate] = useState(null);

  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      const response = await getAllTemplates();
      setTemplates(response.data);
    } catch (err) {
      setError('Không thể tải danh sách Templates.')
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleFormSubmit = async (data) => {
    // Tạo đối tượng FormData để gửi file
    const formData = new FormData();

    // Phần data JSON cần được chuyển thành chuỗi và gửi đi
    const templateData = {
      name: data.name,
      slug: data.slug,
      description: data.description,
      price: data.price,
      categoryId: data.categoryId,
    };
    formData.append('data', JSON.stringify(templateData));

    // Đính kèm các file nếu có
    if (data.thumbnailFile) {
      formData.append('thumbnail', data.thumbnailFile);
    }
    if (data.templateFile) {
      formData.append('file', data.templateFile);
    }

    setIsLoading(true);
    try {
      if (data.id) {
        await updateTemplate(data.id, formData);
      } else {
        await createTemplate(formData);
      }
      closeForm();
      await fetchTemplates();
    } catch (err) {
      setError(` Đã có lỗi xảy ra: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Các hàm để mở và đóng form
  const openCreateForm = () => {
    setEditingTemplate(null);
    setIsFormVisible(true);
  };

  const openEditForm = (template) => {
    setEditingTemplate(template);
    setIsFormVisible(true);
  };

  const closeForm = () => {
    setIsFormVisible(false);
    setEditingTemplate(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa template này? Thao tác này sẽ cả file vật lý.')) {
      try {
        await deleteTemplate(id);
        await fetchTemplates();
      } catch (err) {
        setError(` Lỗi khi xóa template: ${err.response?.data?.message || err.message}`);
      }
    }
  };

  const formattedPrice = (price) => new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);



  return (
    <div className="p-6 bg-white rounded-lg shadow-md mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold"> Quản lý Template</h2>
        {/* 4. Nút bấm để mở form thêm mới */}
        <button onClick={openCreateForm} className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
          + Thêm template mới
        </button>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {/* Bảng hiển thị danh sách template */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 text-left">ID</th>
              <th className="py-2 px-4 text-left">Ảnh</th>
              <th className="py-2 px-4 text-left">Tên Template</th>
              <th className="py-2 px-4 text-left">Danh mục</th>
              <th className="py-2 px-4 text-left">Giá</th>
              <th className="py-2 px-4 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="6" className="text-center py-4">Đang tải....</td></tr>
            ) : (
              templates.map(template => {
                // 2. Xây dựng URL đầy đủ cho ảnh thumbnail
                const imageUrl = template.thumbnailUrl
                  ? `${API_BASE_URL}/files/${template.thumbnailUrl}`
                  : 'https://placehold.co/100x60';
                return (
                  <tr key={template.id} className="border-b">
                    <td className="py-2 px-4">{template.id}</td>
                    <td className="py-2 px-4">
                      <img
                        src={imageUrl}
                        alt={template.name}
                        className="w-24 h-auto object-cover rounded"
                      />
                    </td>
                    <td className="py-2 px-4 font-semibold">{template.name}</td>
                    <td className="py-2 px-4">{template.category?.name || 'N/A'}</td>
                    <td className="py-2 px-4">{formattedPrice(template.price)}</td>
                    <td className="py-2 px-4">
                      <div className="flex space-x-2">
                        <button onClick={() => openEditForm(template)} className="text-yellow-500 hover:underline">Sửa</button>
                        <button
                          onClick={() => handleDelete(template.id)}
                          className="text-red-500 hover:underline"
                        >Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {/* 6. Hiển thị form modal nếu isFormVisible là true */}
      {isFormVisible && (
        <TemplateForm
          initialData={editingTemplate}
          onSubmit={handleFormSubmit}
          onCancel={closeForm}
        />
      )}
    </div>
  );
};

export default TemplateManager;