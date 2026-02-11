import { Link } from 'react-router-dom';
import Podium from '../components/Podium';
import ArtistMarquee from '../components/ArtistMarquee';
import { mockArtists } from '../data/mockData';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  const topArtists = mockArtists.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white overflow-x-hidden font-sans">

      {/* Hero Section */}
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

      {/* Marquee Section */}
      <div className="py-10 border-y border-white/5 bg-[#0a0a0a] relative z-0 mb-16">
        <ArtistMarquee artists={mockArtists} />
      </div>

      {/* Artistes du Moment Section */}
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

      </div>

    </div>
  );
}