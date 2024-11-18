import { create } from 'zustand';

const useStore = create((set) => ({
  // Settings
  breakpointDesktop: 900,

  // Auth
  isAuthenticated: false,
  lastAttemptedRoute: null,
  setAuthenticated: (value) => set({ isAuthenticated: value }),
  setLastAttemptedRoute: (route) => set({ lastAttemptedRoute: route }),
  clearLastAttemptedRoute: () => set({ lastAttemptedRoute: null }),

  // Close all menus signal
  closeAllMenusSignal: 0, // Initialize the counter
  triggerCloseAllMenus: () =>{
    set((state) => {
      console.log(state.closeAllMenusSignal); // Access `closeAllMenusSignal` from `state`
      return { closeAllMenusSignal: state.closeAllMenusSignal + 1 };
    });
  },
}));

export default useStore;