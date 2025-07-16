// src/components/layout/Header.jsx

import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
// Import icons for dropdowns and heart icon
import { IoChevronDown } from "react-icons/io5";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null);
    };

    if (activeDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [activeDropdown]);

  const navLinkStyles = ({ isActive }) => {
    return isActive
      ? 'text-[#7c3aed] font-medium px-4 py-2'
      : 'text-gray-700 hover:text-[#7c3aed] hover:bg-[#f3e8ff] font-medium px-4 py-2 rounded-full';
  };

  const toggleDropdown = (dropdown, e) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  return (
    <header className="bg-white sticky top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        {/* Logo */}
        <div>
          <NavLink to="/" className="brand">
            SHOPNK
          </NavLink>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex">
          <ul className="flex items-center space-x-8 text-base">
            <li className="relative">
              <button
                className={"flex items-center space-x-1 text-gray-700 hover:text-[#7c3aed] hover:bg-[#f3e8ff] font-medium px-4 py-2 rounded-full"}
                onClick={(e) => toggleDropdown('resources', e)}
              >
                <span>Mẫu Landing Page</span>
                <IoChevronDown size={14} />
              </button>
              {activeDropdown === 'resources' && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2">
                  <NavLink to="" className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#f3e8ff]">Templates</NavLink>
                  <NavLink to="" className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#f3e8ff]">Blog</NavLink>
                  <NavLink to="" className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#f3e8ff]">Hướng dẫn</NavLink>
                  <NavLink to="" className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#f3e8ff]">Hướng dẫn</NavLink>
                </div>
              )}
            </li>
            <li>
              <NavLink to="/ve-chung-toi" className={navLinkStyles}>
                Về Chúng Tôi
              </NavLink>
            </li>
            <li>
              <NavLink to="/tin-tuc" className={navLinkStyles}>
                Tin Tức
              </NavLink>
            </li>
            <li>
              <NavLink to="/lien-he" className={navLinkStyles}>
                Liên Hệ
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Right side buttons and mobile menu */}
        <div className="flex items-center space-x-4">
          {/* Desktop Login/Signup buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <NavLink
              to="/dang-nhap"
              className="text-[#7c3aed] bg-[#fff] hover:bg-[#ede9fe] font-medium text-sm border-1 border-[#7c3aed] rounded-lg px-4 py-2"
            >
              Đăng nhập
            </NavLink>
            <NavLink
              to="/dang-ky"
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
            >
              Đăng ký miễn phí
            </NavLink>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700"
            >
              {isMenuOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <nav className="lg:hidden bg-white border-t border-gray-100">
          <div className="px-4 py-4 space-y-4">
            {/* Mobile navigation links */}
            <div className="space-y-3">
              <NavLink
                to="/mau-landing-page"
                className="block text-gray-700 hover:text-blue-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Mẫu Landing Page
              </NavLink>
              <NavLink
                to="/ve-chung-toi"
                className="block text-gray-700 hover:text-blue-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Về chúng Tôi
              </NavLink>
              <NavLink
                to="/tin-tuc"
                className="block text-gray-700 hover:text-blue-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Tin Tức
              </NavLink>
              <NavLink
                to="/lien-he"
                className="block text-gray-700 hover:text-blue-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Liên Hệ
              </NavLink>
            </div>

            {/* Mobile login/signup buttons */}
            <div className="pt-4 border-t border-gray-100 space-y-3">
              <NavLink
                to="/dang-nhap"
                className="block text-center text-gray-700 hover:text-blue-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Đăng nhập
              </NavLink>
              <NavLink
                to="/dang-ky"
                className="block text-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Đăng ký miễn phí
              </NavLink>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;