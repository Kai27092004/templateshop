import React from "react";
// Thay đổi icon cho phù hợp hơn
import { FaPaintBrush, FaBullseye, FaRocket, FaHeadset } from "react-icons/fa";

const ValueCard = ({ icon, title, children }) => (
  <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg text-center transform hover:-translate-y-2 transition-transform duration-300">
    <div className="text-[#7c3aed] inline-block p-3 sm:p-4 bg-[#f3e8ff] rounded-full mb-3 sm:mb-4">
      {icon}
    </div>
    <h3 className="text-lg sm:text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
      {children}
    </p>
  </div>
);

const AboutPage = () => {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-[#f3e8ff] py-12 sm:py-16 lg:py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-[#7c3aed] leading-tight">
            Biến Ý Tưởng Thành Landing Page Hiệu Quả
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 mt-3 sm:mt-4 max-w-4xl mx-auto leading-relaxed px-2">
            Chúng tôi cung cấp những mẫu landing page được thiết kế chuyên
            nghiệp, tối ưu hóa chuyển đổi, giúp bạn tiết kiệm thời gian và bùng
            nổ doanh số.
          </p>
        </div>
      </section>

      {/* Sứ mệnh */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="order-2 md:order-1">
              <img
                src="https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=2070&auto=format&fit=crop"
                alt="Thiết kế Landing Page"
                className="rounded-lg shadow-2xl w-full h-64 sm:h-80 md:h-96 object-cover"
              />
            </div>
            <div className="space-y-4 sm:space-y-6 order-1 md:order-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 leading-tight">
                Sứ mệnh của SHOPNK
              </h2>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                Trong thế giới số cạnh tranh, một landing page ấn tượng là chìa
                khóa thành công. Sứ mệnh của chúng tôi là trao cho các doanh
                nghiệp, từ startup đến các thương hiệu lớn, những công cụ mạnh
                mẽ để thu hút khách hàng và tối đa hóa lợi nhuận mà không cần
                tốn chi phí và thời gian cho việc thiết kế từ đầu.
              </p>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                Mỗi mẫu landing page của chúng tôi không chỉ đẹp về mặt thẩm mỹ
                mà còn được xây dựng dựa trên các nguyên tắc về tâm lý học người
                dùng và tối ưu hóa chuyển đổi (CRO).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tại sao chọn chúng tôi? */}
      <section className="bg-white py-12 sm:py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-800">
            Tại sao chọn Landing Page của chúng tôi?
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto mb-8 sm:mb-12 text-sm sm:text-base leading-relaxed px-2">
            Chúng tôi không chỉ bán template, chúng tôi mang đến giải pháp toàn
            diện cho chiến dịch của bạn.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <ValueCard
              icon={<FaPaintBrush size={24} className="sm:w-8 sm:h-8" />}
              title="Thiết kế Chuyên nghiệp"
            >
              Giao diện hiện đại, bắt mắt, và tương thích trên mọi thiết bị di
              động.
            </ValueCard>
            <ValueCard
              icon={<FaBullseye size={24} className="sm:w-8 sm:h-8" />}
              title="Tối ưu Chuyển đổi"
            >
              Cấu trúc và lời kêu gọi hành động (CTA) được bố trí để tăng tỷ lệ
              chuyển đổi.
            </ValueCard>
            <ValueCard
              icon={<FaRocket size={24} className="sm:w-8 sm:h-8" />}
              title="Tốc độ & Hiệu năng"
            >
              Code sạch, tối ưu hóa tốc độ tải trang để mang lại trải nghiệm tốt
              nhất.
            </ValueCard>
            <ValueCard
              icon={<FaHeadset size={24} className="sm:w-8 sm:h-8" />}
              title="Hỗ trợ Tận tình"
            >
              Đội ngũ của chúng tôi luôn sẵn sàng hỗ trợ bạn trong quá trình sử
              dụng.
            </ValueCard>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
