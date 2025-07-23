import React from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import GradientButton from "../components/ui/GradientButton";

const ContactPage = () => {
  return (
    <div className="bg-gray-50 py-12 sm:py-16">
      <div className="container mx-auto px-4">
        {/* Tiêu đề trang */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
            Liên hệ với chúng tôi
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mt-2 sm:mt-3 px-2">
            Chúng tôi luôn sẵn sàng lắng nghe. Hãy gửi cho chúng tôi một tin
            nhắn!
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-2xl p-6 sm:p-8 lg:p-12">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12">
            {/* Cột 1: Form liên hệ */}
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                Gửi tin nhắn
              </h2>
              <form action="#" method="POST" className="space-y-4 sm:space-y-5">
                <div>
                  <label
                    htmlFor="name"
                    className="block font-medium text-gray-700 text-sm sm:text-base mb-1"
                  >
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 sm:py-3 px-3 sm:px-4 focus:ring-[#7c3aed] focus:border-[#7c3aed] text-sm sm:text-base transition-colors"
                    placeholder="Nhập họ và tên của bạn"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block font-medium text-gray-700 text-sm sm:text-base mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 sm:py-3 px-3 sm:px-4 focus:ring-[#7c3aed] focus:border-[#7c3aed] text-sm sm:text-base transition-colors"
                    placeholder="Nhập email của bạn"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block font-medium text-gray-700 text-sm sm:text-base mb-1"
                  >
                    Nội dung tin nhắn
                  </label>
                  <textarea
                    name="message"
                    id="message"
                    rows="4"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 sm:py-3 px-3 sm:px-4 focus:ring-[#7c3aed] focus:border-[#7c3aed] text-sm sm:text-base transition-colors resize-vertical"
                    placeholder="Nhập nội dung tin nhắn..."
                  ></textarea>
                </div>
                <div className="pt-2">
                  <GradientButton
                    type="submit"
                    className="w-full justify-center text-sm sm:text-base py-2 sm:py-3"
                  >
                    Gửi tin nhắn
                  </GradientButton>
                </div>
              </form>
            </div>

            {/* Cột 2: Thông tin liên hệ */}
            <div className="space-y-6 sm:space-y-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                Thông tin chi tiết
              </h2>
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="bg-[#f3e8ff] p-2 sm:p-3 rounded-full flex-shrink-0">
                  <FaMapMarkerAlt className="text-[#7c3aed]" size={16} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                    Địa chỉ
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                    Số 123, Đường ABC, Phường XYZ, Quận 1, TP. Hồ Chí Minh
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="bg-[#f3e8ff] p-2 sm:p-3 rounded-full flex-shrink-0">
                  <FaPhoneAlt className="text-[#7c3aed]" size={16} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                    Điện thoại
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base">
                    <a
                      href="tel:0987654321"
                      className="hover:text-[#7c3aed] transition-colors"
                    >
                      0987 654 321
                    </a>
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="bg-[#f3e8ff] p-2 sm:p-3 rounded-full flex-shrink-0">
                  <FaEnvelope className="text-[#7c3aed]" size={16} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                    Email
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base">
                    <a
                      href="mailto:contact@shopnk.vn"
                      className="hover:text-[#7c3aed] transition-colors"
                    >
                      contact@shopnk.vn
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Phần Google Map */}
        <div className="mt-12 sm:mt-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-gray-800">
            Tìm chúng tôi trên bản đồ
          </h2>
          <div className="rounded-lg shadow-2xl overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.447176473138!2d106.69714857588404!3d10.776992389372134!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f3987e2106b%3A0x869230553186250b!2zQml0ZXhjbyBGaW5hbmNpYWwgVG93ZXIsIDIgSOG6o2kgVHJp4buBdSwgQuG6v24gTmdow6ksIFF14bqtbiAxLCBUaMOgbmggcGjhu5EgSOG7kyBDaMOtIE1pbmgsIFZp4buHdG5hbQ!5e0!3m2!1svi!2s!4v1720448135899!5m2!1svi!2s"
              width="100%"
              height="350"
              className="sm:h-[400px] lg:h-[450px]"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Bản đồ vị trí SHOPNK"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
