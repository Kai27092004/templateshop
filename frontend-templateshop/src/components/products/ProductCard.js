import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { API_BASE_URL } from '../../services/api';
import { EyeIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';

const ProductCard = ({ template }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const imageUrl = template.thumbnailUrl ? `${API_BASE_URL}/files/${template.thumbnailUrl}` : 'https://placehold.co/270x462?text=No+Image';
  const formattedPrice = new Intl.NumberFormat('vi-VN').format(template.price);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (isAuthenticated) {
      addToCart(template);
    } else {
      alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.');
      navigate('/login', { state: { from: location } });
    }
  };

  const handleViewDemo = (e) => {
    e.stopPropagation();
    if (template.liveDemoUrl) {
      window.open(template.liveDemoUrl, '_blank');
    } else {
      alert('Sản phẩm này chưa có bản xem trước.');
    }
  };

  return (
    // Đặt chiều rộng cố định và chiều cao tối thiểu để có tỷ lệ dài hơn
    <div className="group bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col transition-transform duration-300 hover:-translate-y-2 w-full max-w-[270px] mx-auto">
      <Link to={`/templates/${template.slug}`}>
        {/* Tăng chiều cao của khu vực ảnh */}
        <div className="relative h-[300px] w-full overflow-hidden">
          <img
            src={imageUrl}
            alt={template.name}
            className="absolute top-0 left-0 w-full h-auto object-cover object-top transition-transform group-hover:duration-[1500ms] ease-linear group-hover:-translate-y-[calc(100%-300px)] duration-0"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </Link>
      <div className="p-5 flex-1 flex flex-col">
        <p className="text-xs text-gray-500 mb-1">{template.category?.name || 'Chưa phân loại'}</p>
        <h2 className="text-base font-bold text-gray-800 mb-3 group-hover:text-[#7c3aed] transition-colors line-clamp-2 h-12">
          {template.name}
        </h2>
        <div className="mt-auto flex items-center justify-between">
          <p className="text-lg font-bold text-blue-600">{formattedPrice} đ</p>
          <div className="flex items-center gap-2">
            <button onClick={handleViewDemo} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors" title="Xem Demo">
              <EyeIcon className="h-5 w-5" />
            </button>
            <button onClick={handleAddToCart} className="p-2 rounded-full text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-colors" title="Thêm vào giỏ">
              <ShoppingCartIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;