import React, { useEffect, useState } from 'react';
import { getAllTemplates } from '../services/templateService';
import ProductCard from '../components/products/ProductCard';

const Products = () => {
  // State để lưu danh sách templates
  const [templates, setTemplates] = useState([]);
  // State để quản lý trạng thái loading
  const [loading, setLoading] = useState(true);
  // State để lưu lỗi nếu có
  const [error, setError] = useState(null);

  // Dùng useEffect để gọi API một lần duy nhất khi component được render
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await getAllTemplates();
        setTemplates(response.data); // Lưu dữ liệu vào state
      } catch (err) {
        setError('Không thể tải danh sách sản phẩm.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  if (loading) {
    return <div className="text-center mt-10">Đang tải dữ liệu...</div>
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>
  }
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Khám phá các mẫu Landing Page</h1>
      {/* Lưới hiển thị sản phẩm */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Dùng hàm map để lặp qua danh sách templates và render mỗi cái bằng ProductCard */}
        {templates.map((template) => (
          <ProductCard key={template.id} template={template} />
        ))}
      </div>
    </div>
  );
};

export default Products;