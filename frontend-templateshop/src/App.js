import { Route, Routes } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CartPage from './pages/CartPage';
import OrderSuccessPage from "./pages/OrderSuccessPage";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import DashboardPage from "./pages/admin/DashboardPage";
import AdminRoute from './components/auth/AdminRoute';
import PaymentPage from "./pages/PaymentPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminLayout from "./components/layout/AdminLayout";
import OrderManager from "./components/admin/OrderManager";
import CategoryManager from "./components/admin/CategoryManager";
import TemplateManager from "./components/admin/TemplateManager";
import UserManager from "./components/admin/UserManager";
import AboutPage from "./pages/AboutPage";
import NewsPage from "./pages/NewsPage";
import ContactPage from "./pages/ContactPage";
import ProductsPage from "./pages/ProductsPage";
import ScrollToTop from "./components/layout/ScrollToTop";
import ScrollToTopButton from "./components/ui/ScrollToTopButton";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";

function App() {
  return (
    <>
      <ScrollToTop />
      <ScrollToTopButton />
      <Routes>
        {/* === CÁC ROUTE CHO USER (bên trong MainLayout) === */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="ve-chung-toi" element={<AboutPage />} />
          <Route path="tin-tuc" element={<NewsPage />} />
          <Route path="lien-he" element={<ContactPage />} />
          <Route path="gio-hang" element={<CartPage />} />
          <Route path="san-pham" element={<ProductsPage />} />
          <Route path="order-success" element={<OrderSuccessPage />} />
          {/* Các trang cần đăng nhập của user */}
          <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="payment/:orderId" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* === CÁC ROUTE KHÔNG CÓ LAYOUT CHUNG === */}

        {/* Trang đăng nhập của Admin cũng không cần layout */}
        <Route path="/admin/login" element={
          <AdminAuthProvider>
            <AdminLoginPage />
          </AdminAuthProvider>
        } />

        {/* === CÁC ROUTE CỦA ADMIN (bên trong AdminLayout) === */}
        <Route
          path="/admin"
          element={
            <AdminAuthProvider>
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            </AdminAuthProvider>
          }
        >
          {/* Trang index mặc định của /admin */}
          <Route index element={<DashboardPage />} />
          {/* Các trang con của admin */}
          <Route path="orders" element={<OrderManager />} />
          <Route path="categories" element={<CategoryManager />} />
          <Route path="templates" element={<TemplateManager />} />
          <Route path="users" element={<UserManager />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;