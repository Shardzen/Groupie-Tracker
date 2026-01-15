import { create } from 'zustand'

// 1. On définit à quoi ressemble une "Chanson"
type Song = {
  title: string;
  artist: string;
  image: string;
}

// 2. On définit ce que notre mémoire contient (État + Actions)
interface PlayerState {
  isPlaying: boolean;
  currentSong: Song | null; // Null si aucune musique n'est chargée
  volume: number;
  
  // Les actions (les boutons qu'on pourra appeler partout)
  play: (song: Song) => void;
  togglePlay: () => void; // Pause/Lecture
  setVolume: (vol: number) => void;
}

// 3. La création du store
export const usePlayerStore = create<PlayerState>((set) => ({
  isPlaying: false,
  currentSong: { // On met une chanson par défaut pour que ce soit joli au démarrage
    title: "Midnight City",
    artist: "M83",
    image: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=200&auto=format&fit=crop"
  },
  volume: 50,

  // Quand on lance une nouvelle chanson
  play: (song) => set({ currentSong: song, isPlaying: true }),

  // Quand on clique sur Pause/Play
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

  // Quand on bouge le volume
  setVolume: (vol) => set({ volume: vol }),
}))