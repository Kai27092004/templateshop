import { Route, Routes } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPgae from "./pages/RegisterPage";
import ProductDetailPage from "./pages/ProductDetailPage";
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
import TemplateManger from "./components/admin/TemplateManager";
function App() {
  return (
    <Routes>
      {/* Tất cả các route bên trong MainLayout sẽ có Navbar và Footer */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPgae />} />
        <Route path="templates/:slug" element={<ProductDetailPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="order-success" element={<OrderSuccessPage />} />
        <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/payment/:orderId" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
      </Route>

      {/* Các route không có layout chung, ví dụ trang đăng nhập/đăng ký */}
      <Route path="admin/login" element={<AdminLoginPage />} />

      {/* Các route Admin */}
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<DashboardPage />} />
        <Route path="orders" element={<OrderManager />} />
        <Route path="categories" element={<CategoryManager />} />
        <Route path="templates" element={<TemplateManger />} />
      </Route>


    </Routes>
  );
}

export default App;
