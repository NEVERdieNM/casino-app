import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import LoadingOverlay from '../ui/LoadingOverlay';
import { useSelector } from 'react-redux';

const Layout = () => {
  const { isLoading } = useSelector((state) => state.ui);

  return (
    <div className="flex flex-col min-h-screen bg-casino-dark">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <Footer />
      {isLoading && <LoadingOverlay />}
    </div>
  );
};

export default Layout;