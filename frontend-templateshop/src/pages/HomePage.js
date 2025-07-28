import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import GradientButton from "../components/ui/GradientButton";
import { getAllCategories } from "../services/categoryService"; // Import service để lấy danh mục

// Helper component cho các thẻ icon danh mục
const CategoryIconCard = ({ category, icon, color, variants }) => (
	<motion.div
		className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full"
		variants={variants}
		whileHover={{
			y: -10,
			transition: { duration: 0.3 },
		}}
	>
		<div className={`w-16 h-16 bg-gradient-to-r ${color} rounded-2xl flex items-center justify-center text-2xl mb-6`}>
			{icon}
		</div>
		<h3 className="text-xl font-bold text-gray-800 mb-4">
			{category.name}
		</h3>
		<p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">
			{/* Nếu có description thì dùng, không thì tạo mô tả mặc định */}
			{category.description || `Khám phá các mẫu template tuyệt vời thuộc danh mục ${category.name}.`}
		</p>
		<div className="mt-auto">
			<Link to="/san-pham" state={{ category: category }}>
				<motion.button
					className={`w-full py-3 px-4 bg-gradient-to-r ${color} text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300`}
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
				>
					Xem mẫu
				</motion.button>
			</Link>
		</div>
	</motion.div>
);

// Helper component cho các thẻ ảnh danh mục
const CategoryImageCard = ({ category, imageUrl, variants }) => (
	<motion.div
		className="group relative overflow-hidden rounded-2xl shadow-lg"
		variants={variants}
		whileHover={{ scale: 1.05 }}
		transition={{ duration: 0.3 }}
	>
		<img
			src={imageUrl}
			alt={category.name}
			className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
		/>
		<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
			<div className="absolute bottom-4 left-4 text-white">
				<h4 className="text-lg font-semibold">{category.name}</h4>
				<p className="text-sm opacity-90 mb-2">
					{category.productCount} sản phẩm
				</p>
				<Link to="/san-pham" state={{ category: category }}>
					<motion.button
						className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/30 transition-all duration-300"
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
					>
						Khám phá
					</motion.button>
				</Link>
			</div>
		</div>
	</motion.div>
);


