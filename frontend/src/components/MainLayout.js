import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import './../styles/MainLayout.css';

const MainLayout = () => {
  return (
    <div className="main-layout">
      <Navbar />
      <main className="content-area">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
