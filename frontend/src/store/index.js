import { create } from 'zustand';

const useStore = create((set) => ({
  isAuthenticated: false,
  setAuthenticated: (value) => set({ isAuthenticated: value }),
}));

export default useStore;