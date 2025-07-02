import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { confirmOrderPayment } from '../services/orderService';
import { useCart } from '../contexts/CartContext';

const PaymentPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState('');

  const handleConfirmPayment = async () => {
    setIsConfirming(true);
    setError('');
    try {
      await confirmOrderPayment(orderId);
      clearCart();

      navigate('/order-success', { state: { orderId: orderId }, replace: true });
    } catch (err) {
      console.err("Payment confirmation failed:", err);
      setError("Xác nhận thanh toán thất bại. Vui lòng thử lại.");
      setIsConfirming(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-lg shadow-md text-center">
        <h2 className="text-3xl font-bold text-gray-900">Xác nhận Thanh toán</h2>
        <p className="text-gray-600">Đơn hàng của bạn đã được tạo với ID: <span className="font-bold">#{orderId}</span>.</p>
        <p className="text-gray-600">Vui lòng hoàn tất thanh toán (giả lập) và nhấn nút xác nhận bên dưới.</p>

        <div className="flex justify-center">
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Thanh+toan+don+hang+TemplateShop" alt="QR Code" />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button
          onClick={handleConfirmPayment}
          disabled={isConfirming}
          className="w-full px-4 py-3 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          {isConfirming ? 'Đang xử lý...' : 'Tôi đã hoàn tất thanh toán'}
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;