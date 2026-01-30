import { create } from 'zustand';
export interface Track {
  title: string;
  artist: string;
  image: string;
  audioUrl?: string;
}

interface PlayerStore {
  isPlaying: boolean;
  currentTrack: Track | null;
  play: (track: Track) => void;
  pause: () => void;
  toggle: () => void;
}

export const usePlayerStore = create<PlayerStore>((set) => ({
  isPlaying: false,
  currentTrack: null,
  
  play: (track) => set({ isPlaying: true, currentTrack: track }),
  
  pause: () => set({ isPlaying: false }),
  
  toggle: () => set((state) => ({ isPlaying: !state.isPlaying })),
}));