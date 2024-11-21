import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

// Auth
import useStore from '/src/store';
import { useLogin } from '/src/services/api/usePublicApi';
import { useAuthHandler } from '/src/hooks/useAuthHandler';

// Shared components
import ContentLoader from '/src/components/shared/ContentLoader'
import Feedback from '/src/components/shared/feedback/Feedback';

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

  const { mutate, isLoading, error } = useLogin();
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);
  const { handleAuthSuccess } = useAuthHandler();

  const handleLogin = (values, { setSubmitting, setFieldError, setStatus }) => {
    setIsCheckingAuth(true);

    mutate(values, {
      onSuccess: (data) => {
      },
      onError: (error) => {
        if (error.response?.status === 401) {
          setStatus('Credenciais inválidas.');
        } else if (error.response) {
          setStatus('Erro no servidor. Tente novamente mais tarde.');
        } else {
          setStatus('Erro de rede. Verifique sua conexão.');
        }

        // Reset the checking state on error
        setIsCheckingAuth(false);
        setSubmitting(false);
      },
      onSettled: () => {
        setSubmitting(false);
      }
    })

  };

  return (
      <Formik
        initialValues={{ name: '', password: '' }}
        validationSchema={loginSchema}
        onSubmit={handleLogin}
      >
        {({ isSubmitting, errors, status }) => (
          <Form>
            {isCheckingAuth ? <ContentLoader /> :
            <div className="wrapper">
             {status && <Feedback type='error'>{status}</Feedback>}

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
                  disabled={isSubmitting}
                />
                <ErrorMessage name="name" component="div" className='feedback feedback--error' />
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
                  disabled={isSubmitting}
                />
                <ErrorMessage name="password" component="div" className="feedback feedback--error" />
              </div>

              <div>
                <button type="submit" disabled={isSubmitting}>
                  <span>Login</span>
                </button>
              </div>
            </div>
            }
          </Form>
        )}
      </Formik>
  );
};

export default Login;
