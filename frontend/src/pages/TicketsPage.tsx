import { useState } from 'react';
import Navbar from '../components/Navbar';
import { mockArtists } from '../data/mockData';
import { useCartStore } from '../stores/useCartStore';
import { MapPin, Calendar, Ticket as TicketIcon, Star } from 'lucide-react';

const venues = [
  { city: "Paris", place: "Accor Arena" },
  { city: "Lyon", place: "Groupama Stadium" },
  { city: "Marseille", place: "Vélodrome" },
  { city: "Bruxelles", place: "Forest National" },
  { city: "Bordeaux", place: "Arkéa Arena" },
  { city: "Londres", place: "O2 Arena" },
];

const ticketsData = mockArtists.map((artist, index) => {
  const venue = venues[index % venues.length];
  return {
    id: artist.id,
    artist: artist,
    date: `${10 + index} JUIN 2026`,
    price: 45 + (index * 5),
    place: venue.place,
    city: venue.city
  };
});

function TicketCard({ artist, date, price, place, city, id }: any) {
  const [isReserved, setIsReserved] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleReserve = () => {
    if (isReserved) return;
    setIsReserved(true);
    
    // Ajout au panier après l'animation complète (1.2s)
    setTimeout(() => {
        addItem({
            id: id.toString(),
            title: artist.name,
            price: parseInt(price),
            image: artist.image,
            quantity: 1,
            type: 'standard'
        });
    }, 1200);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto h-52 md:h-64 group mb-8 perspective-1000">
      
      {/* --- LE NOUVEAU TAMPON CYBERPUNK (Objet CSS volant) --- */}
      {isReserved && (
        // Positionné pour frapper exactement la zone du texte
        <div className="absolute z-50 pointer-events-none animate-stamp-precision" style={{ top: '35%', left: '55%' }}>
             {/* Le Manche (Métal sombre et anneau lumineux) */}
             <div className="relative w-12 h-24 mx-auto -mt-24">
                <div className="w-16 h-16 bg-zinc-900 rounded-full shadow-[0_0_20px_rgba(139,92,246,0.5)] absolute -top-8 -left-2 z-10 border-b-4 border-violet-500 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-black/80 blur-sm flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 animate-pulse"></div>
                    </div>
                </div>
                <div className="w-8 h-20 bg-gradient-to-r from-zinc-800 to-zinc-950 mx-auto rounded-b-2xl shadow-lg border-x border-white/10"></div>
             </div>
             
             {/* La Base du tampon (Plaque Néon qui frappe) */}
             <div className="w-44 h-14 bg-[#1a1a1a] rounded-md shadow-[0_0_40px_rgba(219,39,119,0.8)] flex items-center justify-center border-b-[6px] border-fuchsia-600 relative z-0 transform -rotate-[10deg]">
                 <div className="absolute inset-0 bg-gradient-to-r from-violet-600/30 to-fuchsia-600/30 blur-md rounded-md"></div>
                 <span className="text-[10px] text-fuchsia-200 uppercase font-bold tracking-[0.3em] relative z-10">GROUPIE ACCESS</span>
             </div>
        </div>
      )}

      {/* --- CORPS DU TICKET (Maintenant dans le thème Violet/Fuchsia) --- */}
      <div className="relative h-full w-full md:w-[72%] bg-[#0a0a0a] rounded-3xl md:rounded-r-none md:rounded-l-3xl flex overflow-hidden z-10 clip-ticket-left shadow-2xl border border-violet-500/20">
            <div className="absolute inset-0">
                <img src={artist.image} alt="bg" className="w-full h-full object-cover opacity-100 grayscale mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/95 to-transparent"></div>
            </div>

            <div className="relative z-20 h-full w-48 hidden md:block">
                 <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 mix-blend-overlay"></div>
                 <img src={artist.image} alt={artist.name} className="h-full w-full object-cover opacity-90 mask-image-gradient" />
            </div>

            <div className="relative z-20 flex-1 p-6 md:p-8 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-2">
                    <span className="bg-violet-500/10 text-violet-400 border border-violet-500/20 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider animate-pulse-slow">
                        Concert Exclusif
                    </span>
                </div>

                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white mb-2 truncate">
                    {artist.name}
                </h2>

                <div className="space-y-1 text-zinc-400 mb-4">
                    <p className="font-medium text-sm flex items-center gap-2 uppercase tracking-wide">
                        <Calendar size={16} className="text-fuchsia-500" /> 
                        <span className="text-white">{date}</span> • 20H30
                    </p>
                    <p className="font-medium text-sm flex items-center gap-2 uppercase tracking-wide">
                        <MapPin size={16} className="text-fuchsia-500" /> 
                        {place}, <span className="text-white">{city}</span>
                    </p>
                </div>
                
                {/* --- L'ENCRE (La cible de l'impact) --- */}
                {/* Positionnée exactement sous le point d'impact du tampon */}
                <div className={`absolute right-12 bottom-10 z-30 transform -rotate-[10deg] transition-all duration-200 ${isReserved ? 'opacity-100 scale-100' : 'opacity-0 scale-110 blur-md'}`} style={{ transitionDelay: '0.4s' }}>
                    <div className="border-[4px] border-fuchsia-500/80 px-5 py-1 rounded-sm mix-blend-lighten mask-grunge bg-violet-900/30 backdrop-blur-sm shadow-[0_0_20px_rgba(219,39,119,0.3)]">
                        <span className="font-black text-2xl md:text-3xl uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-fuchsia-300">
                          RÉSERVÉ
                        </span>
                    </div>
                </div>
            </div>

            {/* Ligne de séparation */}
            <div className="absolute right-0 top-4 bottom-4 w-[1px] border-r-2 border-dashed border-violet-500/30 hidden md:block"></div>
      </div>

      {/* --- SOUCHE (Thème Violet/Fuchsia qui se déchire) --- */}
      <div 
        // On ajoute un délai à la transition pour attendre l'impact du tampon (delay-300)
        className={`absolute right-0 top-0 bottom-0 w-[28%] bg-gradient-to-br from-violet-600 via-fuchsia-600 to-violet-800 rounded-r-3xl hidden md:flex flex-col items-center justify-center z-20 clip-ticket-right shadow-lg transition-all duration-1000 ease-out origin-left delay-300
        ${isReserved ? 'translate-x-[150%] rotate-[25deg] opacity-0 pointer-events-none' : 'group-hover:brightness-110 cursor-pointer'}`}
      >
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay"></div>

            <div className="text-center relative z-10 px-4 w-full transition-opacity duration-300" style={{ opacity: isReserved ? 0 : 1 }}>
                <div className="mb-4">
                    <span className="block text-[10px] font-black uppercase tracking-widest text-white/70">Tarif Unique</span>
                    <span className="block text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-md">{price}€</span>
                </div>
                
                <button 
                    onClick={handleReserve}
                    className="w-full bg-black/50 backdrop-blur-md text-white border border-white/20 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-transform shadow-xl flex items-center justify-center gap-2 hover:bg-white hover:text-black hover:border-transparent"
                >
                    Réserver <TicketIcon size={14} />
                </button>
            </div>
      </div>

      {/* Mobile button */}
      <div className="md:hidden mt-4">
        <button 
            onClick={handleReserve}
            disabled={isReserved}
            className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white px-4 py-4 rounded-xl font-bold text-lg uppercase tracking-widest hover:brightness-110 transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
        >
            {isReserved ? 'Validé' : `Réserver pour ${price}€`} <TicketIcon size={18} />
        </button>
      </div>

    </div>
  );
}

export default function TicketsPage() {
  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white pt-32 pb-20 relative overflow-x-hidden">
      
      <style>{`
        .clip-ticket-left { clip-path: polygon(0% 0%, 100% 0%, 100% 15%, 98% 18%, 100% 21%, 100% 79%, 98% 82%, 100% 85%, 100% 100%, 0% 100%); }
        .clip-ticket-right { clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 85%, 2% 82%, 0% 79%, 0% 21%, 2% 18%, 0% 15%); }
        .mask-image-gradient { mask-image: linear-gradient(to right, black 80%, transparent 100%); }
        .perspective-1000 { perspective: 1000px; }

        .mask-grunge {
            mask-image: url('https://www.transparenttextures.com/patterns/black-felt.png');
            -webkit-mask-image: url('https://www.transparenttextures.com/patterns/black-felt.png');
            mask-size: 200%;
        }

        /* NOUVELLE ANIMATION DE PRÉCISION */
        @keyframes stamp-precision {
          0% {
             transform: translate(120%, -400px) rotate(30deg) scale(1.2); /* Départ haut droite */
             opacity: 0;
          }
          35% {
             transform: translate(0, -40px) rotate(-10deg) scale(1.05); /* Juste avant l'impact */
             opacity: 1;
          }
          40% {
             transform: translate(0, 0) rotate(-10deg) scale(1); /* IMPACT EXACT SUR LE TEXTE */
          }
          50% {
             transform: translate(0, -5px) rotate(-10deg) scale(0.98); /* Léger écrasement */
          }
          100% {
             transform: translate(-200%, -200px) rotate(-60deg) scale(0.8); /* Départ vers la gauche */
             opacity: 0;
          }
        }
        .animate-stamp-precision {
          /* Durée 1s, l'impact est à 40% soit 0.4s */
          animation: stamp-precision 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
      `}</style>

      <div className="container mx-auto px-6">
        <div className="text-center mb-20 animate-fade-in-up">
           <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 mb-6 backdrop-blur-md">
              <TicketIcon size={14} className="text-fuchsia-400 animate-pulse" />
              <span className="text-xs font-bold text-violet-300 tracking-widest uppercase">Billetterie Officielle • Saison 2026</span>
           </div>
           <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 text-white leading-none">
             Vivez <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-500">L'Exceptionnel</span>
           </h1>
           <p className="text-zinc-400 max-w-xl mx-auto text-lg font-light">
             Sélectionnez votre artiste et validez votre accès.
           </p>
        </div>

        <div className="pb-32 max-w-5xl mx-auto">
           {ticketsData.map((ticket, idx) => (
              <div key={ticket.id} className="animate-fade-in-up" style={{ animationDelay: `${idx * 100}ms` }}>
                  <TicketCard {...ticket} />
              </div>
           ))}
        </div>
      </div>
    </div>
  );
}