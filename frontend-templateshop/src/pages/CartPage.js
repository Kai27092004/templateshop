import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { createOrder } from '../services/orderService';
import { FaTrash } from "react-icons/fa";
import { API_BASE_URL } from '../services/api';

const CartPage = () => {
  const { cartItems, cartTotal, updateQuantity, removeFromCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/cart' } });
      return;
    }
    const orderData = {
      cartItems: cartItems.map(item => ({ templateId: item.id, quantity: item.quantity })),
    };
    try {
      const response = await createOrder(orderData);
      const orderIdMessage = response.data;
      const orderId = orderIdMessage.split(': ')[1];
      navigate(`/payment/${orderId}`);
    } catch (err) {
      console.error("Checkout error: ", err);
      setError("Đã có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.");
    }
  };

  function formatVND(n) {
    return n.toLocaleString("vi-VN") + "₫";
  }

  if (cartItems.length === 0) {
    return (
      <div className="text-center p-10">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4">Giỏ hàng của bạn đang trống</h1>
        <p className="text-gray-600 mb-6">Hãy khám phá và thêm sản phẩm vào giỏ hàng nhé!</p>
        <Link to="/" className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors">
          Quay lại Trang Chủ
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 sm:py-10">
      <div className="max-w-6xl mx-auto px-2 sm:px-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-6 sm:mb-8 text-center">
          Giỏ hàng của bạn
        </h1>
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Left: Cart Items */}
          <div className="flex-1 bg-white rounded-xl shadow-md p-3 sm:p-6">
            <div className="overflow-x-auto">
              {/* Desktop Table */}
              <table className="min-w-[600px] w-full text-sm hidden md:table">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="py-2 font-medium">Sản phẩm</th>
                    <th className="py-2 font-medium">Đơn giá</th>
                    <th className="py-2 font-medium">Số lượng</th>
                    <th className="py-2 font-medium">Tổng</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.id} className="border-b last:border-b-0">
                      <td className="py-4 flex items-center gap-3">
                        <img src={item.thumbnailUrl ? `${API_BASE_URL}/files/${item.thumbnailUrl}` : 'https://placehold.co/120x120'} alt={item.name} className="w-16 h-16 rounded-lg object-cover border" />
                        <span className="font-medium text-gray-800">{item.name}</span>
                      </td>
                      <td className="py-4 text-gray-600 font-semibold">{formatVND(item.price)}</td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <button className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300" onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>–</button>
                          <input type="number" min="1" value={item.quantity} readOnly className="w-14 px-2 py-1 border rounded text-center" />
                          <button className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                        </div>
                      </td>
                      <td className="py-4 font-bold text-indigo-600">{formatVND(item.price * item.quantity)}</td>
                      <td className="py-4">
                        <button className="text-red-400 hover:text-red-600 p-2 rounded-full transition" onClick={() => removeFromCart(item.id)}><FaTrash /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {cartItems.map(item => (
                  <div key={item.id} className="border-b pb-4 last:border-b-0">
                    <div className="flex items-center gap-3 mb-3">
                      <img src={item.thumbnailUrl ? `${API_BASE_URL}/files/${item.thumbnailUrl}` : 'https://placehold.co/120x120'} alt={item.name} className="w-16 h-16 rounded-lg object-cover border" />
                      <div>
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-500">{formatVND(item.price)}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <button className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300" onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>–</button>
                        <input type="number" min="1" value={item.quantity} readOnly className="w-12 px-1 py-1 border rounded text-center text-sm" />
                        <button className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                      </div>
                      <div className="font-bold text-indigo-600">{formatVND(item.price * item.quantity)}</div>
                      <button className="text-red-400 hover:text-red-600 p-2" onClick={() => removeFromCart(item.id)}><FaTrash /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="w-full lg:w-[350px] flex-shrink-0">
            <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 sticky top-8">
              <h2 className="font-semibold text-gray-800 mb-4 text-lg">Đơn hàng của bạn</h2>
              <div className="border-b pb-2 mb-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-sm mb-1">
                    <span>{item.name} <span className="text-gray-400">× {item.quantity}</span></span>
                    <span className="font-semibold text-gray-700">{formatVND(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between font-bold text-lg mt-4 mb-4">
                <span>Tổng cộng</span>
                <span className="text-indigo-600">{formatVND(cartTotal)}</span>
              </div>
              {error && <p className="text-sm text-red-600 my-2">{error}</p>}
              <button onClick={handleCheckout} className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-semibold shadow hover:from-indigo-700 hover:to-blue-600 transition text-base">
                Tiến hành thanh toán
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;