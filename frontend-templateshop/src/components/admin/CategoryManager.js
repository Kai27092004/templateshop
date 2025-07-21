import React, { useState, useEffect } from "react";
import { PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon, TagIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { getAllCategories, createCategory, updateCategory, deleteCategory } from "../../services/categoryService";
import ConfirmModal from "../ui/ConfirmModal";
import SuccessToast from "../ui/SuccessToast";

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [toastInfo, setToastInfo] = useState({ show: false, message: '' });
  const [searchTerm, setSearchTerm] = useState("");

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await getAllCategories();
      setCategories(response.data);
      setError('');
    } catch (err) {
      setError('Không thể tải danh sách danh mục.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim("-")
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    let slugValue = editingCategory.slug;
    if (name === 'name') {
      slugValue = generateSlug(value);
    }
    setEditingCategory(prev => ({ ...prev, [name]: value, slug: name === 'name' ? slugValue : prev.slug }));
  };

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory({ ...category });
    } else {
      setEditingCategory({ name: '', slug: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const isEditing = !!editingCategory.id;
    const categoryData = { name: editingCategory.name, slug: editingCategory.slug };

    try {
      if (isEditing) {
        await updateCategory(editingCategory.id, categoryData);
        setToastInfo({ show: true, message: 'Cập nhật danh mục thành công!' });
      } else {
        await createCategory(categoryData);
        setToastInfo({ show: true, message: 'Thêm danh mục thành công!' });
      }
      fetchCategories();
      handleCloseModal();
    } catch (err) {
      setError(` Lỗi: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleDeleteClick = (categoryId) => {
    setCategoryToDelete(categoryId);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    try {
      await deleteCategory(categoryToDelete);
      setToastInfo({ show: true, message: 'Xóa danh mục thành công' });
      fetchCategories();
    } catch (err) {
      setError(`Lỗi khi xóa: ${err.response?.data?.message || err.message}`);
    } finally {
      setCategoryToDelete(null);
    }
  };

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <SuccessToast show={toastInfo.show} message={toastInfo.message} onClose={() => setToastInfo({ show: false, message: '' })} />
      <ConfirmModal open={!!categoryToDelete} onClose={() => setCategoryToDelete(null)} onConfirm={handleConfirmDelete} title="Xác nhận xóa" message={`Bạn có chắc muốn xóa danh mục #${categoryToDelete}?`} />

      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="bg-white shadow rounded-lg p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Quản lý Danh mục</h1>
              <p className="text-gray-600 mt-1 text-sm">Quản lý các danh mục sản phẩm template</p>
            </div>
            <div className="flex w-full sm:w-auto items-center gap-4">
              <div className="text-center flex-1 sm:flex-none">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600">{categories.length}</div>
                <div className="text-sm text-gray-500">Tổng danh mục</div>
              </div>
              <button
                onClick={() => handleOpenModal()}
                className="flex-1 sm:flex-none bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <PlusIcon className="w-4 h-4" />
                <span>Thêm mới</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white shadow rounded-lg p-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="input"
              placeholder="Tìm kiếm danh mục theo tên hoặc slug..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        {/* Categories Grid */}
        {loading ? <div className="text-center p-6">Đang tải...</div> : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {filteredCategories.map((category) => (
              <div key={category.id} className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200 flex flex-col">
                <div className="p-5 flex-grow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                        <TagIcon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-base font-medium text-gray-900 truncate">{category.name}</h3>
                        <p className="text-sm text-gray-500 truncate">{category.slug}</p>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-gray-100 pt-3 mt-3">
                    <div className="text-sm text-gray-500">Số sản phẩm</div>
                    <div className="text-xl font-bold text-blue-600">{category.productCount}</div>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 flex justify-end items-center gap-2">
                  <button
                    onClick={() => handleOpenModal(category)}
                    className="text-green-600 hover:text-green-900 p-2 rounded-md hover:bg-green-50"
                    title="Chỉnh sửa"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(category.id)}
                    className="text-red-600 hover:text-red-900 p-2 rounded-md hover:bg-red-50"
                    title="Xóa"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredCategories.length === 0 && (
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <TagIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy danh mục</h3>
            <p className="text-gray-500 mb-4 text-sm"> {searchTerm ? " Không có danh mục nào phù hợp." : "Chưa có danh mục nào."}</p>
          </div>
        )}
      </div >

      {/* Add/Edit Modal */}
      {
        isModalOpen && (
          <div className="fixed inset-0 bg-gray-500/30 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="px-6 py-4 border-b flex justify-between items-center">
                <h3 className="text-lg font-medium">{editingCategory.id ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}</h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleFormSubmit}>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên danh mục *</label>
                    <input
                      type="text" required
                      name="name"
                      value={editingCategory.name} onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      placeholder="VD: Bất động sản"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                    <input
                      type="text" required
                      name="slug"
                      value={editingCategory.slug} onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      placeholder="VD: bat-dong-san" />
                  </div>
                </div>
                <div className="px-6 py-4 border-t flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700">
                    {editingCategory.id ? "Lưu thay đổi" : "Thêm mới"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )
      }
    </>
  );
};
export default CategoryManager;