import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const formattedPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(item.price);

  return (
    <div className="flex items-center py-4 border-b">
      <div className="flex items-center w-2/5">
        <img
          src={item.thumbnailUrl || 'https://placehold.co/100x100?text=Img'}
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
      <div className="w-1/5 text-center">{formattedPrice}</div>
      <div className="w-1/5 flex justify-center">
        <input
          type="number"
          value={item.quantity}
          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
          className="w-16 text-center border rounded"
          min="1"
        />
      </div>
      <div className="w-1/5 text-right font-semibold">
        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.quantity)}
      </div>
    </div>
  );
};

export default CartItem;