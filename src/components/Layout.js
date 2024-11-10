import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
  return (
    <div>
      <Header showLogout={true} />
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 p-3">
        <Outlet /> 
      </div>
    </div>
    </div>
  );
};

export default Layout;