const HomePage = () => {
	const [stats, setStats] = useState({
		landingPages: 0,
		customers: 0,
		templates: 0,
		satisfaction: 0,
	});
	// State để lưu danh sách danh mục
	const [categories, setCategories] = useState([]);

	// Animation variants
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: { staggerChildren: 0.2 },
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 50 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.6, ease: "easeOut" },
		},
	};

	const fadeInUp = {
		hidden: { opacity: 0, y: 60 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.8,
				ease: "easeOut",
			},
		},
	};

	// Mảng icon và màu sắc tương ứng, có thể mở rộng
	const categoryStyles = [
		{ icon: "💄", color: "from-pink-500 to-rose-500" },
		{ icon: "🍽️", color: "from-orange-500 to-red-500" },
		{ icon: "✈️", color: "from-blue-500 to-cyan-500" },
		{ icon: "🎨", color: "from-purple-500 to-indigo-500" },
	];

	// Mảng ảnh tương ứng cho portfolio
	const portfolioImages = [
		"https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop",
		"https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop",
		"https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop",
		"https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop"
	];

	// Counter animation effect
	useEffect(() => {
		const targets = {
			landingPages: 500,
			customers: 1200,
			templates: 50,
			satisfaction: 98,
		};

		const duration = 2000; // 2 seconds
		const steps = 60;
		const stepDuration = duration / steps;

		const intervals = Object.keys(targets).map((key) => {
			const target = targets[key];
			const increment = target / steps;
			let current = 0;
			let step = 0;

			return setInterval(() => {
				step++;
				current += increment;
				if (step >= steps) {
					current = target;
					clearInterval(intervals.find((i) => i === this));
				}
				setStats((prev) => ({
					...prev,
					[key]: Math.floor(current),
				}));
			}, stepDuration);
		});

		return () => intervals.forEach(clearInterval);
	}, []);

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


	return (
		<div className="min-h-screen bg-white">
			{/* Hero Section */}
			<motion.section
				className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 overflow-hidden"
				initial="hidden"
				animate="visible"
				variants={containerVariants}
			>
				{/* Animated background elements */}
				<motion.div
					className="absolute inset-0 opacity-30"
					style={{
						backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
					}}
					animate={{
						backgroundPosition: ["0% 0%", "100% 100%"],
					}}
					transition={{
						duration: 20,
						repeat: Infinity,
						repeatType: "reverse",
						ease: "linear",
					}}
				/>

				<div className="container mx-auto px-6 text-center relative z-10">
					<motion.div variants={itemVariants} className="max-w-4xl mx-auto">
						<motion.h1
							className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
							variants={itemVariants}
						>
							Landing Page{" "}
							<span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
								Chuyên Nghiệp
							</span>{" "}
							Cho Mọi Ngành
						</motion.h1>

						<motion.p
							className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed"
							variants={itemVariants}
						>
							Mẫu landing page thiết kế sẵn cho Mỹ phẩm, Nhà hàng, Du lịch &
							Portfolio
						</motion.p>

						<motion.div
							className="flex flex-col sm:flex-row gap-4 justify-center items-center"
							variants={itemVariants}
						>
							<motion.div
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								<GradientButton className="px-8 py-4 text-lg font-semibold rounded-full">
									<a href="/san-pham">Mua Landing Page →</a>
								</GradientButton>
							</motion.div>

							<motion.button
								className="px-8 py-4 text-lg font-semibold text-white border-2 border-white/30 rounded-full hover:bg-white/10 transition-all duration-300"
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								<a href="/san-pham">Xem mẫu demo</a>
							</motion.button>
						</motion.div>
					</motion.div>

					{/* Floating elements */}
					<motion.div
						className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full"
						animate={{
							y: [0, -20, 0],
							rotate: [0, 180, 360],
						}}
						transition={{
							duration: 6,
							repeat: Infinity,
							ease: "easeInOut",
						}}
					/>

					<motion.div
						className="absolute bottom-32 right-16 w-16 h-16 bg-yellow-400/20 rounded-full"
						animate={{
							y: [0, 20, 0],
							x: [0, 10, 0],
						}}
						transition={{
							duration: 4,
							repeat: Infinity,
							ease: "easeInOut",
						}}
					/>
				</div>
			</motion.section>

			{/* Services Section - Đã cập nhật */}
			<motion.section
				className="py-20 bg-gray-50"
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true, amount: 0.3 }}
				variants={containerVariants}
			>
				<div className="container mx-auto px-6">
					<motion.div className="text-center mb-16" variants={itemVariants}>
						<h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
							Mẫu Landing Page Chuyên Nghiệp
						</h2>
						<p className="text-xl text-gray-600 max-w-3xl mx-auto">
							Chọn mẫu landing page phù hợp với ngành nghề của bạn. Thiết kế
							đẹp, tối ưu chuyển đổi và sẵn sàng sử dụng
						</p>
					</motion.div>

					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
						{/* Lấy 4 danh mục đầu tiên để hiển thị */}
						{categories.slice(0, 4).map((category, index) => (
							<CategoryIconCard
								key={category.id}
								category={category}
								icon={categoryStyles[index % categoryStyles.length].icon}
								color={categoryStyles[index % categoryStyles.length].color}
								variants={itemVariants}
							/>
						))}
					</div>
				</div>
			</motion.section>

			{/* Portfolio Section - Đã cập nhật */}
			<motion.section
				className="py-20 bg-white"
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true, amount: 0.3 }}
				variants={containerVariants}
			>
				<div className="container mx-auto px-6">
					<motion.div className="text-center mb-16" variants={itemVariants}>
						<h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
							Khám phá Các Mẫu Nổi Bật
						</h2>
						<p className="text-xl text-gray-600 max-w-3xl mx-auto">
							Xem trước các mẫu landing page chuyên nghiệp. Thiết kế đẹp mắt, tối ưu chuyển đổi.
						</p>
					</motion.div>

					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
						{/* Lấy 6 danh mục đầu tiên để hiển thị */}
						{categories.slice(0, 6).map((category, index) => (
							<CategoryImageCard
								key={category.id}
								category={category}
								imageUrl={portfolioImages[index % portfolioImages.length]}
								variants={itemVariants}
							/>
						))}
					</div>
				</div>
			</motion.section>

			{/* Stats Section */}
			<motion.section
				className="py-20 bg-gradient-to-r from-purple-600 to-blue-600"
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true, amount: 0.5 }}
				variants={containerVariants}
			>
				<div className="container mx-auto px-6">
					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
						{[
							{
								number: stats.landingPages,
								label: "Landing Page đã bán",
								suffix: "+",
							},
							{
								number: stats.customers,
								label: "Khách hàng hài lòng",
								suffix: "+",
							},
							{
								number: stats.templates,
								label: "Mẫu thiết kế",
								suffix: "+",
							},
							{
								number: stats.satisfaction,
								label: "Đánh giá tích cực",
								suffix: "%",
							},
						].map((stat, index) => (
							<motion.div
								key={index}
								variants={itemVariants}
								className="text-white"
							>
								<motion.div
									className="text-4xl md:text-5xl font-bold mb-2"
									initial={{ scale: 0 }}
									whileInView={{ scale: 1 }}
									transition={{
										duration: 0.5,
										delay: index * 0.1,
										type: "spring",
										stiffness: 100,
									}}
								>
									{stat.number.toLocaleString()}
									{stat.suffix}
								</motion.div>
								<div className="text-blue-100 text-lg">{stat.label}</div>
							</motion.div>
						))}
					</div>
				</div>
			</motion.section>

			{/* CTA Section */}
			<motion.section
				className="py-20 bg-gray-900"
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true, amount: 0.3 }}
				variants={fadeInUp}
			>
				<div className="container mx-auto px-6 text-center">
					<motion.h2
						className="text-4xl md:text-5xl font-bold text-white mb-6"
						variants={itemVariants}
					>
						Sẵn sàng sở hữu Landing Page chuyên nghiệp?
					</motion.h2>
					<motion.p
						className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
						variants={itemVariants}
					>
						Chọn mẫu landing page phù hợp với ngành nghề của bạn. Thiết kế đẹp,
						tối ưu chuyển đổi, giao hàng ngay
					</motion.p>
					<motion.div
						className="flex flex-col sm:flex-row gap-4 justify-center"
						variants={itemVariants}
					>
						<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
							<GradientButton className="px-8 py-4 text-lg font-semibold rounded-full">
								<a href="/san-pham">Mua ngay</a>
							</GradientButton>
						</motion.div>
						<motion.button
							className="px-8 py-4 text-lg font-semibold text-white border-2 border-white/30 rounded-full hover:bg-white/10 transition-all duration-300"
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							<a href="/lien-he">Tư vấn miễn phí</a>
						</motion.button>
					</motion.div>
				</div>
			</motion.section>
		</div>
	);
};

export default HomePage;