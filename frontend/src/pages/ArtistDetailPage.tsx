import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Play, Heart, MoreHorizontal, CheckCircle2, Music2 } from 'lucide-react';
import { usePlayerStore } from '../stores/usePlayerStore';
import { mockArtists, Artist } from '../data/mockData';
import Navbar from '../components/Navbar';

export default function ArtistDetailPage() {
  const { id } = useParams();
  const { play } = usePlayerStore();
  

  const [isLiked, setIsLiked] = useState(false);
  const [headerOpacity, setHeaderOpacity] = useState(0);

  const localArtist = mockArtists.find(a => String(a.id) === String(id));

  useEffect(() => {
    const handleScroll = () => {
      setHeaderOpacity(Math.min(window.scrollY / 300, 1));
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!localArtist) {
      return <div className="text-white text-center pt-40">Artiste introuvable...</div>;
  }

  const artist = localArtist;

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white pb-32">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      <div 
        className="fixed top-0 left-0 right-0 h-24 z-40 transition-colors duration-300 pointer-events-none"
        style={{ backgroundColor: `rgba(14, 14, 14, ${headerOpacity})` }}
      />


      <div className="relative h-[60vh] min-h-[400px] w-full group">
        <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 group-hover:scale-105"
            style={{ backgroundImage: `url(${artist.image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-[#0e0e0e]/40 to-[#0e0e0e]" />
        
        <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full animate-in slide-in-from-bottom-10 fade-in duration-700">
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider mb-2 text-violet-400">
                <CheckCircle2 className="w-5 h-5 fill-current text-black" />
                Artiste Vérifié
            </div>
            <h1 className="text-6xl md:text-9xl font-black mb-6 drop-shadow-2xl uppercase tracking-tighter">
              {artist.name}
            </h1>
            <p className="text-zinc-300 max-w-2xl text-lg line-clamp-2 md:line-clamp-none mb-4 font-medium">
                {artist.bio}
            </p>
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10 -mt-10">
        
        <div className="flex items-center gap-6 mb-12">
            <button 
                onClick={() => play({ title: `Mix de ${artist.name}`, artist: artist.name, image: artist.image })}
                className="w-20 h-20 rounded-full bg-violet-600 hover:bg-violet-500 text-white flex items-center justify-center shadow-glow-violet hover:scale-110 transition-all duration-300"
            >
                <Play fill="currentColor" size={32} className="ml-2" />
            </button>
            <button 
                onClick={() => setIsLiked(!isLiked)} 
                className={`p-4 border-2 rounded-full transition-all duration-300 ${isLiked ? 'border-violet-500 text-violet-500 bg-violet-500/10' : 'border-white/20 text-white hover:border-white'}`}
            >
                <Heart size={28} fill={isLiked ? "currentColor" : "none"} />
            </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
            
            <div className="lg:col-span-2 space-y-8">
                <h2 className="text-3xl font-bold font-display">Populaires</h2>
                <div className="space-y-2">
                    {artist.topTracks && artist.topTracks.map((track, index) => (
                        <div 
                            key={index}
                                onClick={() => play({ 
                                title: track.title, 
                                artist: artist.name, 
                                image: artist.image, 
                                audioUrl: track.previewUrl || "" 
                            })}
                            className="group flex items-center justify-between p-4..."
                        >
                            <div className="flex items-center gap-6">
                                <span className="w-6 text-center text-zinc-500 font-bold group-hover:text-violet-500">{index + 1}</span>
                                <div className="relative w-14 h-14 rounded-lg overflow-hidden shadow-lg">
                                    <img src={artist.image} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <Play size={20} fill="currentColor" />
                                    </div>
                                </div>
                                <div>
                                  <div className="font-bold text-lg text-white group-hover:text-violet-400 transition-colors">
                                      {track.title}
                                  </div>
                                  <div className="text-sm text-zinc-500">Master Class • 2024</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-8 text-sm font-medium text-zinc-500">
                                <span className="hidden md:block">{track.plays}</span>
                                <span>{track.duration}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-8">
                <div className="bg-white/5 border border-white/10 p-8 rounded-3xl space-y-6">
                    <h3 className="font-bold text-2xl mb-4 font-display">Infos</h3>
                    <div className="flex items-center gap-4 text-zinc-300">
                        <div className="p-3 bg-white/5 rounded-full"><Music2 size={20} className="text-violet-400" /></div>
                        <div>
                          <p className="text-xs text-zinc-500 uppercase tracking-wider">Genre</p>
                          <p className="font-bold">{artist.genre}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-zinc-300">
                        <div className="p-3 bg-white/5 rounded-full"><MapPin size={20} className="text-fuchsia-400" /></div>
                        <div>
                          <p className="text-xs text-zinc-500 uppercase tracking-wider">Origine</p>
                          <p className="font-bold">France / Belgique</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}