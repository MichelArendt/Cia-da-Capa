import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, Navigate  } from 'react-router-dom';

// Stores
import useStore from '/src/store';

// APIs
import apiPublic from '/src/services/api/public';
import apiManage from '/src/services/api/manage';

// Assets
import logo from '/assets/logo_manage.png';

// Shared components
import Header from '/src/components/shared/Header';
import Svg from '/src/components/shared/Svg';
import { Dropdown, DropdownHeader, DropdownSubmenu, DropdownOption } from '/src/components/shared/Dropdown';
import ContentLoader from '/src/components/shared/ContentLoader'

// /manage components
import Login from '/src/pages/manage/Login';
import Dashboard from '/src/pages/manage/Dashboard';
import ProtectedRoutes from '../components/shared/ProtectedRoutes';

function Manage() {
  const navigate = useNavigate();

  // Auth
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const setAuthenticated = useStore((state) => state.setAuthenticated);
  const [loading, setLoading] = useState(true);

  // Check authentication status on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await apiPublic.checkAuthStatus();
        setAuthenticated(response.data.authenticated);
      } catch (error) {
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
    }
  };

  // //
  // if (loading) {
  //   return <ContentLoader />; // Display a loading message or spinner
  // }

  return (
    <>
      <Header isManageRoute={true} logo={logo}
        navOptions={
          <>
            <li>
              <Dropdown>
                <DropdownHeader><span>Produtos</span></DropdownHeader>
                <DropdownSubmenu>
                  <DropdownOption><Link>Bolsas</Link></DropdownOption>
                  <DropdownOption><Link>Bolsas Maternidade</Link></DropdownOption>
                  <DropdownOption><Link>Bolsas Ecológicas</Link></DropdownOption>
                  <DropdownOption><Link>Bolsas Térmicas</Link></DropdownOption>
                  <DropdownOption><Link>Bolsas Viagem</Link></DropdownOption>
                  <DropdownOption><Link>Estojos</Link></DropdownOption>
                  <DropdownOption><Link>Necessaires</Link></DropdownOption>
                  <DropdownOption><Link>Malotes</Link></DropdownOption>
                  <DropdownOption><Link>Mochilas</Link></DropdownOption>
                  <DropdownOption><Link>Mochilas Saco</Link></DropdownOption>
                  <DropdownOption><Link>Shoulder Bags</Link></DropdownOption>
                </DropdownSubmenu>
              </Dropdown>
            </li>
            <li>
              <Link to="/cagegorias">
                <Svg type="home" sizes={[16,16]} className='display__hide_on-desktop' />
                <span>Categorias</span>
              </Link>
            </li>
            <li>
              <Link to="/banners">
                <Svg type="home" sizes={[16,16]} className='display__hide_on-desktop' />
                <span>Banners</span>
              </Link>
            </li>
          </>
        }
        navButtons={
          <>
            <button>
              <Svg type="search" sizes={[30,30]} />
            </button>

            <button onClick={handleLogout}>
              <Svg type="logout" sizes={[30,30]} />
            </button>
          </>
        }
      >
      </Header>
      <main>

        {loading ? (
          <ContentLoader />
        ) : isAuthenticated ? (
          <ProtectedRoutes>
            <Routes>
              <Route path="/user/login" element={<Login />} />
              <Route path="/" element={<Dashboard />} />
              {/* Add more protected routes here */}
            </Routes>
          </ProtectedRoutes>
        ) : (
          <Routes>
            <Route path="/user/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/manage/user/login" />} />
          </Routes>






          // <Routes>
          //   <Route path="/user/login" element={<Login />} />
          //   <Route
          //     path="/*"
          //     element={
          //       <ProtectedRoutes>
          //         <Routes>
          //           <Route path="/" element={<Dashboard />} />
          //           {/* Add more protected routes here */}
          //         </Routes>
          //       </ProtectedRoutes>
          //     }
          //   />
          // </Routes>
        )}
      </main>
    </>
  );
}

export default Manage;