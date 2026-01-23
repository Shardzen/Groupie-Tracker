import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Play, Clock, Heart, MoreHorizontal, CheckCircle2, Music2 } from 'lucide-react';
import { usePlayerStore } from '../stores/usePlayerStore';
import { mockArtists } from '../data/mockData';

interface ArtistAPI {
  id: number;
  name: string;
  image: string;
  members: string[];
  creationDate: number;
  firstAlbum: string;
  locations: string[];
  concertDates: string[];
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://groupietrackers.herokuapp.com/api';

export default function ArtistDetailPage() {
  const { id } = useParams();
  const { play } = usePlayerStore();
  
  // États
  const [artistAPI, setArtistAPI] = useState<ArtistAPI | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [headerOpacity, setHeaderOpacity] = useState(0);

  const richArtist = mockArtists.find(a => a.id === id) || mockArtists[0]; // Fallback sur le premier si pas trouvé pour la démo

  useEffect(() => {
    const handleScroll = () => {
      const scroll = window.scrollY;
      setHeaderOpacity(Math.min(scroll / 300, 1));
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/artists/${id}`);
        if (response.ok) {
          const data = await response.json();
          setArtistAPI(data);
        }
      } catch (error) {
        console.error("Mode démo : API non accessible ou ID mock utilisé");
      }
    };
    fetchArtist();
  }, [id]);

  const displayImage = artistAPI?.image || richArtist.image;
  const displayName = artistAPI?.name || richArtist.name;

  return (
    <div className="min-h-screen bg-[#121212] text-white pb-32">
      <div 
        className="fixed top-0 left-0 right-0 h-20 z-40 transition-colors duration-300 flex items-center px-6"
        style={{ backgroundColor: `rgba(0, 0, 0, ${headerOpacity})` }}
      >
        <Link to="/" className="p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <span 
          className="ml-4 font-bold text-xl transition-opacity duration-300"
          style={{ opacity: headerOpacity }}
        >
          {displayName}
        </span>
      </div>

      <div className="relative h-[60vh] min-h-[400px] w-full group">
        <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${displayImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#121212]/40 to-[#121212]" />
        
        <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full animate-in slide-in-from-bottom-10 fade-in duration-700">
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider mb-2">
                <CheckCircle2 className="text-blue-400 w-5 h-5 fill-blue-400 text-white" />
                Artiste Vérifié
            </div>
            <h1 className="text-6xl md:text-9xl font-black mb-6 drop-shadow-2xl">{displayName}</h1>
            <p className="text-zinc-300 max-w-2xl text-lg line-clamp-2 md:line-clamp-none mb-4">
                {richArtist.bio}
            </p>
            <div className="text-sm font-semibold text-zinc-400">
               <span className="text-white">24,589,102</span> auditeurs par mois
            </div>
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        <div className="flex items-center gap-6 mb-12">
            <button 
                onClick={() => play({ title: `Mix de ${displayName}`, artist: displayName, image: displayImage })}
                className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-400 text-black flex items-center justify-center shadow-lg hover:scale-105 transition-all"
            >
                <Play fill="currentColor" size={28} className="ml-1" />
            </button>
            <button 
                onClick={() => setIsLiked(!isLiked)} 
                className={`p-2 border-2 rounded-full transition-colors ${isLiked ? 'border-green-500 text-green-500' : 'border-zinc-500 text-zinc-400 hover:text-white hover:border-white'}`}
            >
                <Heart size={28} fill={isLiked ? "currentColor" : "none"} />
            </button>
            <button className="text-zinc-400 hover:text-white">
                <MoreHorizontal size={32} />
            </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
            
            <div className="lg:col-span-2 space-y-12">
                
                <section>
                    <h2 className="text-2xl font-bold mb-6">Populaires</h2>
                    <div className="space-y-1">
                        {richArtist.topTracks.map((track, index) => (
                            <div 
                                key={index}
                                onClick={() => play({ title: track.title, artist: displayName, image: displayImage })}
                                className="group flex items-center justify-between p-3 rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <span className="w-4 text-center text-zinc-500 group-hover:hidden">{index + 1}</span>
                                    <Play size={16} className="hidden group-hover:block text-white" fill="currentColor" />
                                    <div className="w-12 h-12 rounded bg-white/10 overflow-hidden">
                                        <img src={displayImage} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="font-medium text-white group-hover:text-green-400 transition-colors">
                                        {track.title}
                                    </div>
                                </div>
                                <div className="flex items-center gap-8 text-sm text-zinc-400">
                                    <span className="hidden md:block">{track.plays}</span>
                                    <span>{track.duration}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                     <h2 className="text-2xl font-bold mb-4">À propos</h2>
                     <div className="bg-[#1e1e1e] rounded-2xl overflow-hidden cursor-pointer hover:bg-[#2a2a2a] transition-colors group relative">
                        <div className="h-64 overflow-hidden relative">
                             <img src={displayImage} className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" />
                             <div className="absolute inset-0 bg-gradient-to-t from-[#1e1e1e] to-transparent" />
                             <div className="absolute bottom-6 left-6 right-6">
                                 <p className="text-white line-clamp-3 font-medium text-lg leading-relaxed">{richArtist.bio}</p>
                             </div>
                        </div>
                     </div>
                </section>

            </div>

            <div className="space-y-8">
                
                <div className="bg-[#1e1e1e] p-6 rounded-2xl space-y-4">
                    <h3 className="font-bold text-xl mb-4">Infos Artiste</h3>
                    <div className="flex items-center gap-3 text-zinc-300">
                        <Calendar className="text-zinc-500" />
                        <span>Début : {artistAPI?.creationDate || "2015"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-zinc-300">
                        <MapPin className="text-zinc-500" />
                        <span>Origine : {artistAPI?.locations?.[0] || "Paris, France"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-zinc-300">
                        <Music2 className="text-zinc-500" />
                        <span>1er Album : {artistAPI?.firstAlbum || "Inconnu"}</span>
                    </div>
                </div>

                <div>
                    <h3 className="font-bold text-xl mb-4">En tournée</h3>
                    <div className="space-y-3">
                        {richArtist.upcomingDates.map((date) => (
                            <Link to="/tickets" key={date.id} className="block bg-[#1e1e1e] hover:bg-[#2a2a2a] p-4 rounded-xl transition-colors group">
                                <div className="font-bold text-white text-lg mb-1 flex items-center gap-2">
                                    <span className="text-green-500 group-hover:text-green-400">
                                        {new Date(date.date).getDate()}
                                    </span>
                                    {new Date(date.date).toLocaleString('default', { month: 'short' }).toUpperCase()}
                                </div>
                                <div className="text-zinc-300 font-medium">{date.venue}</div>
                                <div className="text-zinc-500 text-sm flex items-center gap-1 mt-1">
                                    <MapPin size={12} /> {date.city}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

            </div>
        </div>
      </div>
    </div>
  );
}