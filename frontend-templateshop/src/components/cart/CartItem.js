import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { API_BASE_URL } from '../../services/api';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  // Xây dựng URL đầy đủ cho ảnh thumbnail
  const imageUrl = item.thumbnailUrl
    ? `${API_BASE_URL}/files/${item.thumbnailUrl}`
    : 'https://placehold.co/100x75?text=No+Image';

  const formattedPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(item.price);

  return (
    <div className="flex items-center py-4 border-b">
      <div className="flex items-center w-1/2">
        <img
          src={imageUrl}
          alt={item.name}
          className="w-20 h-20 object-cover rounded mr-4"
        />
        <div>
          <Link to={`/templates/${item.slug}`} className="font-bold hover:text-blue-600">
            {item.name}
          </Link>
          <button
            onClick={() => removeFromCart(item.id)}
            className="text-sm text-red-500 hover:underline mt-1"
          >
            Xóa
          </button>
        </div>
      </div>
      <div className="w-1/6 text-center">{formattedPrice}</div>
      <div className="w-1/6 flex justify-center">
        <input
          type="number"
          value={item.quantity}
          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
          className="w-16 text-center border rounded py-1"
          min="1"
        />
      </div>
      <div className="w-1/6 text-right font-semibold">
        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.quantity)}
      </div>
    </div>
  );
};

export default CartItem;