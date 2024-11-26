import { create } from 'zustand';
import { apiPublic } from '/src/services/api/_axiosInstance';
import queryClient from '/src/services/api/queryClient'; // Correct import for queryClient

const useCategoryStore = create((set, get) => {
  // React Query integration: Fetch categories
  const fetchCategories = async () => {
    set({ isFetching: true, error: null });

    try {
      // Correctly call fetchQuery with object syntax
      const data = await queryClient.fetchQuery({
        queryKey: ['productCategories'], // Use an array for queryKey
        queryFn: async () => {
          const response = await apiPublic.products.listCategories();
          return response.data;
        },
      });

      console.log('Fetched categories:', data);

      // Process and store the categories
      const categoriesById = data.reduce((acc, category) => {
        acc[category.id] = category;
        return acc;
      }, {});

      set({ categories: data, categoriesById, isFetching: false });
    } catch (error) {
      console.error('Fetch categories error:', error);
      set({
        categories: null,
        categoriesById: {},
        isFetching: false,
        error: error.message || 'Failed to fetch categories',
      });
    }
  };

  // Public API: Get all categories
  const getCategories = async () => {
    const { categories, fetchCategories, isFetching, error } = get();

    if (isFetching) return { status: 'loading' };
    if (error) return { status: 'error', error };
    if (categories) return { status: 'success', data: categories };

    // If categories are not cached, fetch them
    await fetchCategories();

    const { categories: updatedCategories, error: fetchError } = get();

    return fetchError
      ? { status: 'error', error: fetchError }
      : { status: 'success', data: updatedCategories || [] };
  };

  // Public API: Get a specific category by ID
  const getCategoryById = async (id) => {
    const { categoriesById, fetchCategories, error } = get();

    if (categoriesById[id]) return { status: 'success', data: categoriesById[id] };
    if (error) return { status: 'error', error };

    // Fetch all categories if not already cached
    await fetchCategories();
    const { categoriesById: updatedById, error: fetchError } = get();

    return fetchError
      ? { status: 'error', error: fetchError }
      : { status: updatedById[id] ? 'success' : 'empty', data: updatedById[id] };
  };

  // Invalidate categories and trigger a re-fetch
  const invalidateCategories = async () => {
    await queryClient.invalidateQueries(['productCategories']);
    get().fetchCategories(); // Fetch fresh data
  };

  fetchCategories();

  return {
    // Local state
    categories: null, // Cached categories
    categoriesById: {}, // Quick access by ID
    isFetching: false,
    error: null,
  }
});

export default useCategoryStore;
