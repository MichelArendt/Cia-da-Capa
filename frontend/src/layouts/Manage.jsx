import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, Navigate  } from 'react-router-dom';

// Stores
import useStore from '/src/store';

// APIs
import {apiPublic, apiManage} from '/src/services/api';

// Assets
import logo from '/assets/logo_manage.png';

// Shared components
import Header from '/src/components/shared/Header';
import Svg from '/src/components/shared/Svg';
import { Dropdown, DropdownHeader, DropdownSubmenu } from '/src/components/shared/Dropdown';
import ContentLoader from '/src/components/shared/ContentLoader'
import Option from '../components/shared/header/navigation/Option';

// /manage components
import Login from '/src/pages/manage/Login';
import Dashboard from '/src/pages/manage/Dashboard';
import ProtectedRoutes from '../components/shared/ProtectedRoutes';
import Categories from '../pages/manage/Categories';

function Manage() {
  const navigate = useNavigate();

  // Auth state
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const setAuthenticated = useStore((state) => state.setAuthenticated);
  const [loading, setLoading] = useState(true);

  // Check authentication status on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await apiPublic.user.getAuthDetails();
        setAuthenticated(response.data.authenticated);
      } catch (error) {
        // If there's an error, assume not authenticated
        setAuthenticated(false);
      } finally {
        setLoading(false); // Set loading to false when check is complete
      }
    };
    checkAuth();
  }, [setAuthenticated]);

  const handleLogout = async () => {
    try {
      await apiManage.user.logout();
      setAuthenticated(false);
      navigate('/manage/user/login'); // Redirect to login after logout
    } catch (error) {
      console.error('Logout failed', error);
      // Optionally handle error (e.g., show a notification)
    }
  };

  return (
    <>
      <Header>
        <Dropdown>
          <DropdownHeader sizes={[12,12]}><span>Produtos</span></DropdownHeader>
          <DropdownSubmenu>
            <ContentLoader fetchData={apiPublic.fetchProductCategories}>
            {/* <ContentLoader fetchData={apiPublic.fetchProductCategories()}> */}
              {(categories) => (
                console.log(categories)
              )}
            </ContentLoader>
          </DropdownSubmenu>
        </Dropdown>

        <Link to="produtos/categorias">
          <Svg type="home" sizes={[16,16]} className='' />
          <span>Categorias</span>
        </Link>

        <Link to="banners">
          <Svg type="home" sizes={[16,16]} className='' />
          <span>Banners</span>
        </Link>

        <Dropdown>
          <DropdownHeader>
            <Svg type='search' sizes={[30,30]} />
          </DropdownHeader>
          <DropdownSubmenu>
            <button>
              SEARCH
            </button>
          </DropdownSubmenu>
        </Dropdown>

        <button onClick={handleLogout}>
          <Svg type="logout" sizes={[30,30]} />
        </button>
      </Header>

      { false == true ? (
        <Header
        isManageRoute={true}
        logo={logo}
        navOptions={
          <>
            {/* Navigation options */}
            <li>
              <Dropdown>
                <DropdownHeader sizes={[12,12]}><span>Produtos</span></DropdownHeader>
                <DropdownSubmenu>
                  <ContentLoader fetchData={apiPublic.fetchProductCategories}>
                  {/* <ContentLoader fetchData={apiPublic.fetchProductCategories()}> */}
                    {(categories) => (
                      console.log(categories)
                    )}
                  </ContentLoader>
                </DropdownSubmenu>
              </Dropdown>
            </li>

            {/* <li>
              <Link to="produtos/categorias">
                <Svg type="home" sizes={[16,16]} className='display__hide_on-desktop' />
                <span>Categorias</span>
              </Link>
            </li> */}

            <Option>
              <Link to="produtos/categorias">
                <Svg type="home" sizes={[16,16]} className='display__hide_on-desktop' />
                <span>Categorias</span>
              </Link>
            </Option>

            <li>
              <Link to="banners">
                <Svg type="home" sizes={[16,16]} className='display__hide_on-desktop' />
                <span>Banners</span>
              </Link>
            </li>
          </>
        }
        navButtons={
          <>
            {/* Navigation buttons */}
            <Option>
              <Dropdown>
                <DropdownHeader>
                  <Svg type='search' sizes={[30,30]} />
                </DropdownHeader>
                <DropdownSubmenu>
                  <button>
                    <Svg type="search" sizes={[30,30]} />
                  </button>
                </DropdownSubmenu>
              </Dropdown>
            </Option>

            <button onClick={handleLogout}>
              <Svg type="logout" sizes={[30,30]} />
            </button>
          </>
        }
        >
        </Header>

      ) : ('')}
      <main className='section--full-width flex flex--row flex--row--center-horizontal'>
        <div className="website--max-width">
          {loading ? (
            // Display a loading component while checking authentication
            <ContentLoader />
          ) : (
            // Render routes once loading is complete
            <Routes>
              {/* Public route: Login */}
              <Route path="/user/login" element={<Login />} />

              {/* Protected routes */}
              <Route
                path="/*"
                element={
                  <ProtectedRoutes>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="produtos/categorias" element={<Categories />} />
                      {/* Add more protected routes here */}
                      {/* Catch-all route for unmatched paths */}
                      <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                  </ProtectedRoutes>
                }
              />
            </Routes>
          )}
        </div>
      </main>
    </>
  );
}

export default Manage;