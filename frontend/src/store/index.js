import { create } from 'zustand';

// Define breakpointDesktop before creating the store
const breakpointDesktop = 900; // Default value for the desktop breakpoint

const useStore = create((set) => ({
  // Settings
  breakpointDesktop: 900,
  setBreakpointDesktop: (value) => set({ breakpointDesktop: value }),

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