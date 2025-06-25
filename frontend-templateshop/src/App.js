import { Route, Routes } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPgae from "./pages/RegisterPage";

function App() {
  return (
    <Routes>
      {/* Tất cả các route bên trong MainLayout sẽ có Navbar và Footer */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPgae />} />
      </Route>
      {/* Các route không có layout chung, ví dụ trang đăng nhập/đăng ký */}

    </Routes>
  );
}

export default App;
