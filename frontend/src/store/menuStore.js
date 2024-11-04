import { create } from 'zustand';

const useMenuStore = create((set) => ({
  isOpen: false,
  toggleMenu: () => set((state) => {
    const newState = !state.isOpen;
    console.log(`isOpen set ${newState}`);
    return { isOpen: newState };
  }),
  closeMenu: () => set((state) => {
    console.log(`isOpen set FALSE`);
    return { isOpen: false };
  })
}));

export default useMenuStore;