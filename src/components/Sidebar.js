import React from 'react';
import { NavLink } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Sidebar.css';
import { useTheme } from './ThemeContext';

const Sidebar = () => {
  const { theme } = useTheme(); // Get the current theme

  return (
    <div
      className="sidebar"
      style={{
        backgroundColor: theme.sidebarBackgroundColor,
        color: theme.sidebarTextColor,
      }}
    >
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <NavLink
            to="/app/add-expense"
            className={({ isActive }) => `nav-link rounded-0 ${isActive ? 'bg-active' : ''}`}
            style={{ color: theme.sidebarTextColor }} 
          >
            <i className="bi bi-wallet-fill me-2"></i>
            Add Expense
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/app/add-cash"
            className={({ isActive }) => `nav-link rounded-0 ${isActive ? 'bg-active' : ''}`}
            style={{ color: theme.sidebarTextColor }}
          >
            <i className="bi bi-wallet-fill me-2"></i>
            Add Income
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/app/saving-goal"
            className={({ isActive }) => `nav-link rounded-0 ${isActive ? 'bg-active' : ''}`}
            style={{ color: theme.sidebarTextColor }}
          >
            <i className="bi bi-wallet-fill me-2"></i>
            Goal
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/app/transaction"
            className={({ isActive }) => `nav-link rounded-0 ${isActive ? 'bg-active' : ''}`}
            style={{ color: theme.sidebarTextColor }}
          >
            <i className="bi bi-wallet-fill me-2"></i>
            Transactions
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/app/category"
            className={({ isActive }) => `nav-link rounded-0 ${isActive ? 'bg-active' : ''}`}
            style={{ color: theme.sidebarTextColor }}
          >
            <i className="bi bi-wallet-fill me-2"></i>
            Graphs
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
