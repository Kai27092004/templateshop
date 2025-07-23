// src/components/layout/Footer.jsx
import { FaFacebookF, FaYoutube, FaPhoneAlt } from "react-icons/fa"; // Ví dụ import icon
import { SiZalo } from "react-icons/si";
import { MdOutlineEmail } from "react-icons/md";

const Footer = () => {
  return (
    <footer className="bg-white text-dark pt-8 border-t border-gray-200">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        {/* Grid layout cho 4 cột */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 py-6 sm:py-8 lg:py-10">
          {/* Cột 1: Thông tin công ty */}
          <div className="space-y-3 sm:space-y-4 sm:col-span-2 lg:col-span-1">
            <h3 className="text-[#7c3aed] text-2xl sm:text-3xl lg:text-[35px] font-bold">
              SHOPNK
            </h3>
            <p className="text-gray-600 font-normal text-sm sm:text-base leading-relaxed">
              Địa chỉ: Số 123, Đường ABC, Phường XYZ, Quận 1, TP. Hồ Chí Minh
            </p>
            <div className="flex items-center space-x-2">
              <FaPhoneAlt className="text-[#7367F0] flex-shrink-0" size={16} />
              <span className="text-gray-600 font-normal text-sm sm:text-base">
                0987 654 321
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <MdOutlineEmail
                className="text-[#7367F0] flex-shrink-0"
                size={18}
              />
              <span className="text-gray-600 font-normal text-sm sm:text-base">
                contact@tempi.vn
              </span>
            </div>
          </div>

          {/* Cột 2: Về chúng tôi */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-base sm:text-lg font-semibold text-gray-800">
              Về chúng tôi
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/san-pham"
                  className="text-gray-600 font-normal text-sm sm:text-base hover:text-[#7367F0] transition-colors duration-200"
                >
                  Mẫu Landing Page
                </a>
              </li>
              <li>
                <a
                  href="/ve-chung-toi"
                  className="text-gray-600 font-normal text-sm sm:text-base hover:text-[#7367F0] transition-colors duration-200"
                >
                  Giới thiệu
                </a>
              </li>
              <li>
                <a
                  href="/lien-he"
                  className="text-gray-600 font-normal text-sm sm:text-base hover:text-[#7367F0] transition-colors duration-200"
                >
                  Liên hệ
                </a>
              </li>
              <li>
                <a
                  href="/tin-tuc"
                  className="text-gray-600 font-normal text-sm sm:text-base hover:text-[#7367F0] transition-colors duration-200"
                >
                  Tin tức
                </a>
              </li>
            </ul>
          </div>

          {/* Cột 3: Hỗ trợ khách hàng */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-base sm:text-lg font-semibold text-gray-800">
              Hỗ trợ khách hàng
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/lien-he"
                  className="text-gray-600 font-normal text-sm sm:text-base hover:text-[#7367F0] transition-colors duration-200"
                >
                  Chính sách đổi trả
                </a>
              </li>
              <li>
                <a
                  href="/lien-he"
                  className="text-gray-600 font-normal text-sm sm:text-base hover:text-[#7367F0] transition-colors duration-200"
                >
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a
                  href="/lien-he"
                  className="text-gray-600 font-normal text-sm sm:text-base hover:text-[#7367F0] transition-colors duration-200"
                >
                  Hướng dẫn mua hàng
                </a>
              </li>
            </ul>
          </div>

          {/* Cột 4: Đăng ký & Mạng xã hội */}
          <div className="space-y-3 sm:space-y-4 sm:col-span-2 lg:col-span-1">
            <h4 className="text-base sm:text-lg font-semibold text-gray-800">
              Đăng ký nhận tin
            </h4>
            <form className="flex flex-col sm:flex-row">
              <input
                type="email"
                placeholder="Nhập email của bạn..."
                className="w-full px-3 sm:px-4 py-2 text-gray-800 rounded-md sm:rounded-l-md sm:rounded-r-none focus:outline-none border-2 border-[#f3e8ff] focus:border-[#7367F0] text-sm sm:text-base mb-2 sm:mb-0"
              />
              <button className="bg-[#f3e8ff] px-4 py-2 rounded-md sm:rounded-r-md sm:rounded-l-none hover:bg-[#7367F0] hover:text-white transition-colors duration-200 text-sm sm:text-base font-medium">
                Gửi
              </button>
            </form>
            <div className="flex space-x-3 sm:space-x-4 mt-4">
              <a
                href="https://www.facebook.com/"
                className="p-2 sm:p-3 bg-[#f3e8ff] rounded-full hover:bg-[#7367F0] hover:text-white transition-colors duration-200 group"
                aria-label="Facebook"
              >
                <FaFacebookF size={16} className="sm:w-5 sm:h-5" />
              </a>
              <a
                href="https://www.youtube.com/"
                className="p-2 sm:p-3 bg-[#f3e8ff] rounded-full hover:bg-[#7367F0] hover:text-white transition-colors duration-200 group"
                aria-label="YouTube"
              >
                <FaYoutube size={16} className="sm:w-5 sm:h-5" />
              </a>
              <a
                href="https://id.zalo.me/account?continue=https%3A%2F%2Fchat.zalo.me%2F"
                className="p-2 sm:p-3 bg-[#f3e8ff] rounded-full hover:bg-[#7367F0] hover:text-white transition-colors duration-200 group"
                aria-label="Zalo"
              >
                <SiZalo size={16} className="sm:w-5 sm:h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Dòng Copyright */}
      <div className="bg-[#E7D2F9] py-3 sm:py-4">
        <div className="container mx-auto px-4 text-center text-gray-600 text-xs sm:text-sm">
          © 2025 SHOPNK. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
