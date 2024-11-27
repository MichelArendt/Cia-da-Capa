import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, Navigate, useLocation  } from 'react-router-dom';

// Debug
import useRenderCount from '/src/hooks/debug/useRenderCount';
import useWhyDidYouRender from '../hooks/debug/useWhyDidYouRender';

// Auth
import useAuthManager from '/src/hooks/authentication/useAuthManager';
import useAuthStore from '/src/store/authStore';

// Assets
import logo from '/assets/logo_manage.png';

// Stores
import useStore from '/src/store';

// Shared components
import Header from '/src/components/shared/Header';
import Svg from '/src/components/shared/Svg';
import Dropdown from '/src/components/shared/smart_content/Dropdown';
import List from '/src/components/shared/smart_content/List';
import ContentLoader, { ContentLoaderStatus } from '/src/components/shared/ContentLoader.jsx'

// /manage components
import Login from '/src/pages/manage/Login';
import Dashboard from '/src/pages/manage/Dashboard';
import ProtectedRoutes from '/src/components/shared/ProtectedRoutes';
import Categories from '/src/pages/manage/Categories';

function Manage() {
  console.log('-----------------------------')
  useRenderCount(Manage);
  // useWhyDidYouRender(Manage);
  const navigate = useNavigate();

  const isMobile = useStore((state) => state.isMobile);

  // Auth
  const { isCheckingAuth } = useAuthStore((state) => state.isCheckingAuth);
  const { handleLogout } = useAuthManager();
  // useAuthManager();
  // const isAuthenticated = useStore((state) => state.isAuthenticated);
  // const setAuthenticated = useStore((state) => state.setAuthenticated);
  // const [isCheckingAuth, setIscheckingAuth] = useState(true);
  // const { isPending, isFetching, isError, isSuccess, data, error } = useAuthDetails();
  // const { handleAuthSuccess } = useAuthHandler();
  // const { mutate: logout } = useLogout(); // Extract the mutate function from the hook
  const [ contentLoaderMessage, setContentLoaderMessage ] = useState('Carregando');
  const location = useLocation(); // Get current location

  // Check authentication status on app load
  // useEffect(() => {
  //   // setAuthenticated(false);

  //   if (isPending || isFetching) {
  //     setIscheckingAuth(true);
  //   } else if (isError) {
  //     console.error('Checking auth failed: ', error);
  //     setIscheckingAuth(false);
  //    } else {
  //     handleAuthSuccess(data.authenticated);
  //     setIscheckingAuth(false);
  //   }

  // }, [isPending, isError, isSuccess]);

  // useEffect(() => {
  //   if (!isAuthenticated && !isCheckingAuth) {

  //     // Only navigate if not already on the target page
  //     if (location.pathname !== '/manage/user/login') {
  //       navigate('/manage/user/login');
  //     }
  //   }
  // }, [isAuthenticated, isCheckingAuth, navigate, location.pathname]);

  const logoutUser = async () => {
    try {
      const result = await handleLogout();
      if (result.success) {
        navigate('/manage/user/login'); // Redirect to the login page after logout
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Erro inesperado durante logout: ', error);
    }
  };

  return (
    <>
      <Header
        isManageRoute={true}
        logo={logo}
        // navResponsiveMenuTitle="Cia da Capa - Gerenciamento"
        navResponsiveMenuOptions={
          <>
            {isMobile ?
              <List>
                <span>Produtos</span>
                {/* <ContentLoader hook={useProductCategories} fallbackContent='Categorias indisponíveis'>
                  {(categories) => (
                    categories.length !== 0 ?
                    <ul>
                      {categories.map((category) => (
                        <li key={category.id}>{category.name}</li>
                      ))}
                    </ul>
                    : 'Não há categorias disponíveis!'
                  )}
                </ContentLoader> */}
              </List>
              :
              <Dropdown>
                <div>Produtos</div>
                {/* <ContentLoader fetchData={apiPublic.products.listCategories}>
                    {(categories) => (
                      console.log(categories)
                    )}
                </ContentLoader> */}
              </Dropdown>
            }
            <div>
              <Link to='./produtos/categorias'>
                Categorias
              </Link>
            </div>
            <div>
              <Link to='./banners'>
                Banners
              </Link>
            </div>
          </>
        }
        navPermanentButtons={
          <>
            <Dropdown
              headerClassName='nav__button'
              hideArrow={true}
              mobileContentTitle='Digite seu termo de busca:'
            >
              <Svg type="search" sizes={[30,30]} />
              <input type='text' />
            </Dropdown>

            <button onClick={logoutUser} className='nav__button'>
              <Svg type="logout" sizes={[30,30]} />
            </button>
          </>
        }
      />
      <main className='website__main'>
        <div className="website--max-width">
          {
          isCheckingAuth ? (
            // Display a loading component while checking authentication
            <ContentLoader
              displayMessage="Verificando autenticação"
              // status = { ContentLoaderStatus.LOADING }
              fallbackContent={<span>Não autenticado. Redirecionando!</span>}
            />
          ) :
          (
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