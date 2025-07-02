import React, { useState, useEffect } from 'react';
import { getAllCategories } from '../../services/categoryService';
// Component này nhận các prop để hoạt động
// initialData: Dữ liệu ban đầu (cho chế độ sửa)
// onSubmit: Hàm sẽ được gọi khi form được submit
// onCancel: Hàm sẽ được gọi khi bấm nút Hủy

const TemplateForm = ({ initialData, onSubmit, onCancel }) => {

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    categoryId: '',
    liveDemoUrl: '',
  });

  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [templateFile, setTemplateFile] = useState(null);
  const [categories, setCategories] = useState([]);

  // Tải danh sách danh mục để hiển thị trong dropdown
  useEffect(() => {
    getAllCategories().then(response => {
      setCategories(response.data);
    });
  }, []);

  // Nếu có initialData (chế độ sửa), điền dữ liệu vào form
  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id,
        name: initialData.name || '',
        slug: initialData.slug || '',
        description: initialData.description || '',
        price: initialData.price || '',
        categoryId: initialData.category?.id || '',
        liveDemoUrl: initialData.liveDemoUrl || '',
      });
    } else {
      setFormData({ id: null, name: '', slug: '', description: '', price: '', categoryId: '', liveDemoUrl: '' });
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleThumbnailChange = (e) => {
    setThumbnailFile(e.target.files[0]);
  };

  const handleFileChange = (e) => {
    setTemplateFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, thumbnailFile, templateFile });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">
          {initialData ? 'Chỉnh sửa Template' : 'Thêm Template mới'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name='name' value={formData.name} onChange={handleInputChange} placeholder='Tên Template' required className="w-full p-2 border rounded" />
          <input name='slug' value={formData.slug} onChange={handleInputChange} placeholder='Slug' required className="w-full p-2 border rounded" />
          <textarea name='description' value={formData.description} onChange={handleInputChange} placeholder="Mô tả" className="w-full p-2 border rounded" />
          <input type='number' name='price' value={formData.price} onChange={handleInputChange} placeholder='Giá' required className="w-full p-2 border rounded" />
          <input type="text" name="liveDemoUrl" value={formData.liveDemoUrl} onChange={handleInputChange} placeholder="URL của trang Live Demo" className="w-full p-2 border rounded" />
          <select name='categoryId' value={formData.categoryId} onChange={handleInputChange} required className="w-full p-2 border rounded">
            <option value="">-- Chọn Danh mục --</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <div>
            <label className="block text-sm font-medium text-gray-700">Ảnh thumbnail</label>
            <input type='file' onChange={handleThumbnailChange} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">File Template (.zip)</label>
            <input type='file' onChange={handleFileChange} required={!initialData} className="w-full p-2 border rounded" />
          </div>
          <div className="flex justify-end space-x-4">
            <button type='button' onClick={onCancel} className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600">
              Hủy
            </button>
            <button type='submit' className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TemplateForm;