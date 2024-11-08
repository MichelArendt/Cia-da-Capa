import { create } from 'zustand';

const useStore = create((set) => ({
  isAuthenticated: false,
  lastAttemptedRoute: null,
  setAuthenticated: (value) => set({ isAuthenticated: value }),
  setLastAttemptedRoute: (route) => set({ lastAttemptedRoute: route }),
  clearLastAttemptedRoute: () => set({ lastAttemptedRoute: null }),
}));

export default useStore;