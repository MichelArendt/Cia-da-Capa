import api from '/src/services/api';

export const fetchProductCategories = async () => {
  try {
    const response = await api.get('/public/produtos/categorias');
    return response.data; // Return the data from the response
  } catch (error) {
    console.error("Error fetching product categories:", error);
    return null;
  }
};

export const test = async () => {
  try {
    const response = await api.get('/public/test');
    return response.data; // Return the data from the response
  } catch (error) {
    console.error("Error testing API:", error);
    return null;
  }
};