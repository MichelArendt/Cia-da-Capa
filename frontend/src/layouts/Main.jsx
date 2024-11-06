import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';

// Shared components
import Header from '/src/components/shared/Header';
import Svg from '/src/components/shared/Svg';
import { Dropdown, DropdownHeader, DropdownSubmenu, DropdownOption } from '/src/components/shared/Dropdown';

// Main website components
import Home from '/src/pages/Home';
import ContentLoader from '../components/shared/ContentLoader';

// APIs
import * as apiPublic from '/src/services/api/public';

function Main() {
  const [categories, setCategories] = useState([]);

 // First render
  // useEffect(() => {
  //   const loadCategories = async () => {
  //     const data = await apiPublic.fetchProductCategories();
  //     if (data) {
  //       setCategories(data);
  //     }
  //   };

  //   loadCategories();
  // }, []);

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
                <DropdownHeader><span>Produtos</span></DropdownHeader>
                <DropdownSubmenu>
                  <ContentLoader fetchData={apiPublic.test()}>
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