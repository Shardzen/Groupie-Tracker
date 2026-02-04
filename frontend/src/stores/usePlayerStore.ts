import { create } from 'zustand';

export interface Track {
  title: string;
  artist: string;
  image: string;
  deezerUrl?: string; 
}

interface PlayerStore {
  currentTrack: Track | null;
  open: (track: Track) => void;
  close: () => void;
}

export const usePlayerStore = create<PlayerStore>((set) => ({
  currentTrack: null,
  open: (track) => set({ currentTrack: track }),
  close: () => set({ currentTrack: null }),
}));
