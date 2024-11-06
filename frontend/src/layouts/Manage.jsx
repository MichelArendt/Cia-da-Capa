import React, { useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';

// Authorization
import api from '/src/services/api'; // Adjust the path if needed
import useStore from '/src/store';

// Assets
import logo from '/assets/logo_manage.png';

// Shared components
import Header from '/src/components/shared/Header';
import Svg from '/src/components/shared/Svg';
import { Dropdown, DropdownHeader, DropdownSubmenu, DropdownOption } from '/src/components/shared/Dropdown';

// /manage components
import Login from '/src/pages/admin/Login';
import Dashboard from '/src/pages/admin/Dashboard';

function Manage() {
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
    <>
      <Header admin={true} logo={logo}
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

            <button>
              <Svg type="logout" sizes={[30,30]} />
            </button>
          </>
        }
      >
      </Header>
      <main>
        {isAuthenticated ? (
          <Routes>
            <Route path="/" element={<Dashboard />} />
          </Routes>
        ) : (
            <Login />
        )}
        {/* <Routes>
          <Route path="/" element={<Home />} />
        </Routes> */}
      </main>
    </>
  );
}

export default Manage;