import { useState } from 'react';
import { mockArtists } from '../data/mockData';
import { Calendar, Ticket, Globe as GlobeIcon, Navigation, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ConcertGlobe from '../components/ConcertGlobe';

export default function ConcertsPage() {
  const navigate = useNavigate();

  const allConcerts = mockArtists.flatMap(artist => 
    artist.upcomingDates.map(date => ({
      ...date,
      artistName: artist.name,
      artistImage: artist.image,
      genre: artist.genre
    }))
  );

  const [selectedConcert, setSelectedConcert] = useState<any>(null);
  const [globeFocus, setGlobeFocus] = useState<any>(null);

  const handleFocusOnMap = (concert: any) => {
      setGlobeFocus({
          lat: concert.lat,
          lng: concert.lng,
          artistName: concert.artistName,
          city: concert.city,
          date: concert.date,
          image: concert.artistImage
      });
      setSelectedConcert(concert);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-[#050505] text-white pt-24 pb-4">
      
      <div className="container mx-auto px-6 mb-4 flex justify-between items-end">
        <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3">
              <GlobeIcon className="text-violet-500 animate-pulse" />
              World Tour <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500">2026</span>
            </h1>
        </div>
        <div className="text-right hidden md:block">
            <span className="text-zinc-400 text-sm">Prochaines dates : </span>
            <span className="text-white font-bold">{allConcerts.length}</span>
        </div>
      </div>

      <div className="flex-1 container mx-auto px-4 flex gap-6 overflow-hidden">
        
        <div className="w-full md:w-[350px] shrink-0 flex flex-col bg-[#121212] rounded-2xl border border-white/5 overflow-hidden shadow-2xl z-10">
          <div className="p-4 border-b border-white/5 bg-white/5 backdrop-blur-sm">
             <h2 className="font-bold text-sm uppercase tracking-wider text-zinc-400">Liste des concerts</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3">
             {allConcerts.map((concert) => (
               <div 
                 key={concert.id} 
                 onClick={() => handleFocusOnMap(concert)}
                 className={`relative p-3 rounded-xl border transition-all duration-300 cursor-pointer group ${
                   selectedConcert?.id === concert.id 
                     ? 'bg-violet-500/10 border-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.3)]' 
                     : 'bg-zinc-900/40 border-white/5 hover:bg-zinc-800 hover:border-white/20'
                 }`}
               >
                 <div className="flex items-center gap-3">
                    <img src={concert.artistImage} alt={concert.artistName} className="w-12 h-12 rounded-lg object-cover shadow-lg border border-white/5" />
                    <div className="min-w-0">
                        <h3 className="font-bold truncate text-sm text-white">{concert.artistName}</h3>
                        <p className="text-[10px] text-zinc-500 uppercase mt-0.5">{concert.genre}</p>
                    </div>
                 </div>
                 
                 <div className="mt-3 flex justify-between items-center text-xs text-zinc-400">
                    <span className="flex items-center gap-1.5"><Calendar size={10} className="text-violet-400"/> {concert.date}</span>
                    <span className="flex items-center gap-1.5"><Navigation size={10} className="text-fuchsia-400"/> {concert.city}</span>
                 </div>

                 <div className="flex gap-2 mt-3 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button 
                        onClick={(e) => { e.stopPropagation(); handleFocusOnMap(concert); }}
                        className="flex-1 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-[10px] font-bold uppercase transition-colors flex items-center justify-center gap-1"
                    >
                        <Eye size={10} /> Voir
                    </button>
                    <button 
                         onClick={(e) => { 
                            e.stopPropagation(); 
                            navigate(`/tickets?search=${encodeURIComponent(concert.artistName)}`);
                        }}
                        className="flex-1 py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded text-[10px] font-bold uppercase transition-colors flex items-center justify-center gap-1"
                    >
                        <Ticket size={10} /> Billets
                    </button>
                 </div>
               </div>
             ))}
          </div>
        </div>

        <div className="flex-1 relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl hidden md:block bg-black">
          <ConcertGlobe 
            focusedLocation={globeFocus} 
            onClose={() => setGlobeFocus(null)}
          />
        </div>

      </div>
    </div>
  );
}