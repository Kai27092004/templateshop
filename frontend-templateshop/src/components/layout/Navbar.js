import { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { IoChevronDown } from "react-icons/io5";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import GradientButton from "../ui/GradientButton";
import { getAllCategories } from '../../services/categoryService';

const Navbar = () => {
  // Lấy trạng thái và hàm logout
  const { isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const [categories, setCategories] = useState([]); // State để lưu danh sách danh mục

  // Lấy danh sách danh mục từ API khi component được tải
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);


  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null);
    };

    if (activeDropdown) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [activeDropdown]);

  const navLinkStyles = ({ isActive }) => {
    return isActive
      ? "text-[#7c3aed] bg-[#f3e8ff] font-medium px-3 lg:px-4 py-2 rounded-full text-sm lg:text-base transition-colors duration-200"
      : "text-gray-700 hover:text-[#7c3aed] hover:bg-[#f3e8ff] font-medium px-3 lg:px-4 py-2 rounded-full transition-colors duration-200 text-sm lg:text-base";
  };

  const dropdownLink = (category) => (
    <Link
      key={category.id}
      to="/san-pham"
      // Dùng state để truyền slug của danh mục qua trang sản phẩm
      state={{ category: category }}
      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#f3e8ff] hover:text-[#7c3aed]"
      onClick={() => {
        setActiveDropdown(null);
        setIsMenuOpen(false);
      }}
    >
      {category.name}
    </Link>
  );
  // Chuyển về trang đăng nhập sau khi logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  return (
    <header className="bg-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16 sm:h-18 lg:h-20">
        <NavLink to="/" className="brand flex-shrink-0">
          SHOPNK
        </NavLink>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-2 xl:space-x-6 text-sm flex-1 justify-center">
          {/* Dropdown cho Desktop */}
          <div className="relative" onMouseLeave={() => setActiveDropdown(null)}>
            <button
              onMouseEnter={() => setActiveDropdown("landing-page")}
              className="flex items-center space-x-1 text-gray-700 hover:text-[#7c3aed] text-sm lg:text-base px-3 lg:px-4 py-2"
            >
              <NavLink to="/san-pham" className={navLinkStyles}><span>Mẫu Landing Page</span></NavLink>
              <IoChevronDown
                size={14}
                className={`transition-transform ${activeDropdown === "landing-page" ? "rotate-180" : ""
                  }`}
              />
            </button>
            {activeDropdown === "landing-page" && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-48 bg-white border border-gray-100 rounded-lg shadow-xl py-2 z-50">
                {categories.map(cat => dropdownLink(cat))}
              </div>
            )}
          </div>
          <NavLink to="/ve-chung-toi" className={navLinkStyles}>
            Về Chúng Tôi
          </NavLink>
          <NavLink to="/tin-tuc" className={navLinkStyles}>
            Tin Tức
          </NavLink>
          <NavLink to="/lien-he" className={navLinkStyles}>
            Liên Hệ
          </NavLink>
        </nav>

        {/* Right side actions */}
        <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
          {/* Shopping Cart - Desktop */}
          <div className="hidden lg:flex">
            <div className="relative">
              <button className="text-gray-700 hover:text-[#7c3aed] p-2">
                <NavLink to="/gio-hang"><HiOutlineShoppingBag size={24} /></NavLink>
              </button>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#7c3aed] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </div>
          </div>

          {/* Desktop Login/Signup buttons */}
          {isAuthenticated ? (
            <>
              <NavLink to="/profile" className="hover:text-gray-300">Hồ sơ</NavLink>
              <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded">
                Đăng xuất
              </button>
            </>
          ) : (
            <div className="hidden lg:flex items-center space-x-2 xl:space-x-4">
              <NavLink
                to="/login"
                className="text-[#7c3aed] bg-white hover:bg-[#ede9fe] font-medium text-xs lg:text-sm border border-[#7c3aed] rounded-lg px-3 lg:px-4 py-2 transition-colors"
              >
                Đăng Nhập
              </NavLink>
              <NavLink
                to="/register"
              >
                <GradientButton className="rounded-full text-xs lg:text-sm px-3 lg:px-4 py-2">Đăng ký miễn phí</GradientButton>
              </NavLink>
            </div>
          )}

          {/* Mobile - Cart and Hamburger */}
          <div className="lg:hidden flex items-center space-x-2 sm:space-x-3">
            {/* Shopping Cart - Mobile */}
            <div className="relative">
              <button className="text-gray-700 hover:text-[#7c3aed] p-1 sm:p-2">
                <HiOutlineShoppingBag size={20} className="sm:w-6 sm:h-6" />
              </button>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#7c3aed] text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center font-bold text-xs">
                  {itemCount}
                </span>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 p-1 sm:p-2"
            >
              {isMenuOpen ? (
                <AiOutlineClose size={20} className="sm:w-6 sm:h-6" />
              ) : (
                <AiOutlineMenu size={20} className="sm:w-6 sm:h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <nav className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-4 space-y-4 max-h-[80vh] overflow-y-auto">
            {/* Mobile navigation links */}
            <div className="space-y-3">
              <div className="border-b border-gray-100 pb-3">
                <p className="text-sm font-semibold text-gray-500 mb-2">
                  Mẫu Landing Page
                </p>
                <div className="pl-4 space-y-2">
                  {categories.map(cat => dropdownLink(cat))}
                </div>
              </div>
              <NavLink
                to="/ve-chung-toi"
                className="block text-gray-700 hover:text-[#7c3aed] font-medium text-base py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Về chúng Tôi
              </NavLink>
              <NavLink
                to="/tin-tuc"
                className="block text-gray-700 hover:text-[#7c3aed] font-medium text-base py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Tin Tức
              </NavLink>
              <NavLink
                to="/lien-he"
                className="block text-gray-700 hover:text-[#7c3aed] font-medium text-base py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Liên Hệ
              </NavLink>
            </div>

            {/* Mobile login/signup buttons */}
            {isAuthenticated ? (
              <>
                <NavLink to="/profile" className="hover:text-gray-300">Hồ sơ</NavLink>
                <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded">
                  Đăng xuất
                </button>
              </>
            ) : (
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <NavLink
                  to="/login"
                  className="block text-center text-[#7c3aed] border border-[#7c3aed] hover:bg-[#f3e8ff] font-medium py-2 px-4 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Đăng nhập
                </NavLink>
                <NavLink
                  to="/register"
                  className="block text-center bg-gradient-to-r from-[#7c3aed] to-[#a855f7] hover:from-[#6d28d9] hover:to-[#9333ea] text-white px-4 py-2 rounded-lg font-medium transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Đăng ký miễn phí
                </NavLink>
              </div>
            )}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;