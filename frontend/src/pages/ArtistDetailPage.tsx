import { useParams, useNavigate } from 'react-router-dom';
import { mockArtists } from '../data/mockData';
import { Play, Heart, Clock, MapPin, Calendar, Disc, Share2, MoreHorizontal } from 'lucide-react';
import Navbar from '../components/Navbar';
import { usePlayerStore } from '../stores/usePlayerStore';

export default function ArtistDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { play, currentTrack, isPlaying, toggle } = usePlayerStore();
  
  const artist = mockArtists.find(a => a.id === id);

  if (!artist) return <div className="text-white text-center mt-20">Artiste introuvable</div>;

  const handlePlayTrack = (track: any) => {
    play({
      title: track.title,
      artist: artist.name,
      image: artist.image,
      audioUrl: track.previewUrl || ""
    });
  };

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white overflow-x-hidden">
      <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/30 border-b border-white/5 transition-all duration-300">
        <Navbar />
      </div>

      <div className="relative h-[85vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={artist.image} 
            alt={artist.name} 
            className="w-full h-full object-cover animate-slow-zoom" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-[#0e0e0e]/40 to-transparent"></div>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-8 pb-16 container mx-auto flex flex-col items-start z-10 animate-fade-in">
            
            <div className="flex items-center gap-2 mb-4">
                <span className="bg-blue-500 text-white p-1 rounded-full"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg></span>
                <span className="text-sm font-medium tracking-widest uppercase text-white/80">Artiste Vérifié</span>
            </div>

            <h1 className="text-7xl md:text-9xl font-black uppercase tracking-tighter mb-6 drop-shadow-2xl">
              {artist.name}
            </h1>

            <p className="text-zinc-300 text-lg max-w-2xl mb-8 line-clamp-2 drop-shadow-md">
              {artist.bio}
            </p>
            <p className="text-white/60 font-mono text-sm mb-8">
               14,583,902 AUDITEURS MENSUELS
            </p>

            <div className="flex items-center gap-4">
                <button 
                  onClick={() => handlePlayTrack(artist.topTracks[0])}
                  className="bg-violet-600 hover:bg-violet-500 text-white rounded-full px-8 py-4 font-bold text-lg flex items-center gap-3 transition-transform hover:scale-105 shadow-[0_0_40px_rgba(124,58,237,0.5)]"
                >
                   <Play fill="currentColor" size={24} /> ÉCOUTER
                </button>
                
                <button className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition backdrop-blur-sm">
                   <Heart size={24} />
                </button>
                <button className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition backdrop-blur-sm">
                   <Share2 size={24} />
                </button>
            </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 space-y-20 relative z-20 -mt-10">
        
        <div className="flex flex-col lg:flex-row gap-12">

            <div className="flex-1 animate-fade-in delay-100">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                   <Disc className="text-violet-500" /> Titres Populaires
                </h2>
                
                <div className="flex flex-col gap-2">
                   {artist.topTracks.map((track, index) => (
                      <div 
                        key={index}
                        onClick={() => handlePlayTrack(track)}
                        className="group flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition cursor-pointer border border-transparent hover:border-white/5"
                      >
                         <span className="text-zinc-500 font-mono w-6 text-center group-hover:text-violet-400 transition">
                            <span className="group-hover:hidden">{index + 1}</span>
                            <Play size={16} className="hidden group-hover:block mx-auto" fill="currentColor"/>
                         </span>
                         
                         <img src={artist.image} alt="cover" className="w-12 h-12 rounded object-cover" />
                         
                         <div className="flex-1">
                            <h3 className="font-bold text-white group-hover:text-violet-400 transition">{track.title}</h3>
                            <span className="text-xs text-zinc-500">145M lectures</span>
                         </div>
                         
                         <span className="text-zinc-500 text-sm font-mono">{track.duration}</span>
                         <button className="opacity-0 group-hover:opacity-100 p-2 text-zinc-400 hover:text-white">
                            <Heart size={16} />
                         </button>
                      </div>
                   ))}
                   {[3,4,5].map(i => (
                     <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition cursor-pointer opacity-50">
                        <span className="text-zinc-500 font-mono w-6 text-center">{i}</span>
                        <div className="w-12 h-12 rounded bg-zinc-800"></div>
                        <div className="flex-1"><div className="h-4 w-32 bg-zinc-800 rounded"></div></div>
                        <span className="text-zinc-500 text-sm">--:--</span>
                     </div>
                   ))}
                </div>
            </div>

            <div className="w-full lg:w-1/3 animate-fade-in delay-200">
               <h2 className="text-2xl font-bold mb-6">Dernière Sortie</h2>
               <div className="bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-3xl p-6 hover:border-violet-500/50 transition duration-500 group cursor-pointer">
                  <div className="aspect-square rounded-2xl overflow-hidden mb-6 shadow-2xl relative">
                     <img src={artist.image} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" alt="album" />
                     <div className="absolute bottom-4 right-4 bg-violet-600 text-black p-3 rounded-full opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
                        <Play fill="currentColor" size={20} />
                     </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-1">Jefe (Réédition)</h3>
                  <p className="text-zinc-400 text-sm mb-4">Album • 2024</p>
                  <div className="flex gap-2">
                     <span className="px-3 py-1 rounded-full bg-white/5 text-xs border border-white/10">Rap FR</span>
                     <span className="px-3 py-1 rounded-full bg-white/5 text-xs border border-white/10">Trap</span>
                  </div>
               </div>
            </div>
        </div>

        <div className="animate-fade-in delay-300">
           <h2 className="text-3xl font-bold mb-8 uppercase tracking-tight">Tournée 2026</h2>
           
           <div className="flex flex-col lg:flex-row gap-6 h-[500px]">
              
              <div className="w-full lg:w-1/3 bg-[#121212] rounded-3xl p-2 overflow-y-auto custom-scrollbar border border-white/5">
                 {[1,2,3,4,5,6].map((date) => (
                    <div key={date} className="p-4 rounded-2xl hover:bg-white/5 transition cursor-pointer flex items-center gap-4 group border-b border-white/5 last:border-0">
                       <div className="bg-zinc-900 text-center px-4 py-2 rounded-xl group-hover:bg-violet-600 transition-colors">
                          <span className="block text-sm font-bold text-zinc-400 group-hover:text-white/80">MAI</span>
                          <span className="block text-xl font-black">{12 + date}</span>
                       </div>
                       <div>
                          <h4 className="font-bold text-lg">Accor Arena</h4>
                          <p className="text-zinc-400 text-sm flex items-center gap-1"><MapPin size={12} /> Paris, France</p>
                       </div>
                    </div>
                 ))}
              </div>

              <div className="w-full lg:w-2/3 bg-zinc-800 rounded-3xl overflow-hidden relative border border-white/10 grayscale hover:grayscale-0 transition-all duration-700">
                 <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/e/ec/Paris_night_map.png" 
                    className="w-full h-full object-cover opacity-60"
                    alt="Map" 
                 />
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="relative">
                        <span className="absolute -inset-4 bg-violet-500/30 rounded-full animate-ping"></span>
                        <MapPin size={48} className="text-violet-500 drop-shadow-[0_0_15px_rgba(139,92,246,1)]" fill="currentColor" />
                    </div>
                 </div>
                 <div className="absolute bottom-6 left-6 bg-black/80 backdrop-blur px-6 py-3 rounded-xl border border-white/10">
                    <p className="font-bold text-white">Paris, Accor Arena</p>
                    <p className="text-xs text-violet-400">Prochaine date • 24 Mai 2026</p>
                 </div>
              </div>

           </div>
        </div>

        <div className="pb-32 animate-fade-in delay-300">
           <h2 className="text-2xl font-bold mb-8">Les fans écoutent aussi</h2>
           <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
              {mockArtists.filter(a => a.id !== artist.id).map((similaire) => (
                 <div 
                    key={similaire.id} 
                    onClick={() => navigate(`/artist/${similaire.id}`)}
                    className="group flex flex-col items-center gap-3 cursor-pointer min-w-[120px]"
                 >
                    <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-transparent group-hover:border-violet-500 transition-all duration-300 shadow-lg">
                       <img src={similaire.image} alt={similaire.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                    </div>
                    <span className="text-sm font-bold text-zinc-400 group-hover:text-white transition">{similaire.name}</span>
                 </div>
              ))}
           </div>
        </div>

      </div>
    </div>
  );
}