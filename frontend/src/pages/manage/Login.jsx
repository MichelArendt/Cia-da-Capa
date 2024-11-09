import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

// Auth
import {apiPublic} from '/src/services/api';
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
      const response = await apiPublic.user.login({ name, password });

      // Check if login was successful
      if (response && response.data && response.data.authenticated) {
        setAuthenticated(true);
        clearLastAttemptedRoute();
        navigate(lastAttemptedRoute || '/manage'); // Redirect to last route or default
      } else {
        // Trigger the general error if not authenticated
        setFieldError('general', 'Login inválido!');
      }
    } catch (error) {
      // Handle errors based on status code
      if (error.response) {
        if (error.response.status === 401) {
          // Authentication failed
          setFieldError('general', 'Credenciais inválidas.');
        } else {
          // Other server errors
          setFieldError('general', 'Erro no servidor. Tente novamente mais tarde.');
        }
      } else {
        // Network errors or unexpected errors
        setFieldError('general', 'Erro de rede. Verifique sua conexão.');
      }
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
                  <label htmlFor="name" className="sr-only">
                    Usuário:
                  </label>
                  <Field
                    type="text"
                    name="name"
                    id="name"
                    autoComplete="username"
                    placeholder="Usuário"
                  />
                  <ErrorMessage name="name" component="div" className='error-field' />
                </div>

                <div>
                  <label htmlFor="password" className="sr-only">
                    Senha:
                  </label>
                  <Field
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Senha"
                    autoComplete="current-password"
                  />
                  <ErrorMessage name="password" component="div" className="error-field" />
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
