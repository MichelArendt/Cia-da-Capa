import { create } from 'zustand';

const useAuthStore = create((set, get) => ({
  isAuthenticated: null,
  isCheckingAuth: false,
  error: null,
  lastAttemptedRoute: null,

  // Update authentication state
  updateAuthStatus: (isAuthenticated, error = null ) => {
    set((state) => ({
      ...state,
      isAuthenticated: isAuthenticated,
      error: error,
      // isCheckingAuth: false, // Always stop checking when status is updated
    }))
  },

  // Update `isCheckingAuth` state directly
  setCheckingAuth: (isChecking) => {
    set((state) => ({
      ...state,
      isCheckingAuth: isChecking,
    }));
  },

  // Reset the authentication state (e.g., after logout)
  resetAuthState: () => {
    set({
      isAuthenticated: false,
      isCheckingAuth: false,
      error: null,
    });
  },

  // Update the last attempted route
  setLastAttemptedRoute: (location) => {
    console.log("setLastAttemptedRoute 1")
    if (!location || !location.pathname) return; // Safeguard against invalid location

    const { pathname, search } = location;
    const currentRoute = `${pathname}${search || ''}`; // Build the full route string

    console.log("setLastAttemptedRoute 2")
    // Avoid saving the login page or redundant updates
    if (currentRoute === '/manage/user/login' || currentRoute === get().lastAttemptedRoute) return;

    console.log("setLastAttemptedRoute 3: " + currentRoute)
    set({ lastAttemptedRoute: currentRoute }); // Save the new route
  },

  // Navigate to the last attempted route or fallback
  navigateToLastAttemptedRoute: (navigate) => {
    const { lastAttemptedRoute } = get();
    const targetRoute = lastAttemptedRoute || '/manage';
    set({ lastAttemptedRoute: null }); // Clear after navigating
    navigate(targetRoute);
  },

  // Clear the last attempted route
  clearLastAttemptedRoute: () => {
    set({ lastAttemptedRoute: null });
  },
}));

export default useAuthStore;
