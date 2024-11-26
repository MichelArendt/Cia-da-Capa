import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // avoid refetching on window focus
      staleTime: 5 * 60 * 1000, // Cache results for 5 minutes
      retry: 2, // Retry failed requests up to 2 times
      onError: (error) => {
        console.error('Global Query Error:', error);
      },
    },
    mutations: {
      onError: (error) => {
        console.error('Global Mutation Error:', error);
      },
    },
  },
});

export default queryClient;
