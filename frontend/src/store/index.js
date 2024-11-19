import { create } from 'zustand';

// Define breakpointDesktop outside of the store
const breakpointDesktop = parseInt(
  getComputedStyle(document.documentElement).getPropertyValue('--breakpoint-desktop')
) || 900;

const useStore = create((set) => ({
  // Settings
  breakpointDesktop,

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
      return { closeAllMenusSignal: state.closeAllMenusSignal + 1 };
    });
  },

  // Is Mobile State
  isMobile: window.innerWidth < breakpointDesktop,
  setIsMobile: (value) => set({ isMobile: value }),

  // Window Dimensions
  windowWidth: window.innerWidth,
  windowHeight: window.innerHeight,
  setWindowDimensions: (width, height) => set({ windowWidth: width, windowHeight: height }),
}));

export default useStore;