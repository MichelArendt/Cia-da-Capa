import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

// Auth
import apiPublic from '/src/services/api/public';
import useStore from '/src/store';

// Shared components
import ContentLoader from '/src/components/shared/ContentLoader'

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
      await apiPublic.fetchCsrfToken(); // Fetch CSRF token
      const response = await apiPublic.login({ name, password });

    // Check if login was successful
      if (response.status === 200 && response.data.authenticated) {
        setAuthenticated(true);
        clearLastAttemptedRoute();
        navigate(lastAttemptedRoute || '/manage'); // Redirect to last route or default
      } else {
        // Trigger the general error if response status is not 200 or not authenticated
        setFieldError('general', 'Login inválido!');
      }
    } catch (error) {
      // Handle network or unexpected errors
      setFieldError('general', 'Ocorreu um erro. Tente novamente mais tarde.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
      <Formik
        initialValues={{ name: '', password: '' }}
        validationSchema={loginSchema}
        onSubmit={handleLogin}
      >
        {({ isSubmitting, errors }) => (
          isSubmitting ? (
            <ContentLoader /> // Display the loader when submitting
          ) : (
            <Form>
              <div className="wrapper">
                <div>
                  <label htmlFor="name" className="sr-only">Usuário:</label>
                  <Field type="text" name="name" id="name" autoComplete="username" placeholder='Usuário' />
                  <ErrorMessage name="name" component="div" className='error-field' />
                </div>

                <div>
                  <label htmlFor="password" className="sr-only">Senha:</label>
                  <Field type="password" name="password" id="password" placeholder='Senha' />
                  <ErrorMessage name="password" component="div" className='error-field' />
                </div>


                {errors.general && <div className="error-message">{errors.general}</div>}

                <div>
                  <button type="submit" disabled={isSubmitting}>
                    <span>Login</span>
                  </button>
                </div>
              </div>
            </Form>
          )
        )}
      </Formik>
  );
};

export default Login;
