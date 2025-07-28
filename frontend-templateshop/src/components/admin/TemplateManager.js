import React, { useState, useEffect, useMemo } from "react";
import { PlusIcon, EyeIcon, PencilIcon, TrashIcon, XMarkIcon, MagnifyingGlassIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";
import { getAllTemplates, createTemplate, updateTemplate, deleteTemplate } from "../../services/templateService";
import { getAllCategories } from "../../services/categoryService";
import ConfirmModal from "../../components/ui/ConfirmModal";
import SuccessToast from "../../components/ui/SuccessToast";
import CustomPagination from "../../components/ui/CustomPagination"; // Import phân trang
import { API_BASE_URL } from "../../services/api";

const TemplateManager = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // States for Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null); // State cho modal xem chi tiết

  // States for Delete flow and Toast
  const [productToDelete, setProductToDelete] = useState(null);
  const [toastInfo, setToastInfo] = useState({ show: false, message: '' });

  // States for filters and pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6); // 6 sản phẩm mỗi trang

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        getAllTemplates(),
        getAllCategories()
      ]);
      const sortedProducts = productsRes.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setProducts(sortedProducts);
      setCategories(categoriesRes.data);
      setError('');
    } catch (err) {
      setError('Không thể tải dữ liệu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Reset về trang 1 khi filter
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter]);

  // Lọc sản phẩm
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = categoryFilter === 'all' || product.category?.id.toString() === categoryFilter;
      const matchesSearch = searchTerm === '' || product.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, searchTerm, categoryFilter]);

  // Phân trang
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const handlePageChange = (event, value) => setCurrentPage(value);

  // Xử lý slug
  const generateSlug = (name) => name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[đĐ]/g, "d").replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim("-");

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    const val = files ? files[0] : value;

    setEditingProduct(prev => {
      const updatedProduct = { ...prev, [name]: val };
      if (name === 'name') {
        updatedProduct.slug = generateSlug(val);
      }
      return updatedProduct;
    });
  };

  // Mở/Đóng Modals
  const handleOpenEditModal = (product = null) => {
    if (product) {
      setEditingProduct({ ...product, categoryId: product.category?.id, thumbnailFile: null, templateFile: null });
    } else {
      setEditingProduct({ name: '', slug: '', description: '', price: '', categoryId: '', liveDemoUrl: '', thumbnailFile: null, templateFile: null });
    }
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setEditingProduct(null);
    setViewingProduct(null);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const isEditing = !!editingProduct.id;

    const formData = new FormData();
    const productData = {
      name: editingProduct.name, slug: editingProduct.slug, description: editingProduct.description,
      price: editingProduct.price, categoryId: editingProduct.categoryId, liveDemoUrl: editingProduct.liveDemoUrl,
    };
    formData.append('data', new Blob([JSON.stringify(productData)], { type: 'application/json' }));

    if (editingProduct.thumbnailFile) formData.append('thumbnail', editingProduct.thumbnailFile);
    if (editingProduct.templateFile) formData.append('file', editingProduct.templateFile);

    try {
      if (isEditing) {
        await updateTemplate(editingProduct.id, formData);
        setToastInfo({ show: true, message: 'Cập nhật sản phẩm thành công!' });
      } else {
        await createTemplate(formData);
        setToastInfo({ show: true, message: 'Thêm sản phẩm thành công!' });
      }
      fetchData();
      handleCloseModal();
    } catch (err) {
      setError(`Lỗi: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleDeleteClick = (productId) => setProductToDelete(productId);

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await deleteTemplate(productToDelete);
      setToastInfo({ show: true, message: 'Xóa sản phẩm thành công!' });
      fetchData();
    } catch (err) {
      setError(`Lỗi khi xóa: ${err.response?.data?.message || err.message}`);
    } finally {
      setProductToDelete(null);
    }
  };

  return (
    <>
      <SuccessToast show={toastInfo.show} message={toastInfo.message} onClose={() => setToastInfo({ show: false, message: '' })} />
      <ConfirmModal open={!!productToDelete} onClose={() => setProductToDelete(null)} onConfirm={handleConfirmDelete} title="Xác nhận xóa" message={`Bạn có chắc muốn xóa sản phẩm #${productToDelete}?`} />

      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="bg-white shadow rounded-lg p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Quản lý Sản phẩm</h1>
              <p className="text-gray-600 mt-1 text-sm">Thêm, sửa, xóa và quản lý các sản phẩm</p>
            </div>
            <div className="flex w-full sm:w-auto items-center gap-4">
              <div className="text-center flex-1 sm:flex-none">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600">{products.length}</div>
                <div className="text-sm text-gray-500">Tổng sản phẩm</div>
              </div>
              <button onClick={() => handleOpenEditModal()} className="flex-1 sm:flex-none bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2">
                <PlusIcon className="h-4 w-4" />
                <span>Thêm sản phẩm</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"> <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" /></div>
              <input type="text" placeholder="Tìm kiếm theo tên sản phẩm..." className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="all">Tất cả danh mục</option>
              {categories.map((category) => (<option key={category.id} value={category.id}>{category.name}</option>))}
            </select>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        {/* Products Grid & Pagination */}
        {loading ? <div className="text-center p-6">Đang tải...</div> : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {currentProducts.map((product) => (
                <div key={product.id} className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                  <div className="relative h-48 bg-gray-200">
                    <img src={product.thumbnailUrl ? `${API_BASE_URL}/files/${product.thumbnailUrl}` : 'https://placehold.co/600x400?text=No+Image'} alt={product.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="p-4 flex-grow flex flex-col">
                    <p className="text-xs text-gray-500 mb-1">{product.category?.name || 'Chưa phân loại'}</p>
                    <h3 className="text-base font-medium text-gray-900 line-clamp-1">{product.name}</h3>
                    <div className="text-lg font-bold text-blue-600 mt-2 flex-grow">{new Intl.NumberFormat('vi-VN').format(product.price)} đ</div>
                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end items-center gap-2">
                      <button onClick={() => setViewingProduct(product)} className="text-indigo-600 p-2 rounded-md hover:bg-indigo-50" title="Xem"><EyeIcon className="h-4 w-4" /></button>
                      <button onClick={() => handleOpenEditModal(product)} className="text-green-600 p-2 rounded-md hover:bg-green-50" title="Sửa"><PencilIcon className="h-4 w-4" /></button>
                      <button onClick={() => handleDeleteClick(product.id)} className="text-red-600 p-2 rounded-md hover:bg-red-50" title="Xóa"><TrashIcon className="h-4 w-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <CustomPagination count={totalPages} page={currentPage} onChange={handlePageChange} />
          </div>
        )}

        {/* No Products Message */}
        {!loading && filteredProducts.length === 0 && (<div className="bg-white shadow rounded-lg p-8 text-center"><ShoppingBagIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" /><h3 className="text-lg font-medium">Không tìm thấy sản phẩm</h3></div>)}
      </div>

      {/* View Product Modal */}
      {viewingProduct && (
        <div className="fixed inset-0 bg-gray-500/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b flex justify-between items-center"><h3 className="text-lg font-medium">Chi tiết sản phẩm</h3><button onClick={handleCloseModal}><XMarkIcon className="h-5 w-5" /></button></div>
            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="relative h-64 bg-gray-100 rounded-lg flex items-center justify-center"><img src={viewingProduct.thumbnailUrl ? `${API_BASE_URL}/files/${viewingProduct.thumbnailUrl}` : 'https://placehold.co/600x400?text=No+Image'} alt={viewingProduct.name} className="h-full w-full object-contain rounded-lg" /></div>
              <div className="space-y-4">
                <div><h3 className="text-2xl font-bold text-gray-900">{viewingProduct.name}</h3><p className="text-blue-600 text-sm">{viewingProduct.slug}</p></div>
                <div><span className="text-sm text-gray-500">Danh mục:</span><p className="font-medium">{viewingProduct.category?.name}</p></div>
                <div><span className="text-sm text-gray-500">Mô tả:</span><p className="mt-1">{viewingProduct.description}</p></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><span className="text-sm text-gray-500">Giá bán:</span><p className="text-2xl font-bold text-blue-600">{new Intl.NumberFormat('vi-VN').format(viewingProduct.price)} đ</p></div>
                  <div><span className="text-sm text-gray-500">Ngày tạo:</span><p className="font-medium">{new Date(viewingProduct.createdAt).toLocaleDateString("vi-VN")}</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-gray-500/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b flex justify-between items-center"><h3 className="text-lg font-medium">{editingProduct.id ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}</h3><button onClick={handleCloseModal}><XMarkIcon className="h-5 w-5" /></button></div>
            <form onSubmit={handleFormSubmit}>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm *</label>
                  <input required name="name" value={editingProduct.name} onChange={handleFormChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                  <input required name="slug" value={editingProduct.slug} onChange={handleFormChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                  <textarea name="description" value={editingProduct.description} onChange={handleFormChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giá (VNĐ) *</label>
                  <input required type="number" name="price" value={editingProduct.price} onChange={handleFormChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục *</label>
                  <select required name="categoryId" value={editingProduct.categoryId} onChange={handleFormChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                    <option value="">Chọn danh mục</option>
                    {categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL Live Demo</label>
                  <input type="url" name="liveDemoUrl" value={editingProduct.liveDemoUrl} onChange={handleFormChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh thumbnail {editingProduct.id ? "(Để trống nếu không đổi)" : "*"}</label>
                  <input type="file" name="thumbnailFile" onChange={handleFormChange} className="w-full text-sm" required={!editingProduct.id} />
                </div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">File Template (.zip) {editingProduct.id ? "(Để trống nếu không đổi)" : "*"}</label>
                  <input type="file" name="templateFile" required={!editingProduct.id} onChange={handleFormChange} className="w-full text-sm" />
                </div>
              </div>
              <div className="px-6 py-4 border-t flex justify-end gap-3">
                <button type="button" onClick={handleCloseModal} className="px-4 py-2 text-sm bg-white border rounded-md hover:bg-gray-50">Hủy</button>
                <button type="submit" className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700">{editingProduct.id ? "Lưu thay đổi" : "Thêm mới"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default TemplateManager;