import React, { useEffect, useState, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, Link, useLocation  } from 'react-router-dom';
import ReactDOM from 'react-dom';

import useMenuStore from '/src/store/menuStore';

import Svg from './components/shared/Svg';
import logo from '/assets/logo.png';

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';

import './styles/main.scss';
import Contato from './pages/Contato';
import Produtos from './pages/Produtos';

const RouteChangeListener = () => {
  const location = useLocation();
  const { toggleMenu, closeMenu } = useMenuStore();
  const prevLocation = useRef(location.pathname);

  useEffect(() => {
    // Only close menu if the new path is different
    if (location.pathname !== prevLocation.current) {
      closeMenu();
      prevLocation.current = location.pathname;
    }
  }, [location]);

  // useEffect(() => {
  //   toggleMenu();
  // }, []);

  return null;
};

const App = () => {
  // const [data, setData] = useState(null);
  // const [counter, setCounter] = useState(0);

  // useEffect(() => {
  //     // Fetch data from the PHP API
  //     fetch('/api/users')
  //         .then(response => {
  //             if (!response.ok) {
  //                 throw new Error(`HTTP error! Status: ${response.status}`);
  //             }
  //             return response.json();
  //         })
  //         .then(data => {
  //             console.log(data);  // Log the data
  //             setData(data.message);  // Update the data state
  //         })
  //         .catch(error => console.error('Error:', error));
  // }, []);

// Function to get the base URL dynamically

// Get the base URL dynamically from the window location
  const basename = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'));


  return (
      <Router basename={basename}>
        <RouteChangeListener />
        <Header />
        {/* <Header logo={logo}>
          <Navigation>
            <Link to="/">
              <Option>
                <Svg type="home" /> <span>Página Inicial</span>
              </Option>
            </Link>

            <Option>
              <Dropdown title='Produtos'>
                <Link to='/produtos'>Bolsas</Link>
                <Link to='/produtos'>Bolsas Maternidade</Link>
                <Link to='/produtos'>Bolsas Ecológicas</Link>
                <Link to='/produtos'>Bolsas Térmicas</Link>
                <Link to='/produtos'>Bolsas Viagem</Link>
                <Link to='/produtos'>Estojos</Link>
                <Link to='/produtos'>Necessaires</Link>
                <Link to='/produtos'>Malotes</Link>
                <Link to='/produtos'>Mochilas</Link>
                <Link to='/produtos'>Mochilas Saco</Link>
                <Link to='/produtos'>Pastas</Link>
                <Link to='/produtos'>Shoulder Bags</Link>
              </Dropdown>
            </Option>

            <Link to="/contato">
              <Option>
                <Svg type="email" /> <span>Contato</span>
              </Option>
            </Link>

            <Option>
              <Svg type="search" /> <span>Pesquisa</span>
            </Option>

            <Option>
              <Svg type="local_atm" /> <span>Orçamento</span>
            </Option>
          </Navigation>
        </Header> */}

        <main>
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/contato" element={<Contato />} />
              <Route path="/produtos" element={<Produtos />} />
          </Routes>
        </main>
        <Footer />
      </Router>
  );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);