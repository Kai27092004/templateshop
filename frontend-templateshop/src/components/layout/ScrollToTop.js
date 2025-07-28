import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Luôn cuộn lên đầu khi chuyển trang
    window.scrollTo(0, 0);
  }, [pathname]);

  // Thêm một useEffect khác để xử lý việc tải lại trang
  useEffect(() => {
    // "beforeunload" là sự kiện xảy ra ngay trước khi người dùng rời khỏi trang (bao gồm cả F5)
    const handleBeforeUnload = () => {
      window.scrollTo(0, 0);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Dọn dẹp listener khi component bị unmount
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []); // Mảng phụ thuộc rỗng để chỉ chạy 1 lần duy nhất

  return null;
};

export default ScrollToTop;