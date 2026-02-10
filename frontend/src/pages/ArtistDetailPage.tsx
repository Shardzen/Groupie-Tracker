import { useParams, useNavigate } from 'react-router-dom';
import { mockArtists } from '../data/mockData';
import { Play, Heart, MapPin, Music, Share2, ArrowLeft, Clock, Calendar } from 'lucide-react';
import Navbar from '../components/Navbar';
import { usePlayerStore } from '../stores/usePlayerStore';
import { useState } from 'react';

export default function ArtistDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const playerStore = usePlayerStore();
  const open = playerStore?.open || (() => console.log("Player not ready"));
  
  const [isLiked, setIsLiked] = useState(false);
  
  const artist = mockArtists.find(a => a.id === id);

  if (!artist) {
    return (
      <div className="min-h-screen bg-[#0e0e0e] text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">Artiste introuvable</h2>
          <p className="text-zinc-400 mb-8">Cet artiste n'existe pas dans notre catalogue</p>
          <button 
            onClick={() => navigate('/artists')}
            className="px-6 py-3 bg-violet-600 hover:bg-violet-700 rounded-full font-bold transition-colors"
          >
            Retour aux artistes
          </button>
        </div>
      </div>
    );
  }

  const handleOpenDeezer = () => {
    open({
      title: `Top titres de ${artist.name}`,
      artist: artist.name,
      image: artist.image,
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: artist.name,
          text: `Découvre ${artist.name} sur YNOT Music!`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Partage annulé');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié dans le presse-papier!');
    }
  };

  const mockConcerts = [
    { date: 'MAI 15', venue: 'Accor Arena', city: 'Paris, France' },
    { date: 'MAI 18', venue: 'Zénith', city: 'Lyon, France' },
    { date: 'MAI 22', venue: 'Arkéa Arena', city: 'Bordeaux, France' },
    { date: 'MAI 25', venue: 'Palais 12', city: 'Bruxelles, Belgique' },
    { date: 'MAI 28', venue: 'Forest National', city: 'Bruxelles, Belgique' },
    { date: 'JUN 02', venue: 'O2 Arena', city: 'Londres, UK' },
  ];

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white overflow-x-hidden">
      <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/30 border-b border-white/5 transition-all duration-300">
        <Navbar />
      </div>

      <button
        onClick={() => navigate('/artists')}
        className="fixed top-24 left-6 z-40 bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-full border border-white/10 hover:border-violet-500/50 transition-all flex items-center gap-2 group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-semibold">Retour</span>
      </button>

      <div className="relative h-[85vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={artist.image} 
            alt={artist.name} 
            className="w-full h-full object-cover" 
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(artist.name)}&size=1200&background=random`;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-[#0e0e0e]/40 to-transparent"></div>
        </div>
        <div className="absolute bottom-0 left-0 w-full p-8 pb-16 container mx-auto flex flex-col items-start z-10">
            
            <div className="flex items-center gap-2 mb-4">
                <span className="bg-blue-500 text-white p-1 rounded-full">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span className="text-sm font-medium tracking-widest uppercase text-white/80">Artiste Vérifié</span>
            </div>

            <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter mb-6 drop-shadow-2xl">
              {artist.name}
            </h1>

            <p className="text-zinc-300 text-lg max-w-2xl mb-4 drop-shadow-md">
              {artist.bio}
            </p>
            
            <div className="flex items-center gap-3 mb-8">
              <span className="px-3 py-1 bg-violet-600/20 border border-violet-500/30 rounded-full text-violet-300 text-sm font-bold">
                {artist.genre}
              </span>
              <span className="text-white/60 font-mono text-sm">
                14.5M AUDITEURS
              </span>
            </div>

            <div className="flex items-center gap-4 flex-wrap">
                <button 
                  onClick={handleOpenDeezer}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full px-8 py-4 font-bold text-lg flex items-center gap-3 transition-transform hover:scale-105 shadow-[0_0_40px_rgba(168,85,247,0.5)]"
                >
                   <Music size={24} />
                   ÉCOUTER SUR DEEZER
                </button>
                
                <button 
                  onClick={() => setIsLiked(!isLiked)}
                  className={`w-14 h-14 rounded-full border border-white/20 flex items-center justify-center transition backdrop-blur-sm ${
                    isLiked ? 'bg-red-500 border-red-500' : 'hover:bg-white/10'
                  }`}
                >
                   <Heart size={24} fill={isLiked ? 'currentColor' : 'none'} />
                </button>
                <button 
                  onClick={handleShare}
                  className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition backdrop-blur-sm"
                >
                   <Share2 size={24} />
                </button>
            </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 space-y-20 relative z-20 -mt-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                   <Music className="text-purple-500" /> Titres Populaires
                </h2>
                
                <div className="flex flex-col gap-2">
                   {artist.topTracks && artist.topTracks.length > 0 ? (
                      artist.topTracks.map((track, index) => (
                      <div 
                        key={index}
                        onClick={handleOpenDeezer}
                        className="group flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition cursor-pointer border border-transparent hover:border-white/5"
                      >
                          <span className="text-zinc-500 font-mono w-6 text-center group-hover:text-purple-400 transition">
                             <span className="group-hover:hidden">{index + 1}</span>
                             <Play size={16} className="hidden group-hover:block mx-auto" fill="currentColor"/>
                          </span>
                          
                          <img 
                            src={artist.image} 
                            alt="cover" 
                            className="w-12 h-12 rounded object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(track.title)}&size=100&background=random`;
                            }}
                          />
                          
                          <div className="flex-1 min-w-0">
                             <h3 className="font-bold text-white group-hover:text-purple-400 transition truncate">{track.title}</h3>
                             <span className="text-xs text-zinc-500 flex items-center gap-1">
                               <Music size={12} /> {track.plays} lectures
                             </span>
                          </div>
                          
                          <span className="text-zinc-500 text-sm font-mono hidden sm:block">{track.duration}</span>
                          <button className="opacity-0 group-hover:opacity-100 p-2 text-zinc-400 hover:text-white">
                             <Heart size={16} />
                          </button>
                      </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-zinc-500">
                        <p>Aucun titre disponible</p>
                      </div>
                    )}
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20">
                  <p className="text-sm text-zinc-300 text-center">
                    🎵 <strong>Cliquez sur "Écouter sur Deezer"</strong> pour lancer le lecteur et découvrir les meilleurs titres de {artist.name} !
                  </p>
                </div>
            </div>

            <div>
               <h2 className="text-2xl font-bold mb-6">À propos</h2>
               <div className="bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-3xl p-6 hover:border-purple-500/50 transition duration-500 group space-y-6">
                  
                  <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl relative">
                     <img 
                       src={artist.image} 
                       className="w-full h-full object-cover group-hover:scale-105 transition duration-700" 
                       alt="album"
                       onError={(e) => {
                         const target = e.target as HTMLImageElement;
                         target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(artist.name)}&size=600&background=random`;
                       }}
                     />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-bold mb-2">{artist.name}</h3>
                      <p className="text-zinc-400 text-sm leading-relaxed">{artist.bio}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 rounded-full bg-white/5 text-xs border border-white/10">{artist.genre}</span>
                      <span className="px-3 py-1 rounded-full bg-white/5 text-xs border border-white/10">Vérifié</span>
                      <span className="px-3 py-1 rounded-full bg-white/5 text-xs border border-white/10">Top 100</span>
                    </div>
                  </div>
               </div>
            </div>
        </div>

        <div>
           <h2 className="text-3xl font-bold mb-8 uppercase tracking-tight flex items-center gap-3">
             <Calendar className="text-purple-500" />
             Prochaines Dates
           </h2>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockConcerts.map((concert, index) => (
                <div 
                  key={index} 
                  className="p-6 rounded-2xl bg-gradient-to-br from-zinc-900 to-black border border-white/10 hover:border-purple-500/50 transition cursor-pointer group"
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-zinc-900 text-center px-4 py-3 rounded-xl group-hover:bg-purple-600 transition-colors flex-shrink-0">
                      <span className="block text-xs font-bold text-zinc-400 group-hover:text-white/80 uppercase">{concert.date.split(' ')[0]}</span>
                      <span className="block text-2xl font-black">{concert.date.split(' ')[1]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-lg mb-1 group-hover:text-purple-400 transition truncate">{concert.venue}</h4>
                      <p className="text-zinc-400 text-sm flex items-center gap-1">
                        <MapPin size={12} /> {concert.city}
                      </p>
                      <button className="mt-3 w-full px-4 py-2 bg-white/5 hover:bg-purple-600 rounded-lg text-sm font-bold transition border border-white/10">
                        Réserver
                      </button>
                    </div>
                  </div>
                </div>
              ))}
           </div>
        </div>

        <div className="pb-32">
           <h2 className="text-2xl font-bold mb-8">Artistes similaires</h2>
           <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
              {/* Correction: Sécurisation du filtre */}
              {mockArtists
                .filter(a => a.id !== artist.id && a.genre === artist.genre)
                .slice(0, 8)
                .map((similaire) => (
                 <div 
                   key={similaire.id} 
                   onClick={() => navigate(`/artist/${similaire.id}`)}
                   className="group flex flex-col items-center gap-3 cursor-pointer"
                 >
                    <div className="w-full aspect-square rounded-full overflow-hidden border-2 border-transparent group-hover:border-purple-500 transition-all duration-300 shadow-lg">
                       <img 
                         src={similaire.image} 
                         alt={similaire.name} 
                         className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                         onError={(e) => {
                           const target = e.target as HTMLImageElement;
                           target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(similaire.name)}&size=200&background=random`;
                         }}
                       />
                    </div>
                    <span className="text-xs font-bold text-zinc-400 group-hover:text-white transition text-center truncate w-full px-1">
                      {similaire.name}
                    </span>
                 </div>
              ))}
           </div>
        </div>

      </div>
    </div>
  );
}