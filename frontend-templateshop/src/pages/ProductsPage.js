import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getAllTemplates } from '../services/templateService';
import { getAllCategories } from '../services/categoryService';
import ProductCard from '../components/products/ProductCard';
import { getPurchasedTemplateIds, getPendingTemplateIds } from '../services/orderService';
import { useAuth } from '../contexts/AuthContext';


// Đổi tên component cho thống nhất
const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const location = useLocation();
    const [purchasedIds, setPurchasedIds] = useState([]);
    const { isAuthenticated } = useAuth();
    const [pendingIds, setPendingIds] = useState([]);

    useEffect(() => {
        const loadAllData = async () => {
            setLoading(true);
            setError(''); // Reset lỗi mỗi khi tải lại
            try {
                // Sử dụng Promise.all để gọi các API không phụ thuộc nhau song song
                const [productsRes, categoriesRes] = await Promise.all([
                    getAllTemplates(),
                    getAllCategories()
                ]);

                const sortedProducts = productsRes.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setProducts(sortedProducts);
                setCategories(categoriesRes.data);

                // Sau đó, nếu người dùng đã đăng nhập, mới lấy danh sách ID đã mua
                if (isAuthenticated) {
                    const [purchasedRes, pendingRes] = await Promise.all([
                        getPurchasedTemplateIds(),
                        getPendingTemplateIds()
                    ]);
                    setPurchasedIds(purchasedRes.data);
                    setPendingIds(pendingRes.data);
                } else {
                    setPurchasedIds([]);
                    setPendingIds([]);
                }

            } catch (err) {
                setError('Không thể tải dữ liệu trang sản phẩm.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadAllData();
    }, [isAuthenticated]);

    useEffect(() => {
        if (location.state?.category) {
            setSelectedCategory(location.state.category.id.toString());
        }
    }, [location.state]);

    const filteredProducts = products.filter((p) => {
        const matchCategory = selectedCategory === "all" || p.category?.id.toString() === selectedCategory;
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
        return matchCategory && matchSearch;
    });

    if (loading) {
        return <div className="text-center py-20">Đang tải dữ liệu...</div>
    }

    if (error) {
        return <div className="text-center py-20 text-red-500">{error}</div>
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                {/* Bố cục chính: flex-col cho mobile, md:flex-row cho desktop */}
                <div className="flex flex-col md:flex-row gap-8 lg:gap-12">

                    {/* Sidebar */}
                    <aside className="w-full md:w-64 lg:w-72 flex-shrink-0">
                        <div className="md:sticky md:top-24 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                            <div className="mb-6 relative">
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm theo tên"
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7c3aed] text-base"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1 0 6.5 6.5a7.5 7.5 0 0 0 10.6 10.6Z" /></svg>
                                </span>
                            </div>
                            <nav>
                                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Danh mục</h3>
                                <button
                                    className={`w-full text-left px-3 py-2 rounded-lg font-semibold transition-colors text-base mb-2 ${selectedCategory === 'all' ? "bg-[#f3e8ff] text-[#7c3aed]" : "hover:bg-gray-100 text-gray-700"}`}
                                    onClick={() => setSelectedCategory('all')}
                                >
                                    Tất cả sản phẩm
                                </button>
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        className={`w-full text-left px-3 py-2 rounded-lg font-semibold transition-colors text-base mb-1 ${selectedCategory === cat.id.toString() ? "bg-[#f3e8ff] text-[#7c3aed]" : "hover:bg-gray-100 text-gray-700"}`}
                                        onClick={() => setSelectedCategory(cat.id.toString())}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    {/* Main content */}
                    <main className="flex-1">
                        <div className="text-center mb-10">
                            <h1 className="text-3xl md:text-5xl font-bold text-[#7c3aed] mb-3 leading-tight">
                                Mua nhanh Website từ template chuyên nghiệp
                            </h1>
                            <p className="text-base md:text-xl text-gray-600 max-w-2xl mx-auto">
                                Chọn mẫu landing page phù hợp với ngành nghề của bạn. Thiết kế đẹp, tối ưu chuyển đổi, sẵn sàng sử dụng.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                            {filteredProducts.map(product => (
                                <ProductCard key={product.id} template={product} purchasedIds={purchasedIds} pendingIds={pendingIds} />
                            ))}
                        </div>
                        {filteredProducts.length === 0 && (
                            <div className="text-center text-gray-400 mt-16 py-10 bg-white rounded-lg shadow">Không tìm thấy sản phẩm phù hợp.</div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;