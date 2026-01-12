import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { SearchBar } from '@/components/SearchBar';
import { ArtistCard } from '@/components/ArtistCard';
import { useAuthStore } from '@/stores/authStore';
import { useFavoritesStore } from '@/stores/favoritesStore';
import { useArtists } from '@/hooks/useArtists';
import { Loader2 } from 'lucide-react';

export function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { isAuthenticated, logout } = useAuthStore();
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  
  const { data: artists, isLoading, error } = useArtists();

  const filteredArtists = artists?.filter(artist =>
    artist.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar isAuthenticated={isAuthenticated} onLogout={logout} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-8 mb-12">
          <div className="text-center space-y-2">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Découvrez vos artistes préférés
            </h2>
            <p className="text-muted-foreground text-lg">
              Trouvez des concerts, explorez des artistes et suivez vos favoris
            </p>
          </div>
          
          <SearchBar onSearch={setSearchQuery} />
        </div>

        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="animate-spin text-primary" size={48} />
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-destructive text-lg">
              Erreur lors du chargement des artistes
            </p>
          </div>
        )}

        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredArtists.map((artist) => (
              <ArtistCard
                key={artist.id}
                artist={artist}
                onFavorite={toggleFavorite}
                isFavorite={isFavorite(artist.id)}
              />
            ))}
          </div>
        )}

        {!isLoading && filteredArtists.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Aucun artiste trouvé pour "{searchQuery}"
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
