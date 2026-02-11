import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Calendar, MapPin, Ticket } from 'lucide-react';

// --- VÉRIFIE QUE CES CHEMINS SONT BONS CHEZ TOI ---
import { mockArtists } from '../data/mockData'; 
import { useCartStore } from '../stores/useCartStore';

export default function TicketsPage() {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedGenre, setSelectedGenre] = useState('Tous');
  
  // Utilisation de 'as any' pour éviter les blocages TypeScript temporairement
  const { addItem, toggleCart } = useCartStore() as any; 

  useEffect(() => {
    const query = searchParams.get('search');
    if (query) {
        setSearchTerm(query);
    }
  }, [searchParams]);

  const genres = ['Tous', 'Rap FR', 'Pop', 'Rock', 'Electro'];

  // On force le type en 'any' pour que TypeScript arrête de râler sur les données
  const filteredConcerts = (mockArtists as any[]).flatMap(artist => 
    artist.upcomingDates.map((date: any) => ({
      ...date,
      artistName: artist.name,
      artistImage: artist.image,
      genre: artist.genre,
      price: artist.price || 45 
    }))
  ).filter((concert: any) => {
    const matchesSearch = concert.artistName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          concert.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          concert.venue.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === 'Tous' || concert.genre === selectedGenre;

    return matchesSearch && matchesGenre;
  });

  const handleAddToCart = (concert: any) => {
    addItem({
        id: concert.id || Math.random(),
        title: concert.artistName,
        price: concert.price,
        image: concert.artistImage,
        quantity: 1,
        type: 'Standard'
    });
    toggleCart();
  };

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white pt-24 pb-12 px-4">
      
      <div className="container mx-auto mb-12">
        <h1 className="text-4xl md:text-6xl font-black mb-8 uppercase tracking-tighter">
            Billetterie <span className="text-violet-600">Officielle</span>
        </h1>

        <div className="flex flex-col md:flex-row gap-4 bg-[#1a1a1a] p-4 rounded-2xl border border-white/10">
            <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
                <input 
                    type="text" 
                    placeholder="Rechercher un artiste, une salle ou une ville..." 
                    className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-violet-500 transition-colors"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                <Filter size={20} className="text-zinc-400 hidden md:block" />
                {genres.map(genre => (
                    <button 
                        key={genre}
                        onClick={() => setSelectedGenre(genre)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${
                            selectedGenre === genre 
                            ? 'bg-white text-black' 
                            : 'bg-black/50 text-zinc-400 hover:text-white hover:bg-white/10'
                        }`}
                    >
                        {genre}
                    </button>
                ))}
            </div>
        </div>
      </div>

      <div className="container mx-auto">
        <div className="space-y-4">
            {filteredConcerts.length > 0 ? (
                filteredConcerts.map((concert: any, index: number) => (
                    <div key={`${concert.artistName}-${index}`} className="group bg-[#121212] hover:bg-[#1a1a1a] border border-white/5 hover:border-violet-500/50 rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-center gap-6 transition-all duration-300">
                        
                        <div className="flex flex-col items-center justify-center bg-black/30 w-full md:w-24 h-24 rounded-xl border border-white/5 shrink-0">
                            <span className="text-zinc-500 text-xs uppercase font-bold">{concert.date.split(' ')[1] || 'JUIN'}</span>
                            <span className="text-2xl font-black text-white">{concert.date.split(' ')[0] || '12'}</span>
                            <span className="text-zinc-500 text-xs">{concert.date.split(' ')[2] || '2026'}</span>
                        </div>

                        <div className="flex-1 text-center md:text-left min-w-0 w-full">
                            <h3 className="text-2xl font-black uppercase mb-1 truncate">{concert.artistName}</h3>
                            <div className="flex flex-col md:flex-row gap-2 md:gap-6 text-sm text-zinc-400 justify-center md:justify-start">
                                <span className="flex items-center justify-center gap-1"><MapPin size={14}/> {concert.venue}, {concert.city}</span>
                                <span className="flex items-center justify-center gap-1"><Calendar size={14}/> 20:30</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-white/10 pt-4 md:pt-0">
                            <div className="text-right">
                                <p className="text-xs text-zinc-500 uppercase font-bold">À partir de</p>
                                <p className="text-2xl font-bold text-white">{concert.price} €</p>
                            </div>
                            <button 
                                onClick={() => handleAddToCart(concert)}
                                className="bg-white text-black hover:bg-violet-600 hover:text-white px-8 py-3 rounded-xl font-bold uppercase tracking-wider transition-all transform active:scale-95 flex items-center gap-2"
                            >
                                <Ticket size={18} /> Réserver
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center py-20">
                    <p className="text-xl text-zinc-500">Aucun concert ne correspond à votre recherche.</p>
                    <button onClick={() => { setSearchTerm(''); setSelectedGenre('Tous'); }} className="mt-4 text-violet-500 hover:underline">
                        Réinitialiser les filtres
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}