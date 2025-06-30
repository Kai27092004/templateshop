import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getTemplateBySlug } from '../services/templateService';
import { useCart } from '../contexts/CartContext';
import { API_BASE_URL } from '../services/api';

const ProductDetailPage = () => {
  // useParams() là một hook của React Router để lấy các tham số trên URL (ở đây là :slug)
  const { slug } = useParams();
  const { addToCart } = useCart();

  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fecthTemplateDetails = async () => {
      try {
        const response = await getTemplateBySlug(slug);
        setTemplate(response.data);
      } catch (err) {
        setError('Không thể tìm thấy sản phẩm')
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fecthTemplateDetails();
  }, [slug]);

  if (loading) {
    return <div className="text-center mt-10">Đang tải chi tiết sản phẩm...</div>
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>
  }

  if (!template) {
    return null; // Hoặc một component thông báo không có dữ liệu
  }
  const imageUrl = template.thumbnailUrl ? `${API_BASE_URL}/files/${template.thumbnailUrl}` : 'https://placehold.co/800x600?text=No+Image';
  const formattedPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(template.price);

  return (
    <div className="container mx-auto p-4">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <img
            src={imageUrl}
            alt={template.name}
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-500">{template.category?.name || 'Chưa phân loại'}</p>
          <h1 className="text-4xl font-bold">{template.name}</h1>
          <p className="text-gray-600 text-lg">{template.description}</p>
          <p className="text-3xl font-bold text-blue-600">{formattedPrice}</p>

          <div className="flex space-x-4 pt-4">
            <a
              href={template.liveDemoUrl || '#'}
              target='_blank'
              rel='noopener noreferrer'
              className="flex-1 text-center bg-gray-200 text-gray-800 py-3 px-6 rounded-lg text-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Xem Demo
            </a>
            <button
              onClick={() => addToCart(template)}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Thêm vào giỏ hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;