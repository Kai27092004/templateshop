import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import {
  HomeIcon,
  ShoppingBagIcon,
  ClipboardDocumentListIcon,
  TagIcon,
  UserGroupIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";


const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const navigation = [
    {
      name: "Trang Quản Trị",
      href: "/admin",
      icon: HomeIcon,
      current: location.pathname === "/admin",
    },
    {
      name: "Quản Lý Đơn Hàng",
      href: "/admin/orders",
      icon: ClipboardDocumentListIcon,
      current: location.pathname === "/admin/orders",
    },
    {
      name: "Quản Lý Danh Mục",
      href: "/admin/categories",
      icon: TagIcon,
      current: location.pathname === "/admin/categories",
    },
    {
      name: "Quản Lý Templates",
      href: "/admin/templates",
      icon: ShoppingBagIcon,
      current: location.pathname === "/admin/templates",
    },
    {
      name: "Quản Lý Người Dùng",
      href: "/admin/users",
      icon: UserGroupIcon,
      current: location.pathname === "/admin/users",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-gray-500/30 shadow-lg"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}

      {/* Dynamic Sidebar for both mobile and desktop */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
          <button
            type="button"
            className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
            onClick={() => setSidebarOpen(false)}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <nav className="mt-5 px-2 h-full overflow-y-auto">
          <div className="space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${item.current
                  ? "bg-indigo-100 text-indigo-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                onClick={() => {
                  // Only close sidebar on mobile
                  if (window.innerWidth < 1024) {
                    setSidebarOpen(false);
                  }
                }}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 ${item.current ? "text-indigo-500" : "text-gray-400"
                    }`}
                />
                {item.name}
              </Link>
            ))}
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${sidebarOpen ? "lg:ml-64" : "ml-0"
          }`}
      >
        {/* Header with hamburger button */}
        <div className="flex h-16 items-center justify-between bg-white px-4 shadow-sm border-b border-gray-200">
          <div className="flex items-center">
            <button
              type="button"
              className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 mr-4"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            <div className="hidden lg:block">
              <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
            </div>
            <div className="lg:hidden">
              <h1 className="text-lg font-semibold text-gray-900">Admin</h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
              <BellIcon className="h-6 w-6" />
            </button>

            <div className="hidden lg:flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.fullName || 'Admin'}</p>
                <p className="text-xs text-gray-500">{user?.email || 'admin@email.com'}</p>
              </div>
              <img
                className="h-8 w-8 rounded-full"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="Admin"
              />
              <button
                onClick={logout}
                className="rounded-full p-2 text-gray-400 hover:bg-red-100 hover:text-red-500"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="lg:hidden">
              <button className="rounded-full p-1 text-gray-400 hover:text-gray-500">
                <UserCircleIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Welcome message for desktop */}
        <div className="hidden lg:block bg-white px-8 py-2 border-b border-gray-200">
          <p className="text-sm text-gray-500">
            Chào mừng Admin! Đây là ghi chú về quản trị trang web.
          </p>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <Outlet />
        </main>
        <footer>
          <div className="bg-[#E7D2F9] py-3 sm:py-4">
            <div className="container mx-auto px-4 text-center text-gray-600 text-xs sm:text-sm">
              © 2025 SHOPNK. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
export default AdminLayout;