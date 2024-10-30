import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ReactDOM from 'react-dom';

import Svg from './components/Svg';

import Header from './components/shared/Header';
import Footer from './components/Footer';
import Home from './pages/Home';

import './styles/main.scss';
import Navigation from './components/shared/Navigation';
import Dropdown from './components/shared/Dropdown';

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
          <Header>
            <Navigation>
              <div className=''>
                <Svg type="home" sizes={[20, 20]} /> <Link to="/">PÁGINA INICIAL</Link>
              </div>
              <div className=''>
                <Dropdown title='PRODUTOS'>
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
                {/* <Svg type="arrow_drop_down" sizes={[20, 20]} /> PRODUTOS
                <ul className='nav__dropdown'>
                  <li>Bolsas</li>
                  <li>Bolsas Maternidade</li>
                  <li>Bolsas Ecológicas</li>
                  <li>Bolsas Térmicas</li>
                  <li>Bolsas Viagem</li>
                  <li>Estojos</li>
                  <li>Necessaires</li>
                  <li>Malotes</li>
                  <li>Mochilas</li>
                  <li>Mochilas Saco</li>
                  <li>Pastas</li>
                  <li>Shoulder Bags</li>
                </ul> */}
              </div>
              <div className=''>
                <Svg type="email" sizes={[20, 20]} className='' /> <Link to="/contato">CONTATO</Link>
              </div>
              <div className=''>
                <Svg type="search" sizes={[20, 20]} className='' /> <span className=''>PESQUISA</span>
              </div>
              <div className=''>
                <Svg type="local_atm" sizes={[20, 20]} className='' /> <span className='mobile__text'>ORÇAMENTO</span>
              </div>
            </Navigation>
          </Header>
          {/* <nav>
          </nav> */}
          <main>
            <Routes>
                <Route path="/" element={<Home />} />
            </Routes>
          </main>
          <Footer />
        </Router>
    );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);