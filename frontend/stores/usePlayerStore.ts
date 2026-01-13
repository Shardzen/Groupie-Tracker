import { create } from 'zustand'

interface PlayerStore {
  isPlaying: boolean
  currentTrack: string | null
  togglePlay: () => void
  setTrack: (track: string) => void
}

export const usePlayerStore = create<PlayerStore>((set) => ({
  isPlaying: false,
  currentTrack: null,
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setTrack: (track) => set({ currentTrack: track, isPlaying: true }),
}))
