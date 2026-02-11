import { useState, useEffect, useCallback } from 'react';
import { Search, Sparkles, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import { debounce } from '@/lib/utils';

interface Artist {
  id: number;
  name: string;
  image: string;
  members: string[];
  creation_date: number;
  first_album: string;
}

interface SearchResult {
  results: Artist[];
  count: number;
  query: string;
  ai_powered?: boolean;
}

export default function AISearchComponent() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [aiMode, setAiMode] = useState(true);
  const navigate = useNavigate();

  // Debounced search function
  const performSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults(null);
        return;
      }

      setLoading(true);
      try {
        const endpoint = aiMode ? '/ai/search' : '/artists';
        const response = await api.post(endpoint, { query: searchQuery });
        setResults({
          ...response.data,
          ai_powered: aiMode,
        });
      } catch (error) {
        console.error('Search error:', error);
        setResults({ results: [], count: 0, query: searchQuery });
      } finally {
        setLoading(false);
      }
    }, 500),
    [aiMode]
  );

  useEffect(() => {
    performSearch(query);
  }, [query, performSearch]);

  const handleArtistClick = (artistId: number) => {
    navigate(`/artists/${artistId}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
          {loading ? (
            <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
          ) : (
            <Search className="w-5 h-5 text-slate-400" />
          )}
        </div>
        
        <Input
          type="text"
          placeholder={
            aiMode
              ? "Recherche intelligente : 'groupes français des années 90', 'metal scandinave'..."
              : "Rechercher un artiste..."
          }
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-12 pr-20 h-14 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500 focus:ring-purple-500"
        />

        <button
          onClick={() => setAiMode(!aiMode)}
          className={`absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
            aiMode
              ? 'bg-purple-500 text-white'
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
        >
          <Sparkles className="w-4 h-4 inline mr-1" />
          {aiMode ? 'IA' : 'Normal'}
        </button>
      </div>

      {/* AI Mode Badge */}
      {aiMode && query && (
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>Recherche IA activée - Compréhension du langage naturel</span>
        </div>
      )}

      {/* Results */}
      {results && results.count > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">
              {results.count} résultat{results.count > 1 ? 's' : ''} trouvé{results.count > 1 ? 's' : ''}
            </h3>
            {results.ai_powered && (
              <Badge variant="outline" className="border-purple-500 text-purple-400">
                <Sparkles className="w-3 h-3 mr-1" />
                Résultats IA
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.results.map((artist) => (
              <Card
                key={artist.id}
                onClick={() => handleArtistClick(artist.id)}
                className="bg-slate-900 border-slate-700 hover:border-purple-500 transition-all cursor-pointer group overflow-hidden"
              >
                <div className="flex gap-4 p-4">
                  <img
                    src={artist.image}
                    alt={artist.name}
                    className="w-20 h-20 rounded-lg object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-white truncate group-hover:text-purple-400 transition-colors">
                      {artist.name}
                    </h4>
                    <p className="text-sm text-slate-400 mt-1">
                      {artist.members.length} membre{artist.members.length > 1 ? 's' : ''}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {artist.creation_date}
                      </Badge>
                      {artist.first_album && (
                        <Badge variant="outline" className="text-xs">
                          {artist.first_album}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {results && results.count === 0 && (
        <Card className="bg-slate-900 border-slate-700 p-8 text-center">
          <p className="text-slate-400">
            Aucun résultat pour "{results.query}"
          </p>
          {aiMode && (
            <p className="text-sm text-slate-500 mt-2">
              L'IA n'a pas trouvé de correspondance. Essayez une autre recherche.
            </p>
          )}
        </Card>
      )}

      {/* Search Examples */}
      {!query && (
        <Card className="bg-slate-900 border-slate-700 p-6">
          <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            Exemples de recherche IA
          </h4>
          <div className="space-y-2">
            {[
              'Groupes français de rap',
              'Metal scandinave des années 2000',
              'Artistes formés dans les années 90',
              'Rock américain avec 4 membres',
              'EDM français moderne',
            ].map((example) => (
              <button
                key={example}
                onClick={() => setQuery(example)}
                className="block w-full text-left px-4 py-2 rounded-md bg-slate-800/50 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-sm"
              >
                {example}
              </button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
