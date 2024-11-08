import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // Include cookies in requests
});

// Interceptor to handle specific status codes
api.interceptors.response.use(
  response => response, // Keep the default for successful responses
  error => {
    if (error.response && error.response.status === 401) {
      // Return a custom response for 401 without throwing an error
      return { data: { authenticated: false }, status: 401 };
    }
    // For other errors, reject as usual
    return Promise.reject(error);
  }
);

// Automatically include CSRF token in requests
api.interceptors.request.use(
  async (config) => {
    // Get the CSRF token from the cookie
    const xsrfToken = getCookieValue('XSRF-TOKEN');

    if (!xsrfToken) {
      // If the token doesn't exist, fetch it from the server
      await getCsrfToken();
      config.headers['X-XSRF-TOKEN'] = getCookieValue('XSRF-TOKEN');
    } else {
      config.headers['X-XSRF-TOKEN'] = xsrfToken;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Helper function to get cookie values
function getCookieValue(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

// Function to get CSRF token from the server
async function getCsrfToken() {
  await axios.get('/api/sanctum/csrf-cookie', { withCredentials: true });
}


// Exporting the configured instance and helper functions if needed
export { getCsrfToken };
export default api;
