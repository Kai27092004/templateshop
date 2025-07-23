import React from "react";
import { NavLink } from "react-router-dom";

// Dữ liệu giả mới, tập trung vào landing page
const samplePosts = [
  {
    id: 1,
    category: "Tối ưu hóa",
    title: "5 Yếu tố không thể thiếu của một Landing Page chuyển đổi cao",
    description:
      "Tìm hiểu về tiêu đề hấp dẫn, CTA mạnh mẽ, social proof và các yếu tố khác giúp landing page của bạn đạt hiệu quả tối đa.",
    imageUrl:
      "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2070&auto=format&fit=crop",
    link: "/tin-tuc/5-yeu-to-landing-page",
  },
  {
    id: 2,
    category: "Content Marketing",
    title:
      "Làm thế nào để viết nội dung (Copywriting) thu hút cho Landing Page?",
    description:
      "Nghệ thuật sử dụng ngôn từ để thuyết phục khách hàng. Chúng tôi sẽ chỉ cho bạn cách viết những nội dung không thể bị từ chối.",
    imageUrl:
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=2072&auto=format&fit=crop",
    link: "/tin-tuc/copywriting-cho-landing-page",
  },
  {
    id: 3,
    category: "Phân tích",
    title: "A/B Testing là gì? Hướng dẫn tối ưu Landing Page bằng dữ liệu",
    description:
      "Đừng phỏng đoán! Hãy để dữ liệu trả lời. Hướng dẫn từng bước cách thực hiện A/B testing để tìm ra phiên bản hiệu quả nhất.",
    imageUrl:
      "https://images.unsplash.com/photo-1543286386-713bdd548da4?q=80&w=2070&auto=format&fit=crop",
    link: "/tin-tuc/ab-testing-landing-page",
  },
  {
    id: 4,
    category: "Thiết kế UI/UX",
    title: "Tầm quan trọng của màu sắc trong thiết kế Landing Page",
    description:
      "Màu sắc ảnh hưởng đến tâm lý và quyết định mua hàng. Khám phá cách chọn và phối màu để tăng sức hấp dẫn cho trang của bạn.",
    imageUrl:
      "https://images.unsplash.com/photo-1522881451255-f59ad836fdfb?q=80&w=2070&auto=format&fit=crop",
    link: "/tin-tuc/mau-sac-trong-thiet-ke",
  },
];

// Component NewsCard cải thiện responsive
const NewsCard = ({ post }) => (
  <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 group h-full flex flex-col">
    <NavLink to={post.link} className="flex flex-col h-full">
      <div className="relative overflow-hidden">
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4 sm:p-6 flex-1 flex flex-col">
        <p className="text-xs sm:text-sm font-semibold text-[#7c3aed] mb-2 uppercase tracking-wide">
          {post.category}
        </p>
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 group-hover:text-[#7c3aed] transition-colors leading-tight flex-1">
          {post.title}
        </h3>
        <p className="text-gray-600 leading-relaxed mb-4 text-sm sm:text-base line-clamp-3">
          {post.description}
        </p>
        <div className="mt-auto">
          <span className="font-bold text-[#7c3aed] text-sm sm:text-base inline-flex items-center">
            Đọc thêm
            <svg
              className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </span>
        </div>
      </div>
    </NavLink>
  </div>
);

const NewsPage = () => {
  return (
    <div className="bg-gray-50 py-12 sm:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
            Kiến thức về Landing Page
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mt-2 sm:mt-3 px-2 leading-relaxed">
            Chia sẻ kinh nghiệm giúp bạn tối ưu hóa chiến dịch marketing.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {samplePosts.map((post) => (
            <NewsCard key={post.id} post={post} />
          ))}
        </div>

        {/* Phần pagination hoặc load more có thể thêm vào đây */}
        <div className="text-center mt-8 sm:mt-12">
          <button className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base">
            Xem thêm bài viết
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsPage;
