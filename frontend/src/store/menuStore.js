import { create } from 'zustand';

const useMenuStore = create((set) => ({
  isOpen: false,
  toggleMenu: () => set((state) => {
    const newState = !state.isOpen;
    console.log(`Menu is now ${newState ? 'open' : 'closed'}`);
    return { isOpen: newState };
  })
}));

export default useMenuStore;