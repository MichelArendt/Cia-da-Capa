import axios from 'axios';
import useStore from '/src/store'; // Import your Zustand store

const PUBLIC_BASE_URL = '/public';
const MANAGE_BASE_URL = '/manage';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // Include cookies in requests
});

// Interceptor to handle specific status codes
api.interceptors.response.use(
  (response) => response, // Keep the default for successful responses
  (error) => {
    if (error.response && error.response.status === 401) {
      // Update authentication state to false
      const setAuthenticated = useStore.getState().setAuthenticated;
      setAuthenticated(false);
      // Reject the error to be handled by the calling code
      return Promise.reject(error);
    }
    // For other errors, reject as usual
    return Promise.reject(error);
  }
);

// Automatically include CSRF token in requests
api.interceptors.request.use(
  async (config) => {
    // Get the CSRF token from the cookie
    const xsrfToken = _getCookieValue('XSRF-TOKEN');

    if (!xsrfToken) {
      // If the token doesn't exist, fetch it from the server
      await _fetchCsrfToken();
      config.headers['X-XSRF-TOKEN'] = _getCookieValue('XSRF-TOKEN');
    } else {
      config.headers['X-XSRF-TOKEN'] = xsrfToken;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Private helper function to get cookie values
function _getCookieValue(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

// Private function to fetch CSRF token from the server
async function _fetchCsrfToken() {
  await axios.get('/api/sanctum/csrf-cookie', { withCredentials: true });
}

// Centralized request handler function
const _requestHandler = async (method, url, data = null) => {
  try {
    const response = await api[method](url, data);
    return response;
  } catch (error) {
    console.error(`Error in ${method.toUpperCase()} ${url}:`, error);
    // Re-throw the error so calling code can handle it
    throw error;
  }
};

// Public API endpoints
const apiPublic = {
  products: {
    list:                  () =>    _requestHandler('get', `${PUBLIC_BASE_URL}/produtos/`),
    getById:               (id) =>  _requestHandler('get', `${PUBLIC_BASE_URL}/produtos/${id}`),
    getCategory:           (id) =>  _requestHandler('get', `${PUBLIC_BASE_URL}/produtos/${id}/categoria`),
    listCategories:        () =>    _requestHandler('get', `${PUBLIC_BASE_URL}/produtos/categorias`),
    getCategoryById:       (id) =>  _requestHandler('get', `${PUBLIC_BASE_URL}/produtos/categorias/${id}`),
    listCategoryProducts:  (id) =>  _requestHandler('get', `${PUBLIC_BASE_URL}/produtos/categorias/${id}/produtos`),
  },
  user: {
    getAuthDetails:        () =>            _requestHandler('get', `${PUBLIC_BASE_URL}/user`),
    login:                 (credentials) => _requestHandler('post', `${PUBLIC_BASE_URL}/user/login`, credentials),
  },
  banners: {
    list:                  () =>    _requestHandler('get', `${PUBLIC_BASE_URL}/banners`),
    getById:               (id) =>  _requestHandler('get', `${PUBLIC_BASE_URL}/banners/${id}`),
  },
};

// Manage API endpoints
const apiManage = {
  products: {
    create:                (data) =>      _requestHandler('post', `${MANAGE_BASE_URL}/produtos`, data),
    update:                (id, data) =>  _requestHandler('put', `${MANAGE_BASE_URL}/produtos/${id}`, data),
    delete:                (id) =>        _requestHandler('delete', `${MANAGE_BASE_URL}/produtos/${id}`),
    categories: {
      create:              (data) =>      _requestHandler('post', `${MANAGE_BASE_URL}/produtos/categorias`, data),
      update:              (id, data) =>  _requestHandler('put', `${MANAGE_BASE_URL}/produtos/categorias/${id}`, data),
      delete:              (id) =>        _requestHandler('delete', `${MANAGE_BASE_URL}/produtos/categorias/${id}`),
    },
  },
  user: {
    logout:                () => _requestHandler('post', `${MANAGE_BASE_URL}/user/logout`),
  },
  banners: {
    create:                (data) =>      _requestHandler('post', `${MANAGE_BASE_URL}/banners`, data),
    update:                (id, data) =>  _requestHandler('put', `${MANAGE_BASE_URL}/banners/${id}`, data),
    delete:                (id) =>        _requestHandler('delete', `${MANAGE_BASE_URL}/banners/${id}`),
  },
};

export { apiPublic, apiManage }; // Export both public and manage APIs
export default api; // Also export the Axios instance in case direct access is needed
