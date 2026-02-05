import { create } from 'zustand';

interface UIStore {
    isCommandPaletteOpen: boolean;
    toggleCommandPalette: () => void;
    setCommandPaletteOpen: (open: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
    isCommandPaletteOpen: false,
    toggleCommandPalette: () => set((state) => ({ isCommandPaletteOpen: !state.isCommandPaletteOpen })),
    setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
}));
