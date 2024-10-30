import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ReactDOM from 'react-dom';

import Svg from './components/shared/Svg';
import logo from '/assets/logo.png';

import Header from './components/shared/Header';
import Footer from './components/Footer';
import Home from './pages/Home';

import './styles/main.scss';
import Navigation from './components/shared/navigation/Navigation';
import Dropdown from './components/shared/Dropdown';
import Option from './components/shared/navigation/Option';
import Contato from './pages/Contato';

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
          <Header logo={logo}>
            <Navigation>
              <Option>
                <Svg type="home" /> <Link to="/">Página Inicial</Link>
              </Option>

              <Option>
                <Dropdown title='Produtos' svg='shopping_bag'>
                  {[
                    'Bolsas',
                    'Bolsas Maternidade',
                    'Bolsas Ecológicas',
                    'Bolsas Térmicas',
                    'Bolsas Viagem',
                    'Estojos',
                    'Necessaires',
                    'Malotes',
                    'Mochilas',
                    'Mochilas Saco',
                    'Pastas',
                    'Shoulder Bags',
                  ]}
                </Dropdown>
              </Option>

              <Option>
                <Svg type="email" /> <Link to="/contato">Contato</Link>
              </Option>

              <Option>
                <Svg type="search" /> <span className=''>Pesquisa</span>
              </Option>

              <Option>
                <Svg type="local_atm" /> <span className='mobile__text'>Orçamento</span>
              </Option>
            </Navigation>
          </Header>

          <main>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/contato" element={<Contato />} />
            </Routes>
          </main>
          <Footer />
        </Router>
    );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);