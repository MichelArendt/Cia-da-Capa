import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import apiPublic from '/src/services/api/public';
import useStore from '/src/store';

// Yup schema with validation and sanitization
const loginSchema = Yup.object().shape({
  name: Yup.string().trim().required('Usuário é obrigatório'),
  password: Yup.string().min(5, 'Senha muito curta').required('Senha é obrigatória'),
});


const Login = () => {
  const navigate = useNavigate();
  const setAuthenticated = useStore((state) => state.setAuthenticated);
  const lastAttemptedRoute = useStore((state) => state.lastAttemptedRoute);
  const clearLastAttemptedRoute = useStore((state) => state.clearLastAttemptedRoute);
  // const [name, setName] = useState('');
  // const [password, setPassword] = useState('');
  // const [errorVisibility, setErrorVisibility] = useState(false);
  // const setAuthenticated = useStore((state) => state.setAuthenticated);
  // const navigate = useNavigate();

  const handleLogin = async ({ name, password }, { setSubmitting, setFieldError }) => {
    try {
      await apiPublic.fetchCsrfToken();  // Moved CSRF fetch to apiPublic for reuse
      const response = await apiPublic.login({ name, password });
      console.log('response.status: ' + response.status)

      if (response.status === 200) {
        setAuthenticated(true);
        clearLastAttemptedRoute();
        navigate(lastAttemptedRoute || '/manage'); // Redirect to last route or default
      }
    } catch (error) {
      setFieldError('general', 'Login falhou. Verifique suas credenciais.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <Formik
        initialValues={{ name: '', password: '' }}
        validationSchema={loginSchema}
        onSubmit={handleLogin}
      >
        {({ isSubmitting, errors }) => (
          <Form>
            <div>
              <label htmlFor="name">Usuário:</label>
              <Field type="text" name="name" id="name" autoComplete="username" />
              <ErrorMessage name="name" component="div" />
            </div>

            <div>
              <label htmlFor="password">Senha:</label>
              <Field type="password" name="password" id="password"  />
              <ErrorMessage name="password" component="div" />
            </div>

            {errors.general && <div className="error-message">{errors.general}</div>}

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Entrando...' : 'Login'}
            </button>
          </Form>
        )}
      </Formik>




      {/* <form action={handleLogin}>
        <input type="text" onChange={(e) => setName(e.target.value)} placeholder="Usuário" minLength={8} />
        <input type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Senha" />
        <button type='submit'>Login</button>
        <div style={{display: errorVisibility ? 'block' : 'none'}}>Login inválido</div>
      </form> */}
    </div>
  );
};

export default Login;
