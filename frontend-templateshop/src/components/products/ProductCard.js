import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { API_BASE_URL } from '../../services/api';
import { useNotification } from '../../contexts/NotificationContext';
import GradientButton from '../ui/GradientButton';

const ProductCard = ({ template, purchasedIds, pendingIds }) => {
  const { cartItems, addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { showNotification } = useNotification();

  const imageUrl = template.thumbnailUrl ? `${API_BASE_URL}/files/${template.thumbnailUrl}` : 'https://placehold.co/270x462?text=No+Image';
  const formattedPrice = new Intl.NumberFormat('vi-VN').format(template.price);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      showNotification('Vui lòng đăng nhập để mua hàng.', 'warning');
      navigate('/login', { state: { from: location } });
      return;
    }
    // KIỂM TRA RÀNG BUỘC
    const isPurchased = purchasedIds.map(String).includes(String(template.id));
    const isInCart = cartItems.some(item => item.id === template.id);
    const isPending = pendingIds.includes(String(template.id));

    if (isPurchased) {
      showNotification('Bạn đã mua sản phẩm này rồi', 'warning');
      return;
    }
    if (isPending) {
      showNotification('Sản phẩm đang chờ thanh toán trong hồ sơ của bạn', 'warning');
      return;
    }
    if (isInCart) {
      showNotification('Sản phẩm đã có trong giỏ hàng.', 'warning');
      return;
    }

    // Nếu không có vấn đề gì, thêm vào giỏ và hiện thông báo thành công
    addToCart(template);
    showNotification('Đã thêm vào giỏ hàng!', 'success');
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
            className="absolute top-0 left-0 w-full h-auto object-cover object-top transition-transform group-hover:duration-[3500ms] ease-linear group-hover:-translate-y-[calc(100%-300px)] duration-0"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </Link>
      <div className="p-5 flex-1 flex flex-col">
        <p className="text-xs text-gray-500 mb-1">{template.category?.name || 'Chưa phân loại'}</p>
        <h2 className="text-base font-bold text-gray-800 mb-1 group-hover:text-[#7c3aed] transition-colors line-clamp-2">
          {template.name}
        </h2>
        <div className="mt-auto flex items-center justify-between">
          <p className="text-lg font-bold text-blue-600 mb-1">{formattedPrice} đ</p>
        </div>
        <div className="flex flex-col gap-2 mt-auto">
          <GradientButton
            className="w-full py-2 rounded-lg font-semibold text-base shadow-lg"
            onClick={handleAddToCart}
          >
            Thêm vào giỏ hàng
          </GradientButton>
          <button
            className="w-full py-2 rounded-lg font-semibold text-base border border-[#7c3aed] text-[#7c3aed] bg-white hover:bg-[#f3e8ff] transition-colors"
            onClick={handleViewDemo}
          >
            Live preview
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;