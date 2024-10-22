import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import api from '../../api';
import useStore from '../../store';

const Login = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [errorVisibility, setErrorVisibility] = useState(false);
  const setAuthenticated = useStore((state) => state.setAuthenticated);
  // const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      console.log(1);

      // Fetch CSRF token
      await api.get('/sanctum/csrf-cookie');

      // Now make the login request
      const response = await api.post('/login', { name, password });
      if (response.status === 200) {
        console.log(2);
        setAuthenticated(true);
        setErrorVisibility(false);
        // navigate('/'); // Redirect to dashboard or desired route
      }
    } catch (error) {
      console.log(3);
      setErrorVisibility(true);
    }
    console.log(4);
  };

  return (
    <div>
      <h2>Login</h2>
      <input type="name" onChange={(e) => setName(e.target.value)} placeholder="Name" />
      <input type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button onClick={handleLogin}>Login</button>
      <div style={{display: errorVisibility ? 'block' : 'none'}}>Login inválido</div>
    </div>
  );
};

export default Login;
