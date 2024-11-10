import './App.css';
import LoginForm from './components/LoginForm';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Register from './components/Register';
import React, { useEffect } from 'react';
import AddCash from './components/AddCash';
import Layout from './components/Layout';
import AddExpense from './components/AddExpense';
import Header from './components/Header';
import ErrorBoundary from './ErrorHandling/ErrorBoundary';
import Transaction from './components/Transaction';
import CategoryChart from './components/CategoryChart';
import GoogleCallback from './components/GoogleCallback';
import Goal from './components/Goal';
import Settings from './components/Settings';
import ProfileDetails from './components/ProfileDetails';
import { UserProvider } from './components/UserContext';
import { ThemeProvider, useTheme } from './components/ThemeContext'; // Import useTheme
import Appearance from './components/Appearance';
import { Navigate } from 'react-router-dom';

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <ErrorBoundary>
          <Main />
        </ErrorBoundary>
      </UserProvider>
    </ThemeProvider>
  );
}

const Main = () => {
  const { theme } = useTheme(); // Access the current theme

  useEffect(() => {
    document.body.style.backgroundColor = theme.backgroundColor; // Set background color from theme
  }, [theme]); // Update whenever the theme changes

  const route = createBrowserRouter([
    {
      path: '/',
      element: (
        <div>
          <Header showLogout={false} />
          <LoginForm />
        </div>
      ),
    },
    {
      path: '/googleCallback',
      element: (
        <div>
          <Header showLogout={false} />
          <GoogleCallback />
        </div>
      ),
    },
    {
      path: '/signup',
      element: (
        <div>
          <Header showLogout={false} />
          <Register />
        </div>
      ),
    },
    {
      path: '/app',
      element: <Layout />,
      children: [
        { path: 'add-cash', element: <AddCash /> },
        { path: 'add-expense', element: <AddExpense /> },
        { path: 'transaction', element: <Transaction /> },
        { path: 'category', element: <CategoryChart /> },
        { path: 'saving-goal', element: <Goal /> },
        {
          path: 'settings',
          element: <Settings />,
          children: [
            { path: 'profile', element: <ProfileDetails /> },
            { path: 'appearance', element: <Appearance /> },
          //  { path: 'preferences', element: <Preferences /> },
            { path: '', element: <Navigate to="profile" /> },
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={route} />;
};

export default App;
