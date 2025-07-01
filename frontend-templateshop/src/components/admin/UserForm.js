import React, { useState, useEffect } from 'react';

const UserForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'USER',
  });

  const isEditing = !!initialData; // Kiểm tra xem có phải đang ở chế độ sửa không

  useEffect(() => {
    if (isEditing) {
      setFormData({
        fullName: initialData.fullName || '',
        email: initialData.email || '',
        password: '',
        role: initialData.role || 'USER',
      });
    } else {
      setFormData({ fullName: '', email: '', password: '', role: 'USER' });
    }
  }, [initialData, isEditing]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">{isEditing ? 'Chỉnh sửa Người dùng' : 'Thêm Người dùng mới'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Họ và tên" required className="w-full p-2 border rounded" />
          <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email" required className="w-full p-2 border rounded" />
          <input type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder={isEditing ? 'Nhập mật khẩu mới (để trống nếu không đổi)' : 'Mật khẩu'} required={!isEditing} minLength={isEditing ? 0 : 6} className="w-full p-2 border rounded" />
          <select name="role" value={formData.role} onChange={handleInputChange} required className="w-full p-2 border rounded">
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
          <div className="flex justify-end space-x-4">
            <button type='button' onClick={onCancel} className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600">Hủy</button>
            <button type='submit' className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Lưu</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;