import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ReactDOM from 'react-dom';

import Svg from './components/Svg';

import Header from './components/shared/Header';
import Footer from './components/Footer';
import Home from './pages/Home';

import './styles/main.scss';

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
    const closeNav = () => {
      // setMenuHeight(menuIsOpen ? '0%' : '100%'); // Toggle between 0% and 100%
      // setMenuIsOpen(!menuIsOpen);
      // console.log(menuIsOpen ? 'hidden' : 'block'); // Log for debugging
      document.querySelector("nav").style.height = "0%";
    };

    return (
        <Router basename={basename}>
          <Header>
            {/* Button to close the overlay navigation */}
            <span className="closebtn" onClick={closeNav}>&times;</span>
            <div className='nav__content'>
              <div className='nav__button nav__button-style'>
                <Svg type="arrow_drop_down" sizes={[20, 20]} /> <Link to="/produtos">PRODUTOS</Link>
              </div>
              <div className='nav__button nav__button-style'>
                <Svg type="email" sizes={[20, 20]} className='display__hide_on_breakpoint' /> <Link to="/contato">CONTATO</Link>
              </div>
              <div className='nav__button nav__button-style'>
                <Svg type="search" sizes={[20, 20]} className='nav__button_desktop' /> <span className='mobile__text'>PESQUISA</span>
              </div>
              <div className='nav__button nav__button-style'>
                <Svg type="local_atm" sizes={[20, 20]} className='nav__button_desktop' /> <span className='mobile__text'>ORÇAMENTO</span>
              </div>
            </div>
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