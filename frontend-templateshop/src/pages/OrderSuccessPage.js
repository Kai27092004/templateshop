import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const OrderSuccessPage = () => {
  const location = useLocation();
  const orderId = location.state?.orderId;

  return (
    <div className="text-center p-10 flex flex-col items-center">
      {/* Bạn có thể thêm một icon tick xanh ở đây */}
      <svg className="w-24 h-24 text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Đặt hàng thành công!</h1>
      <p className="text-lg text-gray-600 mb-2">Cảm ơn bạn đã mua hàng tại TemplateShop.</p>
      {orderId && (
        <p className="text-md text-gray-500 mb-8">Mã đơn hàng của bạn là: <span className="font-bold text-gray-700">{orderId}</span></p>
      )}
      <p className="mb-8">Bạn có thể xem lại các sản phẩm đã mua trong trang Hồ sơ cá nhân.</p>
      <Link
        to="/"
        className="bg-blue-500 text-white py-3 px-8 rounded-lg text-lg hover:bg-blue-600 transition-colors"
      >
        Tiếp tục mua sắm
      </Link>
    </div>
  );
};

export default OrderSuccessPage;