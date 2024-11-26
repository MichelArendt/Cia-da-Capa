import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';

// Stores
import useStore from '/src/store';
import useAuthStore from '/src/store/authStore';
import useCategoryStore from '/src/store/useCategoryStore';

// Shared components
import Header from '/src/components/shared/Header';
import Svg from '/src/components/shared/Svg';
import Dropdown from '/src/components/shared/smart_content/Dropdown';
import List from '/src/components/shared/smart_content/List';
import Slider from '/src/components/shared/smart_content/Slider';

// Main website components
import Home from '/src/pages/Home';

// APIs
import Contact from '/src/pages/Contact';

// Debug
import useRenderCount from '/src/hooks/debug/useRenderCount';

function Main() {
  // const categories = useState([])
  useRenderCount(Main);

  const isMobile = useStore((state) => state.isMobile);
  const navigate = useNavigate();

  // Auth
  const { isAuthenticated } = useAuthStore();

  // useEffect(() => {
  //   console.log('MAIN isAuthenticated:', isAuthenticated)
  // }, [isAuthenticated]);

  console.log(1)

  // Product categories
  const categories = useCategoryStore((state) => state.categories);
  // const categoriesStore = useCategoryStore((state) => state.categories);

  console.log(2)
  // useEffect(() => {
  //   console.log(3)
  // }, []);

  // useEffect(async () => {
  //   console.log(categoriesStore.categories)
  //   categories = categoriesStore.categories;
  // }, [categoriesStore]);

  // useCategoryStore.subscribe((state) => {
  //   console.log('Categories updated:', state.categories);
  // });

  const renderCategories = () => {
    return (
      categories?.map((category) => {
        return <li key={category.id}>{category.name}</li>
      }
    )
  )}

  return (
    <>
      <Header
        navResponsiveMenuOptions={
          <>
            <div>
              <Link to='/' className='nav__button nav--interactive'>
                Página inicial
              </Link>
            </div>
            {isMobile ?
              <List>
                <button className='nav__button nav--interactive' onClick={() => navigate('/produtos/')}>Produtos</button>
                {renderCategories()}
              </List>
              :
              <Dropdown className='nav--interactive' headerClassName='nav__button nav--interactive' buttonClickHandler={() => navigate('/produtos/')}>
                <span>Produtos</span>
                {renderCategories()}
              </Dropdown>
            }
            <div>
              <Link to='/contato' className='nav__button nav--interactive'>
                Contato
              </Link>
            </div>
          </>
        }

        navPermanentButtons={
          <>
            <Dropdown
              className='nav--interactive'
              headerClassName='nav__button nav--interactive'
              hideArrow={true}
              mobileContentTitle='Digite seu termo de busca:'
            >
              <Svg type="search" sizes={[30,30]} />
              <input type='text' />
            </Dropdown>
            <Slider
              headerClassName='nav__button nav--interactive'
              mobileContentTitle='Carrinho de orçamento'
            >
              <Svg type="remove_shopping_cart" sizes={[35,35]} />
              <span>lista</span>
            </Slider>
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
}

export default Main;