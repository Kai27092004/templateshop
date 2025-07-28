import React, { useState, useEffect } from 'react';
import { ArrowUpIcon } from '@heroicons/react/24/outline';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Hàm kiểm tra vị trí cuộn để ẩn/hiện nút
  const toggleVisibility = () => {
    if (window.scrollY > 300) { // Hiện nút khi cuộn xuống hơn 300px
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Hàm thực hiện cuộn lên đầu trang một cách mượt mà
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    // Thêm một event listener để theo dõi sự kiện cuộn trang
    window.addEventListener('scroll', toggleVisibility);

    // Dọn dẹp event listener khi component bị unmount
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-5 right-5 z-50 p-3 rounded-full btn-gradient"
          aria-label="Cuộn lên đầu trang"
        >
          <ArrowUpIcon className="h-6 w-6" />
        </button>
      )}
    </>
  );
};

export default ScrollToTopButton;