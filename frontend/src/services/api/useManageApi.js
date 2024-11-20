import { useQuery, useMutation } from '@tanstack/react-query';
import { apiManage } from './_axiosInstance';

// Hook to create a product
export function useCreateProduct() {
  return useMutation({
    mutationFn: async (data) => {
      const response = await apiManage.products.create(data);
      return response.data;
    },
  });
}

// Hook to update a product
export function useUpdateProduct() {
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await apiManage.products.update(id, data);
      return response.data;
    },
  });
}

// Hook to delete a product
export function useDeleteProduct() {
  return useMutation({
    mutationFn: async (id) => {
      const response = await apiManage.products.delete(id);
      return response.data;
    },
  });
}

// Hook to create a product category
export function useCreateProductCategory() {
  return useMutation({
    mutationFn: async (data) => {
      const response = await apiManage.products.categories.create(data);
      return response.data;
    },
  });
}

// Hook to update a product category
export function useUpdateProductCategory() {
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await apiManage.products.categories.update(id, data);
      return response.data;
    },
  });
}

// Hook to delete a product category
export function useDeleteProductCategory() {
  return useMutation({
    mutationFn: async (id) => {
      const response = await apiManage.products.categories.delete(id);
      return response.data;
    },
  });
}

// Hook to log out
export function useLogout() {
  return useMutation({
    mutationFn: async () => {
      const response = await apiManage.user.logout();
      return response.data;
    },
  });
}

// Hook to create a banner
export function useCreateBanner() {
  return useMutation({
    mutationFn: async (data) => {
      const response = await apiManage.banners.create(data);
      return response.data;
    },
  });
}

// Hook to update a banner
export function useUpdateBanner() {
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await apiManage.banners.update(id, data);
      return response.data;
    },
  });
}

// Hook to delete a banner
export function useDeleteBanner() {
  return useMutation({
    mutationFn: async (id) => {
      const response = await apiManage.banners.delete(id);
      return response.data;
    },
  });
}
