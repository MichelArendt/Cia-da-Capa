import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';

// Hooks
import useStore from '/src/store';
// import useIsWebsiteMobile from '/src/hooks/useIsWebsiteMobile'; // Custom hook to detect mobile devices

// Shared components
import Header from '/src/components/shared/Header';
import Svg from '/src/components/shared/Svg';
import Dropdown from '/src/components/shared/smart_content/Dropdown';
import List from '/src/components/shared/smart_content/List';
import Slider from '/src/components/shared/smart_content/Slider';
import ContentLoader from '/src/components/shared/ContentLoader';

// Main website components
import Home from '/src/pages/Home';

// APIs
import {apiPublic} from '../services/api/_axiosInstance';
import Contact from '../pages/Contact';

function Main() {
  const [categories, setCategories] = useState([]);
  const isMobile = useStore((state) => state.isMobile);

  return (
    <>
      <Header
        navResponsiveMenuOptions={
          <>
            <div>
              <Link to='/'>
                Página inicial
              </Link>
            </div>
            {isMobile ?
              <List>
                <span>Produtos</span>
                {/* <ContentLoader fetchData={apiPublic.products.listCategories}>
                    {(categories) => (
                      console.log(categories)
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
              <Link to='/contato'>
                Contato
              </Link>
            </div>
						{/* </Dropdown> */}
            {/* <Link to="/">
              <Svg type="home" sizes={[16,16]} />
              <span>Página Inicial</span>
            </Link>

            <SmartContent contentType={SmartContentType.List}>
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

            <Link to="/">
              <Svg type="email" sizes={[16,16]} className='display__hide_on-desktop' />
              <span>Contato</span>
            </Link> */}
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
            <Slider
              headerClassName='nav__button'
              mobileContentTitle='Carrinho de orçamento'
            >
              <Svg type="remove_shopping_cart" sizes={[35,35]} />
              <span>lista</span>
            </Slider>
					  {/* <SmartContent contentType={SmartContentType.Dropdown}>
              <SmartContentHeader
                hideArrow={true}
                className='smart-content__header--nav smart-content__header--button'
              >
                <Svg type="search" sizes={[30,30]} />
              </SmartContentHeader>
              <SmartContentBody title='pesquisa'>
                <input type='text' />
              </SmartContentBody>
            </SmartContent>

            <SmartContent
              contentType={SmartContentType.Slider}
              slideDirection="right"
              className='smart-content__header--nav smart-content__header--button'
            >
              <SmartContentHeader className='smart-content__header--nav smart-content__header--button'>
                <Svg type="remove_shopping_cart" sizes={[30,30]} />
              </SmartContentHeader>
              <SmartContentBody title='Carrinho de orçamento'>
                1x pasta
              </SmartContentBody>
            </SmartContent> */}


            {/* <button>
              <Svg type="remove_shopping_cart" sizes={[30,30]} />
            </button> */}
          </>
        }
      />
      <main className='website__main'>
        <div className='website__main-wrapper'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </div>
      </main>
    </>
  );

  return (
    <>
      <Header
        navOptions={
          <>
            <li>
              <Link to="/">
                <Svg type="home" sizes={[16,16]} className='display__hide_on-desktop' />
                <span>Página Inicial</span>
              </Link>
            </li>
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
                  {/* <DropdownOption><Link>Bolsas</Link></DropdownOption>
                  <DropdownOption><Link>Bolsas Maternidade</Link></DropdownOption>
                  <DropdownOption><Link>Bolsas Ecológicas</Link></DropdownOption>
                  <DropdownOption><Link>Bolsas Térmicas</Link></DropdownOption>
                  <DropdownOption><Link>Bolsas Viagem</Link></DropdownOption>
                  <DropdownOption><Link>Estojos</Link></DropdownOption>
                  <DropdownOption><Link>Necessaires</Link></DropdownOption>
                  <DropdownOption><Link>Malotes</Link></DropdownOption>
                  <DropdownOption><Link>Mochilas</Link></DropdownOption>
                  <DropdownOption><Link>Mochilas Saco</Link></DropdownOption>
                  <DropdownOption><Link>Shoulder Bags</Link></DropdownOption> */}
                </DropdownSubmenu>
              </Dropdown>
            </li>
            <li>
              <Link to="/">
                <Svg type="email" sizes={[16,16]} className='display__hide_on-desktop' />
                <span>Contato</span>
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
            <Svg type="remove_shopping_cart" sizes={[30,30]} />
          </button>
          </>
        }
      >
      </Header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </main>
    </>
  );
}

export default Main;