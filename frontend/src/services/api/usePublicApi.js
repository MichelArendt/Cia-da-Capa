import { useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';

import useCategoryStore from '/src/store/useCategoryStore';
import { apiPublic } from './_axiosInstance';

// Hook to list all products
export function useProductsList() {
  return useQuery({
    queryKey: ['productsList'],
    queryFn: async () => {
      const response = await apiPublic.products.list();
      return response.data;
    },
  });
}

// Hook to get a product by ID
export function useProductById(productId) {
  return useQuery({
    queryKey: ['productById', productId],
    queryFn: async () => {
      const response = await apiPublic.products.getById(productId);
      return response.data;
    },
    enabled: !!productId,
  });
}

// Hook to get product category by ID
export function useProductCategory(productId) {
  return useQuery({
    queryKey: ['productCategory', productId],
    queryFn: async () => {
      const response = await apiPublic.products.getCategory(productId);
      return response.data;
    },
    enabled: !!productId,
  });
}

// Hook to list all product categories
export function useFetchCategories() {
  const { categories, setCategories, setFetchingCategories, setError } = useCategoryStore();

  // Fetch categories using React Query
  const { data, isFetching, isError, error, refetch } = useQuery({
    queryKey: ['productCategories'],
    queryFn: async () => {
      const response = await apiPublic.products.listCategories();
      return response.data;
    },
    enabled: !categories, // Only fetch if categories are null
  });

  useEffect(() => {
    setFetchingCategories(isFetching);

    if (isError) {
      setError(error.message || 'Failed to fetch categories');
    } else if (data) {
      setCategories(data);
    }
  }, [isFetching, isError, error, data, setFetchingCategories, setCategories, setError]);

  return { refetch };
}

// Hook to get a specific product category by ID
export function useProductCategoryById(categoryId) {
  return useQuery({
    queryKey: ['productCategoryById', categoryId],
    queryFn: async () => {
      const response = await apiPublic.products.getCategoryById(categoryId);
      return response.data;
    },
    enabled: !!categoryId,
  });
}

// Hook to list products in a specific category
export function useProductsByCategory(categoryId) {
  return useQuery({
    queryKey: ['productsByCategory', categoryId],
    queryFn: async () => {
      const response = await apiPublic.products.listCategoryProducts(categoryId);
      return response.data;
    },
    enabled: !!categoryId,
  });
}

// Hook to fetch authentication status for the user
export function useFetchAuthStatus(options = {}) {
  return useQuery({
    queryKey: ['authStatus'],
    queryFn: async () => {
      const response = await apiPublic.user.getAuthStatus();
      return response.data;
    },
    ...options, // Spread the options into useQuery
  });
}

// isPending or status === 'pending' - The query has no data yet
// isError or status === 'error' - The query encountered an error
// isSuccess or status === 'success' - The query was successful and data is available
// Beyond those primary states, more information is available depending on the state of the query:

// error - If the query is in an isError state, the error is available via the error property.
// data - If the query is in an isSuccess state, the data is available via the data property.
// isFetching - In any state, if the query is fetching at any time (including background refetching) isFetching will be true.

// Hook to log in
export function useLogin() {
  return useMutation({
    mutationFn: async (credentials) => {
      const response = await apiPublic.user.login(credentials);
      return response.data;
    },
  });
}

// Hook to list all banners
export function useBannersList() {
  return useQuery({
    queryKey: ['bannersList'],
    queryFn: async () => {
      const response = await apiPublic.banners.list();
      return response.data;
    },
  });
}

// Hook to get a banner by ID
export function useBannerById(bannerId) {
  return useQuery({
    queryKey: ['bannerById', bannerId],
    queryFn: async () => {
      const response = await apiPublic.banners.getById(bannerId);
      return response.data;
    },
    enabled: !!bannerId,
  });
}
