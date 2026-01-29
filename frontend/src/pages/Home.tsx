import { mockArtists } from '../data/mockData';
import ArtistMarquee from '../components/ArtistMarquee';
import Navbar from '../components/Navbar';
import Podium from '../components/Podium';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white overflow-x-hidden">
      
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      <div className="relative pt-40 pb-20 px-6 container mx-auto flex flex-col items-center justify-center text-center z-10 min-h-[60vh]">
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
            </span>
            <span className="text-xs font-bold text-violet-300 uppercase tracking-widest">Saison 2026</span>
        </div>

        <h1 className="relative text-6xl md:text-9xl font-black uppercase tracking-tighter leading-[0.9] mb-8">
          Là où la musique <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
            prend vie.
          </span>
        </h1>

        <p className="relative text-xl md:text-2xl text-zinc-400 max-w-2xl font-light">
          Découvrez les artistes qui façonnent le son de demain. <br/>
          Réservez vos billets. Vivez l'expérience.
        </p>
      </div>

      <div className="py-10 border-y border-white/5 bg-[#0a0a0a] relative z-0">
        <ArtistMarquee artists={mockArtists} />
      </div>

      <div className="container mx-auto px-6 py-24 relative z-10">
        <Podium artists={mockArtists} />
      </div>
      
    </div>
  );
}