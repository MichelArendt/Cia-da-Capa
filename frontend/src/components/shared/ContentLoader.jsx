import React from 'react';


const ContentLoader = ({
  hook,
  isLoading: externalIsLoading,
  isError: externalIsError,
  error: externalError,
  data: externalData,
  fallbackContent,
  displayMessage = 'Carregando...',
  loadingComponent,
  errorComponent,
  children,
}) => {
  // Initialize state variables
  let isLoading, isError, error, data, mutate, mutateAsync;

  // If a hook is provided, use it to get the states
  if (hook) {
    // Call the hook unconditionally
    const result = hook();
    ({ isLoading, isError, error, data, mutate, mutateAsync } = result);
  } else {
    // Use external states if provided
    isLoading = externalIsLoading || true;
    isError = externalIsError;
    error = externalError;
    data = externalData;
  }

  // Determine if it's a mutation
  const isMutation = Boolean(mutate || mutateAsync);

  // Handle mutations
  if (isMutation) {
    // Pass mutation functions and state to children
    return typeof children === 'function' ? children({ data, isLoading, isError, error, mutate, mutateAsync }) : children;
  }

  // Handle loading state
  if (isLoading) {
    return loadingComponent || (
      <div className="content-loader">
        <div className="content-loader__spinner-container">
          <div className="content-loader__spinner"></div>
        </div>
        {displayMessage && <span>{displayMessage}</span>}
      </div>
    );
  }

  // Handle error state
  if (isError) {
    // Optionally log the error for debugging
    console.error('An error occurred:', error);

    return (
      errorComponent || (
        <div className="content-loader error">
          <span>Um erro ocorreu. Por favor entrar em contato com o administrador.</span>
          {fallbackContent && <div>{fallbackContent}</div>}
        </div>
      )
    );
  }

  // Handle successful data fetching
  if (data) {
    return typeof children === 'function' ? children(data) : children;
  }

  // If no data and not loading or error, render fallback content or nothing
  return fallbackContent || null;
};

export default ContentLoader;


// isPending or status === 'pending' - The query has no data yet
// isError or status === 'error' - The query encountered an error
// isSuccess or status === 'success' - The query was successful and data is available

// error - If the query is in an isError state, the error is available via the error property.
// data - If the query is in an isSuccess state, the data is available via the data property.
// isFetching - In any state, if the query is fetching at any time (including background refetching) isFetching will be true.


// Mutation
// isIdle or status === 'idle' - The mutation is currently idle or in a fresh/reset state
// isPending or status === 'pending' - The mutation is currently running
// isError or status === 'error' - The mutation encountered an error
// isSuccess or status === 'success' - The mutation was successful and mutation data is available
// Beyond those primary states, more information is available depending on the state of the mutation:

// error - If the mutation is in an error state, the error is available via the error property.
// data - If the mutation is in a success state, the data is available via the data property.