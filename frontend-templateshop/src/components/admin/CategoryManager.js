import React, { useState, useEffect } from 'react';
import { getAllCategories, createCategory, updateCategory, deleteCategory } from '../../services/categoryService';

const CategoryManager = () => {

  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // State cho form (dùng cho cả Thêm mới và Chỉnh sửa)
  const [formData, setFormData] = useState({ id: null, name: '', slug: '' });
  const [isEditing, setIsEditing] = useState(false);

  // Hàm để tải danh sách danh mục
  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await getAllCategories();
      setCategories(response.data);
    } catch (err) {
      setError('Không thể tải danh sách danh mục.')
    } finally {
      setIsLoading(false);
    }
  };

  // Tải dữ liệu khi component được render lần đầu
  useEffect(() => {
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Hàm xử lý khi submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const categoryData = { name: formData.name, slug: formData.slug };

    try {
      if (isEditing) {
        // Chế độ chỉnh sửa
        await updateCategory(formData.id, categoryData);
      } else {
        // Chế độ thêm mới
        await createCategory(categoryData);
      }
      resetForm();
      await fetchCategories();
    } catch (err) {
      setError(`Đã có lỗi xảy ra: ${err.response?.data?.message || err.message}`);
    }
  };

  // Hàm xử lý khi bấm nút "Chỉnh sửa"
  const handleEdit = (category) => {
    setIsEditing(true);
    setFormData({ id: category.id, name: category.name, slug: category.slug });
  };

  // Hàm xử lý khi bấm nút "Xóa"
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này không?')) {
      try {
        await deleteCategory(id);
        await fetchCategories();
      } catch (err) {
        setError(`Lỗi khi xóa: ${err.response?.data?.message || err.message}`)
      }
    }
  };

  // Hàm để reset form về trạng thái ban đầu
  const resetForm = () => {
    setIsEditing(false);
    setFormData({ id: null, name: '', slug: '' });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-4">Quản lý danh mục</h2>
      {/* Form để Thêm mới / Chỉnh sửa */}
      <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded-lg">
        <h3 className="text-lg font-semibold mb-2">{isEditing ? 'Chỉnh sửa Danh mục' : 'Thêm Danh mục mới'}</h3>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder='Tên danh mục'
            required
            className="p-2 border rounded"
          />
          <input
            type='text'
            name='slug'
            value={formData.slug}
            onChange={handleInputChange}
            placeholder='Slug (vd: ten-danh-muc)'
            required
            className="p-2 border rounded"
          />
          <div className="flex space-x-2">
            <button type='submit' className="flex-1 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
              {isEditing ? 'Lưu thay đổi' : 'Thêm mới'}
            </button>
            {isEditing && (
              <button type='button' onClick={resetForm} className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600">
                Hủy
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Bảng hiển thị danh sách danh mục */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 text-left">ID</th>
              <th className="py-2 px-4 text-left">Tên</th>
              <th className="py-2 px-4 text-left">Slug</th>
              <th className="py-2 px-4 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="4" className="text-center py-4">Đang tải....</td></tr>
            ) : (
              categories.map(cat => (
                <tr key={cat.id} className="border-b">
                  <td className="py-2 px-4">{cat.id}</td>
                  <td className="py-2 px-4">{cat.name}</td>
                  <td className="py-2 px-4">{cat.slug}</td>
                  <td className="py-2 px-4 flex space-x-2">
                    <button onClick={() => handleEdit(cat)} className="text-yellow-500 hover:underline">Sửa</button>
                    <button onClick={() => handleDelete(cat.id)} className="text-red-500 hover:underline">Xóa</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryManager;