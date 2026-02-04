import { Link } from 'react-router-dom';
import Podium from '../components/Podium';
import ArtistMarquee from '../components/ArtistMarquee';
import { mockArtists } from '../data/mockData';
import { ArrowRight, Music, Heart } from 'lucide-react';

export default function Home() {
  const topArtists = mockArtists.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white overflow-x-hidden font-sans">
      
      {/* NOTE : J'ai retiré la Navbar ici car elle est gérée par le Layout */}

      <div className="relative pt-40 pb-20 px-6 container mx-auto flex flex-col items-center justify-center text-center z-10 min-h-[70vh]">
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="mb-8 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 backdrop-blur-sm animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
            </span>
            <span className="text-xs font-bold text-violet-300 uppercase tracking-widest">Saison 2026</span>
        </div>

        <h1 className="relative text-6xl md:text-9xl font-black uppercase tracking-tighter leading-[0.9] mb-8 animate-fade-in-up delay-100">
          Là où la musique <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
            prend vie.
          </span>
        </h1>

        <p className="relative text-xl md:text-2xl text-zinc-400 max-w-2xl font-light animate-fade-in-up delay-200">
          Découvrez les artistes qui façonnent le son de demain. <br/>
          Réservez vos billets. Vivez l'expérience.
        </p>

        <div className="mt-10 flex gap-4 animate-fade-in-up delay-300 relative z-20">
            <Link to="/artists">
                <button className="px-8 py-4 bg-white text-black rounded-full font-bold hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                    Explorer
                </button>
            </Link>
            <Link to="/concerts">
                <button className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full font-bold hover:bg-white/10 transition-colors backdrop-blur-md">
                    Voir les concerts
                </button>
            </Link>
        </div>
      </div>

      <div className="py-10 border-y border-white/5 bg-[#0a0a0a] relative z-0 mb-16">
        <ArtistMarquee artists={mockArtists} />
      </div>

      <div className="container mx-auto px-6 relative z-10 pb-32">
        
        <div className="mb-32">
           <div className="flex items-center justify-between mb-12">
             <div>
               <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-4">
                 Artistes du <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Moment</span>
               </h2>
               <p className="text-zinc-400 text-lg">Les talents qui dominent la scène actuelle.</p>
             </div>
             <Link to="/artists">
                 <button className="hidden md:flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 hover:bg-white/5 transition-colors group">
                   Voir tout le catalogue <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                 </button>
             </Link>
           </div>

           <Podium artists={topArtists} />
        </div>

        <div className="relative bg-gradient-to-br from-[#18181b] to-[#0e0e0e] rounded-[3rem] p-12 md:p-20 overflow-hidden border border-white/10 text-center">
           <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-[120px] -z-10 opacity-60 animate-pulse-slow"></div>
           <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-[120px] -z-10 opacity-60 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

           <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-tight">
             Transfère ta <br className="md:hidden" />
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-white">
                 bibliothèque musicale.
             </span>
           </h2>
           <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-16">
             Importe tes playlists, tes artistes favoris et tes likes depuis tes anciennes plateformes en quelques clics.
           </p>

           <div className="relative max-w-3xl mx-auto h-64 flex items-center justify-center mb-12">
             <div className="absolute left-0 md:left-10 top-10 animate-float-slow">
                 <div className="w-16 h-16 bg-[#1db954]/20 rounded-2xl flex items-center justify-center border border-[#1db954]/30 shadow-[0_0_30px_rgba(29,185,84,0.2)]">
                    <Music className="w-8 h-8 text-[#1db954]" />
                 </div>
             </div>
             <div className="absolute left-20 bottom-0 animate-float-slow" style={{ animationDelay: '1s' }}>
                 <div className="w-14 h-14 bg-[#fc3c44]/20 rounded-2xl flex items-center justify-center border border-[#fc3c44]/30 shadow-[0_0_30px_rgba(252,60,68,0.2)]">
                    <Music className="w-7 h-7 text-[#fc3c44]" />
                 </div>
             </div>

             <div className="relative z-10 bg-[#0e0e0e] p-8 rounded-3xl border border-white/10 shadow-2xl flex flex-col items-center">
                 <div className="flex items-center gap-6 mb-6">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                       <Music className="w-6 h-6 text-zinc-400" />
                    </div>
                    <ArrowRight className="w-6 h-6 text-violet-500 animate-pulse" />
                    <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30">
                       <Heart className="w-6 h-6 text-white fill-white" />
                    </div>
                 </div>
                 <div className="w-64 h-4 bg-white/5 rounded-full overflow-hidden relative">
                    <div className="absolute top-0 left-0 h-full w-[70%] bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full animate-loading-bar"></div>
                 </div>
                 <p className="text-3xl font-black mt-4">70%</p>
                 <p className="text-xs text-zinc-500 uppercase tracking-widest mt-2">Transfert en cours...</p>
             </div>

             <div className="absolute right-0 md:right-10 top-10 animate-float-slow" style={{ animationDelay: '0.5s' }}>
                 <div className="w-20 h-20 bg-violet-600/20 rounded-3xl flex items-center justify-center border border-violet-500/30 shadow-[0_0_40px_rgba(139,92,246,0.3)]">
                    {mockArtists[0] ? (
                        <img src={mockArtists[0].image} alt="Cover" className="w-full h-full object-cover rounded-2xl opacity-80" />
                    ) : (
                        <Heart className="w-10 h-10 text-violet-400" />
                    )}
                 </div>
             </div>
           </div>

           <button className="px-10 py-4 bg-white text-black rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_50px_rgba(255,255,255,0.4)]">
             Commencer le transfert
           </button>
        </div>
      </div>

      {/* NOTE : Le Footer a été supprimé d'ici car il est dans le Layout */}

    </div>
  );
}