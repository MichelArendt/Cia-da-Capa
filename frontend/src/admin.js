import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client'; // Use createRoot for React 18
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import api from './api'; // Adjust the path if needed
import useStore from './store';

// Adds shared header link (material symbols, etc)
import addHeaderLink from './components/shared/HeaderLink';
addHeaderLink();

import Header from './components/shared/Header';
import MenuAdmin from './components/admin/MenuAdmin';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';

import './styles/admin/admin.scss';

const getBasename = () => {
  // Get the current path without any trailing slash
  const pathName = window.location.pathname.replace(/\/$/, '');
  return pathName;
};

const AdminApp = () => {
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const setAuthenticated = useStore((state) => state.setAuthenticated);

  // Check authentication status on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await api.get('/user');
        setAuthenticated(true);
      } catch (error) {
        setAuthenticated(false);
      }
    };
    checkAuth();
  }, [setAuthenticated]);

	return (
		<Router basename={getBasename()}>
      <Header>
        <MenuAdmin />
      </Header>
			{/* <Header /> */}
			<main>
				{isAuthenticated ? (
					<Routes>
						<Route path="/" element={<Dashboard />} />
					</Routes>
				) : (
						<Login />
				)}
			</main>
		</Router>
	);
};

// Render the AdminApp into the admin-root div
const container = document.getElementById('admin-root');
const root = createRoot(container);
root.render(<AdminApp />);