import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';
import { ENDPOINTS } from '@/lib/api';

interface Artist {
  id: number;
  name: string;
  image: string;
  members: string[];
  creationDate: number;
  firstAlbum: string;
}

// Récupérer tous les artistes
export const useArtists = () => {
  return useQuery({
    queryKey: ['artists'],
    queryFn: async () => {
      const { data } = await apiClient.get<Artist[]>(ENDPOINTS.ARTISTS);
      return data;
    },
  });
};

// Récupérer un artiste par ID
export const useArtist = (id: number) => {
  return useQuery({
    queryKey: ['artist', id],
    queryFn: async () => {
      const { data } = await apiClient.get<Artist>(`${ENDPOINTS.ARTISTS}/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

// Rechercher des artistes
export const useSearchArtists = (query: string) => {
  return useQuery({
    queryKey: ['artists', 'search', query],
    queryFn: async () => {
      const { data } = await apiClient.get<Artist[]>(
        `${ENDPOINTS.ARTISTS}/search?q=${encodeURIComponent(query)}`
      );
      return data;
    },
    enabled: query.length > 0,
  });
};

// Ajouter/Retirer des favoris
export const useFavoriteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ artistId, action }: { artistId: number; action: 'add' | 'remove' }) => {
      if (action === 'add') {
        const { data } = await apiClient.post(ENDPOINTS.FAVORITES, { artistId });
        return data;
      } else {
        const { data } = await apiClient.delete(`${ENDPOINTS.FAVORITES}/${artistId}`);
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
};
