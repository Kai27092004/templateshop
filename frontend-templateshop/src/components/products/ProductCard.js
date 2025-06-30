import React from "react";
import { Link } from "react-router-dom";
import { useCart } from '../../contexts/CartContext';
import { API_BASE_URL } from '../../services/api';

const ProductCard = ({ template }) => {
  // Lấy hàm addToCart từ context
  const { addToCart } = useCart();
  // 2. Xây dựng URL đầy đủ cho ảnh thumbnail
  const imageUrl = template.thumbnailUrl ? `${API_BASE_URL}/files/${template.thumbnailUrl}` : 'https://placehold.co/600x400?text=No+Image';
  // Định dạng lại giá tiền cho dễ đọc
  const formattedPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(template.price);
  //Hàm xử lý khi click vào nút
  const handleAddToCart = () => {
    addToCart(template);
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
      {/* Ảnh đại diện của sản phẩm */}
      <Link to={`/templates/${template.slug}`}>
        <img
          src={imageUrl}
          alt={template.name}
          className="w-full h-48 object-cover"
        />
      </Link>

      {/* Phần thông tin sản phẩm */}
      <div className="p-4">
        <p className="text-sm text-gray-500 mb-1">{template.category?.name || 'Chưa phân loại'}</p>
        <h3 className="text-lg font-bold truncate">
          <Link to={`/templates/${template.slug}`} className="hover:text-blue-600">
            {template.name}
          </Link>
        </h3>
        <p className="text-xl font-semibold text-blue-600 mt-2">{formattedPrice}</p>
        <div className="mt-4 flex space-x-2">
          <a
            href={template.liveDemoUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition-colors"
          >
            Xem Demo
          </a>
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
          >
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;