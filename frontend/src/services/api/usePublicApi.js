import { useQuery, useMutation } from '@tanstack/react-query';
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
export function useProductCategories() {
  return useQuery({
    queryKey: ['productCategories'],
    queryFn: async () => {
      const response = await apiPublic.products.listCategories();
      return response.data;
    },
  });
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

// Hook to get authentication details for the user
export function useAuthDetails() {
  return useQuery({
    queryKey: ['authDetails'],
    queryFn: async () => {
      const response = await apiPublic.user.getAuthDetails();
      return response.data;
    },
  });
}

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
