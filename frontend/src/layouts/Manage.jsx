import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, Navigate  } from 'react-router-dom';

// APIs
import { useAuthDetails } from '/src/services/api/usePublicApi';
import { useLogout } from '/src/services/api/useManageApi';
import { useProductCategories } from '/src/services/api/usePublicApi'

// Auth
import { useAuthHandler } from '/src/hooks/useAuthHandler';

// Assets
import logo from '/assets/logo_manage.png';

// Hooks
import useStore from '/src/store';

// Shared components
import Header from '/src/components/shared/Header';
import Svg from '/src/components/shared/Svg';
import Dropdown from '/src/components/shared/smart_content/Dropdown';
import List from '/src/components/shared/smart_content/List';
import Slider from '/src/components/shared/smart_content/Slider';
import ContentLoader, { ContentLoaderStatus } from '/src/components/shared/ContentLoader.jsx'

// /manage components
import Login from '/src/pages/manage/Login';
import Dashboard from '/src/pages/manage/Dashboard';
import ProtectedRoutes from '../components/shared/ProtectedRoutes';
import Categories from '../pages/manage/Categories';

function Manage() {
  const navigate = useNavigate();

  const isMobile = useStore((state) => state.isMobile);

  // Auth
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const setAuthenticated = useStore((state) => state.setAuthenticated);
  const [isCheckingAuth, setIscheckingAuth] = useState(true);
  const { isPending, isFetching, isError, isSuccess, data, error } = useAuthDetails();
  const { handleAuthSuccess } = useAuthHandler();
  const { mutate: logout } = useLogout(); // Extract the mutate function from the hook
  const [ contentLoaderMessage, setContentLoaderMessage ] = useState('Carregando');

  // Check authentication status on app load
  useEffect(() => {
    setAuthenticated(false);

    if (isPending || isFetching) {
      setIscheckingAuth(true);
    } else if (isError) {
      console.error('Checking auth failed: ', error);
      setIscheckingAuth(false);
     } else {
      handleAuthSuccess(data.authenticated);
      setIscheckingAuth(false);
    }

  }, [isPending, isError, isSuccess]);

  useEffect(() => {
    if (!isAuthenticated && !isCheckingAuth) {
      navigate('/manage/user/login'); // Redirect to login after logout
    }
  }, [isAuthenticated, isCheckingAuth, navigate]);

  const handleLogout = async () => {
    try {
      logout(null, {
        onSuccess: () => {
          setAuthenticated(false); // Update state after successful logout
        },
        onError: (error) => {
          console.error('Logout falhou: ', error);
          // Optionally handle the error (e.g., show a notification)
        },
      });
    } catch (error) {
      console.error('Erro inesperado durante logout: ', error);
    }

    // try {
    //   useLogout();
    // } catch (error) {
    //   console.error('Logout failed: ', error);
    //   // Optionally handle error (e.g., show a notification)
    // }
    // setAuthenticated(false);
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
                <ContentLoader hook={useProductCategories} fallbackContent='Categorias indisponíveis'>
                  {(categories) => (
                    categories.length !== 0 ?
                    <ul>
                      {categories.map((category) => (
                        <li key={category.id}>{category.name}</li>
                      ))}
                    </ul>
                    : 'Não há categorias disponíveis!'
                  )}
                </ContentLoader>
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
            {/* <SmartContent contentType={SmartContentType.List}>
              <SmartContentHeader>
                <Link to="/">
                  <Svg type="home" sizes={[16,16]} />
                  <span>Produtos</span>
                </Link>
              </SmartContentHeader>
              <SmartContentBody>
                <ContentLoader fetchData={apiPublic.products.listCategories}>
                    {(categories) => (
                      console.log(categories)
                    )}
                  </ContentLoader>
              </SmartContentBody>
            </SmartContent>

            <Link to="produtos/categorias">
              <Svg type="home" sizes={[16,16]} className='' />
              <span>Categorias</span>
            </Link>

            <Link to="banners">
              <Svg type="home" sizes={[16,16]} className='' />
              <span>Banners</span>
            </Link> */}
          </>
        }
        navPermanentButtons={
          <>
            {/* <SmartContent contentType={SmartContentType.Dropdown}>
              <SmartContentHeader>
                <Svg type="search" sizes={[30,30]} />
              </SmartContentHeader>
              <SmartContentBody title='pesquisa'>
                <input type='text' />
              </SmartContentBody>
            </SmartContent> */}
            <Dropdown
              headerClassName='nav__button'
              hideArrow={true}
              mobileContentTitle='Digite seu termo de busca:'
            >
              <Svg type="search" sizes={[30,30]} />
              <input type='text' />
            </Dropdown>

            <button onClick={handleLogout} className='nav__button'>
              <Svg type="logout" sizes={[30,30]} />
            </button>
          </>
        }
      />
      <main className='website__main'>
        <div className="website--max-width">
          {isCheckingAuth ? (
            // Display a loading component while checking authentication
            <ContentLoader
              displayMessage="Verificando autenticação"
              // status = { ContentLoaderStatus.LOADING }
              fallbackContent={<span>Não autenticado. Redirecionando!</span>}
            />
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

  // return (
  //   <>
  //     <Header>
  //       <Dropdown>
  //         <DropdownHeader sizes={[12,12]}><span>Produtos</span></DropdownHeader>
  //         <DropdownSubmenu>
  //           <ContentLoader fetchData={apiPublic.fetchProductCategories}>
  //           {/* <ContentLoader fetchData={apiPublic.fetchProductCategories()}> */}
  //             {(categories) => (
  //               console.log(categories)
  //             )}
  //           </ContentLoader>
  //         </DropdownSubmenu>
  //       </Dropdown>

  //       <Link to="produtos/categorias">
  //         <Svg type="home" sizes={[16,16]} className='' />
  //         <span>Categorias</span>
  //       </Link>

  //       <Link to="banners">
  //         <Svg type="home" sizes={[16,16]} className='' />
  //         <span>Banners</span>
  //       </Link>

  //       <Dropdown>
  //         <DropdownHeader>
  //           <Svg type='search' sizes={[30,30]} />
  //         </DropdownHeader>
  //         <DropdownSubmenu>
  //           <button>
  //             SEARCH
  //           </button>
  //         </DropdownSubmenu>
  //       </Dropdown>

  //       <button onClick={handleLogout}>
  //         <Svg type="logout" sizes={[30,30]} />
  //       </button>
  //     </Header>

  //     { false == true ? (
  //       <Header
  //       isManageRoute={true}
  //       logo={logo}
  //       navOptions={
  //         <>
  //           {/* Navigation options */}
  //           <li>
  //             <Dropdown>
  //               <DropdownHeader sizes={[12,12]}><span>Produtos</span></DropdownHeader>
  //               <DropdownSubmenu>
  //                 <ContentLoader fetchData={apiPublic.fetchProductCategories}>
  //                 {/* <ContentLoader fetchData={apiPublic.fetchProductCategories()}> */}
  //                   {(categories) => (
  //                     console.log(categories)
  //                   )}
  //                 </ContentLoader>
  //               </DropdownSubmenu>
  //             </Dropdown>
  //           </li>

  //           {/* <li>
  //             <Link to="produtos/categorias">
  //               <Svg type="home" sizes={[16,16]} className='display__hide_on-desktop' />
  //               <span>Categorias</span>
  //             </Link>
  //           </li> */}

  //           <Option>
  //             <Link to="produtos/categorias">
  //               <Svg type="home" sizes={[16,16]} className='display__hide_on-desktop' />
  //               <span>Categorias</span>
  //             </Link>
  //           </Option>

  //           <li>
  //             <Link to="banners">
  //               <Svg type="home" sizes={[16,16]} className='display__hide_on-desktop' />
  //               <span>Banners</span>
  //             </Link>
  //           </li>
  //         </>
  //       }
  //       navButtons={
  //         <>
  //           {/* Navigation buttons */}
  //           <Option>
  //             <Dropdown>
  //               <DropdownHeader>
  //                 <Svg type='search' sizes={[30,30]} />
  //               </DropdownHeader>
  //               <DropdownSubmenu>
  //                 <button>
  //                   <Svg type="search" sizes={[30,30]} />
  //                 </button>
  //               </DropdownSubmenu>
  //             </Dropdown>
  //           </Option>

  //           <button onClick={handleLogout}>
  //             <Svg type="logout" sizes={[30,30]} />
  //           </button>
  //         </>
  //       }
  //       >
  //       </Header>

  //     ) : ('')}
  //     <main className='section--full-width flex flex--row flex--row--center-horizontal'>
  //       <div className="website--max-width">
  //         {loading ? (
  //           // Display a loading component while checking authentication
  //           <ContentLoader />
  //         ) : (
  //           // Render routes once loading is complete
  //           <Routes>
  //             {/* Public route: Login */}
  //             <Route path="/user/login" element={<Login />} />

  //             {/* Protected routes */}
  //             <Route
  //               path="/*"
  //               element={
  //                 <ProtectedRoutes>
  //                   <Routes>
  //                     <Route path="/" element={<Dashboard />} />
  //                     <Route path="produtos/categorias" element={<Categories />} />
  //                     {/* Add more protected routes here */}
  //                     {/* Catch-all route for unmatched paths */}
  //                     <Route path="*" element={<Navigate to="/" />} />
  //                   </Routes>
  //                 </ProtectedRoutes>
  //               }
  //             />
  //           </Routes>
  //         )}
  //       </div>
  //     </main>
  //   </>
  // );
}

export default Manage;