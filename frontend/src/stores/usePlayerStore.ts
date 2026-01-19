import { create } from 'zustand';

export type Song = {
  title: string;
  artist: string;
  image: string;
  duration?: number;
};

interface PlayerState {
  isPlaying: boolean;
  currentSong: Song | null;
  volume: number;
  isExpanded: boolean;

  play: (song: Song) => void;
  pause: () => void;
  togglePlay: () => void;
  setVolume: (vol: number) => void;
  toggleExpand: () => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  isPlaying: false,
  currentSong: null,
  volume: 80,
  isExpanded: false,

  play: (song) => set({ currentSong: song, isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setVolume: (vol) => set({ volume: vol }),
  toggleExpand: () => set((state) => ({ isExpanded: !state.isExpanded })),
}));