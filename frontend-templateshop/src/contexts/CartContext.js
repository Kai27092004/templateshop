import React, { createContext, useState, useContext, useEffect } from 'react';

// Hàm trợ giúp để lấy giỏ hàng từ localStorage
const getInitialCart = () => {
  try {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    console.error("Failed to parse cart from localStorage", error);
    return [];
  }
};

// 1. Tạo Context
const CartContext = createContext();

// 2. Tạo Provider Component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(getInitialCart);

  // Mỗi khi cartItems thay đổi, lưu nó vào localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

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