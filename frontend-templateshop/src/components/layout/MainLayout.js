import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';


const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto p-4">
        <Outlet /> {/*Đây là nơi nội dung của các trang con sẽ được hiển thị*/}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;