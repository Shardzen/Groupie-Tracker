import { create } from 'zustand';

interface Artist {
  id: number;
  name: string;
  image: string;
  members: string[];
  creationDate: number;
  firstAlbum: string;
}

interface FavoritesState {
  favorites: number[];
  addFavorite: (artistId: number) => void;
  removeFavorite: (artistId: number) => void;
  isFavorite: (artistId: number) => boolean;
  toggleFavorite: (artistId: number) => void;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],

  addFavorite: (artistId) =>
    set((state) => ({
      favorites: [...state.favorites, artistId],
    })),

  removeFavorite: (artistId) =>
    set((state) => ({
      favorites: state.favorites.filter((id) => id !== artistId),
    })),

  isFavorite: (artistId) => get().favorites.includes(artistId),

  toggleFavorite: (artistId) => {
    const { isFavorite, addFavorite, removeFavorite } = get();
    if (isFavorite(artistId)) {
      removeFavorite(artistId);
    } else {
      addFavorite(artistId);
    }
  },
}));
