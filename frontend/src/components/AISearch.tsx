import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';
import { useAuthApi } from '@/hooks/useAuthApi';
import { APIError } from '@/lib/api';
import { toast } from 'sonner';

interface Artist {
  id: number;
  name: string;
  image: string;
  // Add other artist properties if needed for display
}

interface AISearchResponse {
  results: Artist[];
  count: number;
  query: string;
}

export const AISearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(false);
  const authApi = useAuthApi();

  const handleSearch = async () => {
    if (!query.trim()) {
      return;
    }

    setLoading(true);
    setResults([]);
    try {
      const response = await authApi.post<AISearchResponse>('/ai/search', { query });
      setResults(response.results);
      if (response.count === 0) {
        toast.info("No results found for your query.");
      }
    } catch (error) {
      if (error instanceof APIError) {
        toast.error(`Search failed: ${error.message}`);
      } else {
        toast.error("An unknown error occurred during the search.");
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input
          type="text"
          placeholder="e.g., 'rock bands from the 90s'"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button type="button" onClick={handleSearch} disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
          Search
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {results.map((artist) => (
          <div key={artist.id} className="border rounded-lg p-4">
            <img src={artist.image} alt={artist.name} className="w-full h-48 object-cover rounded-md mb-2" />
            <h3 className="font-semibold">{artist.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};
