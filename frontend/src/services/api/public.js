import api from '/src/services/api';

const apiPublic = {
  fetchCsrfToken: async () => {
    try {
      await api.get('/sanctum/csrf-cookie');
      console.log("CSRF token fetched successfully");
    } catch (error) {
      console.error("Failed to fetch CSRF token:", error);
    }
  },

  checkAuthStatus: async () => {
    try {
      const response = await api.get('/public/user');
      return response; // Return the data from the response
    } catch (error) {
      console.error("User not logged in:", error);
      return null;
    }
  },

  login: async ({name, password}) => {
    try {
      const response = await api.post('/public/user/login', {name, password});
      return response; // Return the data from the response
    } catch (error) {
      console.error("Login error:", error);
      return null;
    }
  },

  fetchProductCategories: async () => {
    try {
      const response = await api.get('/public/produtos/categorias');
      return response; // Return the data from the response
    } catch (error) {
      console.error("Error fetching product categories:", error);
      return null;
    }
  },
}

export default apiPublic;