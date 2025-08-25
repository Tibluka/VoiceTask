import { create } from 'zustand';

interface SwipeStore {
    isCardSwiping: boolean;
    setCardSwiping: (swiping: boolean) => void;
}

export const useSwipeStore = create<SwipeStore>((set) => ({
    isCardSwiping: false,
    setCardSwiping: (swiping: boolean) => set({ isCardSwiping: swiping }),
}));