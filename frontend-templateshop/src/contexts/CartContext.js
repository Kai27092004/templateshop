import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

// 1. Tạo Context
const CartContext = createContext();

// 2. Tạo Provider Component
export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);

  // Tạo key duy nhất cho giỏ hàng dựa trên email của user
  // Nếu chưa đăng nhập, dùng key 'cart_guest';
  const cartKey = user ? `cart_${user.email}` : 'cart_guest';

  // useEffect này sẽ chạy mỗi khi user thay đổi (đăng nhập/đăng xuất)
  useEffect(() => {
    const savedCart = localStorage.getItem(cartKey);
    setCartItems(savedCart ? JSON.parse(savedCart) : []);
  }, [user, cartKey]);

  // useEffect này sẽ chạy mỗi khi cartItems thay đổi để lưu vào localStorage
  useEffect(() => {
    // Chỉ lưu nếu có sản phẩm, tránh lưu mảng rỗng không cần thiết
    if (cartItems.length > 0) {
      localStorage.setItem(cartKey, JSON.stringify(cartItems));
    } else {
      // Nếu giỏ hàng rỗng, xóa key khỏi localStorage
      localStorage.removeItem(cartKey);
    }
  }, [cartItems, cartKey]);

  // Hàm thêm sản phẩm vào giỏ hàng
  const addToCart = (product) => {
    setCartItems(prevItems => {
      // Kiểm tra xem sản phẩm đã có trong giỏ chưa
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        // Nếu đã có, chỉ tăng số lượng lên 1
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      // Nếu chưa có, thêm sản phẩm mới vào giỏ với số lượng là 1
      return [...prevItems, { ...product, quantity: 1 }];
    });
    // Bạn có thể thêm một thông báo "Đã thêm vào giỏ hàng" ở đây
    alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
  };

  // Hàm xóa sản phẩm khỏi giỏ
  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  // Hàm cập nhật số lượng
  const updateQuantity = (productId, quantity) => {
    // Đảm bảo số lượng là số dương
    const newQuantity = Math.max(1, quantity);
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Các giá trị và hàm sẽ được cung cấp cho toàn bộ ứng dụng
  const cartContextValue = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    // Tính toán các giá trị tiện ích
    itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
    cartTotal: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
  };

  return (
    <CartContext.Provider value={cartContextValue}>
      {children}
    </CartContext.Provider>
  );
};

// 3. Tạo một custom hook để sử dụng Context dễ dàng hơn
export const useCart = () => {
  return useContext(CartContext);
};