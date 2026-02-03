import { useState } from 'react';
import { mockArtists } from '../data/mockData';
import { MapPin, Ticket, ArrowRight, Globe } from 'lucide-react';

// 📍 1. COORDONNÉES GPS (Position en % sur la carte du monde)
const cityCoordinates: Record<string, { top: string, left: string }> = {
  "Paris": { top: "27%", left: "49%" },
  "Lyon": { top: "29%", left: "49.5%" },
  "Marseille": { top: "31%", left: "50%" },
  "Bruxelles": { top: "26%", left: "49.5%" },
  "Genève": { top: "29%", left: "50%" },
  "Londres": { top: "25%", left: "48%" },
  "Berlin": { top: "25%", left: "51%" },
  "Madrid": { top: "33%", left: "47%" },
  // Valeur par défaut (au milieu) si la ville n'est pas connue
  "default": { top: "45%", left: "50%" } 
};

export default function ConcertsPage() {
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);

  // 2. GÉNÉRATION INTELLIGENTE DES CONCERTS
  // On attribue une ville spécifique à chaque artiste pour tester la map
  const cities = ["Paris", "Lyon", "Marseille", "Bruxelles", "Genève", "Londres"];
  const venues = ["Accor Arena", "Groupama Stadium", "Vélodrome", "Forest National", "Arena", "O2"];

  const realConcerts = mockArtists.slice(0, 6).map((artist, index) => ({
    id: artist.id,
    artist: artist.name,
    image: artist.image,
    tour: "World Tour 2026",
    city: cities[index] || "Paris",
    venue: venues[index] || "Zénith",
    date: `${10 + index} JUIN`,
    price: `${45 + index * 10}€`,
    status: index === 0 ? "Complet" : "Dispo"
  }));

  // Récupère la position actuelle (soit la ville survolée, soit Paris par défaut)
  const activePosition = hoveredCity && cityCoordinates[hoveredCity] 
    ? cityCoordinates[hoveredCity] 
    : cityCoordinates["Paris"];

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-20">
      
      {/* HEADER */}
      <div className="container mx-auto px-6 mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="text-xs font-bold tracking-widest uppercase">Live Nation</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-2">
            Prochaines <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500">Dates</span>
          </h1>
      </div>

      <div className="container mx-auto px-6 flex flex-col lg:flex-row gap-8 items-start">
        
        {/* GAUCHE : LISTE DES CONCERTS */}
        <div className="w-full lg:w-2/3 space-y-3">
           {realConcerts.map((gig) => (
             <div 
               key={gig.id}
               onMouseEnter={() => setHoveredCity(gig.city)}
               onMouseLeave={() => setHoveredCity(null)}
               className="group relative bg-[#121212] border border-white/5 rounded-2xl p-4 flex items-center gap-6 hover:border-violet-500/50 transition-all duration-300 cursor-pointer hover:bg-white/5"
             >
                 {/* Date */}
                 <div className="bg-[#1a1a1a] rounded-xl p-3 min-w-[80px] text-center border border-white/5 group-hover:scale-105 transition-transform">
                     <span className="block text-xl font-black text-white">{gig.date.split(' ')[0]}</span>
                     <span className="block text-[10px] font-bold text-violet-400 uppercase">{gig.date.split(' ')[1]}</span>
                 </div>

                 {/* Photo Artiste */}
                 <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-violet-500 transition-colors hidden sm:block">
                     <img src={gig.image} alt={gig.artist} className="w-full h-full object-cover" />
                 </div>

                 {/* Infos */}
                 <div className="flex-1">
                     <h3 className="text-lg font-bold text-white group-hover:text-violet-300 transition-colors">{gig.artist}</h3>
                     <div className="flex items-center gap-4 mt-1 text-xs text-zinc-500 font-medium">
                         <span className="flex items-center gap-1 text-zinc-300"><MapPin size={12}/> {gig.city}</span>
                         <span className="hidden sm:flex items-center gap-1"><Ticket size={12}/> {gig.venue}</span>
                     </div>
                 </div>

                 {/* Bouton */}
                 <div className="min-w-[100px] text-right">
                     {gig.status === 'Complet' ? (
                         <span className="text-red-500 text-xs font-bold uppercase border border-red-500/30 px-3 py-1 rounded-full bg-red-500/10">Sold Out</span>
                     ) : (
                         <button className="bg-white text-black text-xs font-bold px-4 py-2 rounded-full hover:bg-violet-500 hover:text-white transition-colors">
                             {gig.price}
                         </button>
                     )}
                 </div>
             </div>
           ))}
        </div>

        {/* DROITE : LA MAP DU FUTUR (Interactive) */}
        <div className="hidden lg:block w-1/3 sticky top-28">
           <div className="bg-[#121212] rounded-3xl p-6 border border-white/10 relative overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                 <h3 className="font-bold text-lg flex items-center gap-2"><Globe className="text-violet-500" /> Tournée</h3>
                 <span className="text-xs text-zinc-500 font-mono">LIVE TRACKING</span>
              </div>

              {/* Carte du monde */}
              <div className="aspect-square bg-[#0a0a0a] rounded-2xl relative overflow-hidden group border border-white/5">
                 <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/World_map_blank_without_borders.svg/2000px-World_map_blank_without_borders.svg.png" 
                    className="w-full h-full object-cover opacity-30 invert grayscale" alt="Map"
                 />
                 
                 {/* 🎯 LE POINT QUI BOUGE */}
                 <div 
                    className="absolute transition-all duration-700 ease-in-out"
                    style={{ 
                        top: activePosition.top, 
                        left: activePosition.left,
                        transform: 'translate(-50%, -50%)' // Pour centrer le point pile sur la coordonnée
                    }}
                 >
                    <div className="relative">
                        {/* Cercle qui pulse */}
                        <div className="absolute -inset-4 bg-violet-500/30 rounded-full animate-ping"></div>
                        <div className="absolute -inset-2 bg-violet-500/50 rounded-full animate-pulse"></div>
                        {/* Point central */}
                        <div className="w-3 h-3 bg-violet-400 rounded-full border-2 border-white shadow-[0_0_15px_rgba(167,139,250,1)] relative z-10"></div>
                        
                        {/* Label Ville (Apparaît au survol) */}
                        <div className={`absolute top-6 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur px-3 py-1 rounded-lg border border-white/20 whitespace-nowrap transition-opacity duration-300 ${hoveredCity ? 'opacity-100' : 'opacity-0'}`}>
                            <span className="text-xs font-bold text-white">{hoveredCity || "Paris"}</span>
                        </div>
                    </div>
                 </div>

              </div>
           </div>
        </div>

      </div>
    </div>
  );
}