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

    return (
        <Router basename={basename}>
          <Header>
            PRODUTOS CONTATO
            <Svg type="search" />
            <Svg type="local_atm" />
          </Header>
          <nav>
            <Link to="/">Home</Link>
          </nav>
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