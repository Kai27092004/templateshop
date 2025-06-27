import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { createOrder } from '../services/orderService';
import CartItem from '../components/cart/CartItem';

const CartPage = () => {

  const { cartItems, cartTotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState('');

  const handleCheckout = async () => {
    // 1. Kiểm tra xem người dùng đã đăng nhập chưa
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/cart' } });
      return;
    }

    // 2. Chuẩn bị dữ liệu để gửi lên API
    const orderData = {
      cartItems: cartItems.map(item => ({
        templateId: item.id,
        quantity: item.quantity,
      })),
    };
    try {
      // 3. Gọi API tạo đơn hàng
      const response = await createOrder(orderData);

      // 4. Xử lý khi thành công
      clearCart();

      // Lấy ID đơn hàng từ response để hiển thị
      const orderIdMessage = response.data;
      const orderId = orderIdMessage.split(': ')[1];

      // Điều hướng đến trang thành công và truyền theo orderId
      navigate('/order-success', { state: { orderId: orderId } });
    } catch (err) {
      console.error("Checkout error: ", err);
      setError("Đã có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.");
    }
  };

  const formattedTotal = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(cartTotal);

  // Xử lý trường hợp giỏ hàng rỗng
  if (cartItems.length === 0) {
    return (
      <div className="text-center p-10">
        <h1 className="text-3xl font-bold mb-4">Giỏ hàng của bạn đang trống</h1>
        <p className="text-gray-600 mb-6">Hãy khám phá và thêm những sản phẩm tuyệt vời vào giỏ hàng nhé!</p>
        <Link to="/" className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600 transition-colors">
          Quay lại Trang Chủ
        </Link>
      </div>
    );
  }
  // Giao diện khi giỏ hàng có sản phẩm
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6"> Giỏ hàng của bạn</h1>

      <div className="hidden md:flex bg-gray-100 p-4 rounded-t-lg font-semibold text-gray-600">
        <div className="w-2/5">Sản phẩm</div>
        <div className="w-1/5">Đơn giá</div>
        <div className="w-1/5">Số lượng</div>
        <div className="w-1/5">Tạm tính</div>
      </div>

      <div>
        {cartItems.map(item => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <div className="w-full md:w-1/3 p-6 bg-gray-500 rounded-lg">
          <div className="flex justify-between text-lg font-semibold">
            <span>Tổng cộng:</span>
            <span>{formattedTotal}</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">Phí vận chuyển sẽ được tính ở bước thanh toán.</p>
          {error && <p className="text-sm text-red-600 my-2">{error}</p>}
          <button
            onClick={handleCheckout}
            className="w-full mt-4 bg-red-500 text-white py-3 rounded-lg font-semibold text-lg hover:bg-red-600 transition-colors"
          >
            Tiến hành Thanh Toán
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;