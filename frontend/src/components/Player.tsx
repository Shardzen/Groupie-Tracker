import { useEffect, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Maximize2, X } from 'lucide-react';
import { usePlayerStore } from '../stores/usePlayerStore';

export default function Player() {
  const { currentSong, isPlaying, togglePlay, isExpanded, toggleExpand } = usePlayerStore();
  const [progress, setProgress] = useState(0);

  // Petite simulation de la barre de progression qui avance
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 0.2));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Si aucune chanson n'est lancée, on n'affiche pas le player
  if (!currentSong) return null;

  return (
    <>
      {/* --- VERSION MOBILE (EXPANDED) --- */}
      {isExpanded && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-3xl flex flex-col p-6 animate-in slide-in-from-bottom duration-300 md:hidden">
          <button 
            onClick={toggleExpand}
            className="self-end p-2 text-zinc-400 hover:text-white"
          >
            <X size={24} />
          </button>
          
          <div className="flex-1 flex flex-col items-center justify-center gap-8">
            <div className="w-64 h-64 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(124,58,237,0.3)]">
              <img src={currentSong.image} alt={currentSong.title} className="w-full h-full object-cover" />
            </div>
            
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-1">{currentSong.title}</h2>
              <p className="text-lg text-violet-400">{currentSong.artist}</p>
            </div>

            <div className="w-full space-y-4">
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 w-1/3" />
              </div>
              
              <div className="flex justify-center items-center gap-8">
                <SkipBack size={32} className="text-zinc-400" />
                <button 
                  onClick={togglePlay}
                  className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform"
                >
                  {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                </button>
                <SkipForward size={32} className="text-zinc-400" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- BARRE DE LECTURE (MINI PLAYER) --- */}
      <div 
        className="fixed bottom-0 left-0 right-0 z-40 bg-[#0a0a0a]/80 backdrop-blur-xl border-t border-white/10 pb-safe transition-transform duration-300"
        onClick={(e) => {
           // Sur mobile, cliquer sur la barre ouvre le grand player (sauf si on clique sur un bouton)
           if (window.innerWidth < 768 && !(e.target as HTMLElement).closest('button')) {
             toggleExpand();
           }
        }}
      >
        {/* Barre de progression fine tout en haut */}
        <div className="h-[2px] w-full bg-white/5 absolute top-0 left-0">
          <div 
            className="h-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-orange-500 shadow-[0_0_10px_rgba(168,85,247,0.5)] transition-all duration-100 ease-linear" 
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-4">
          
          {/* Info Artiste */}
          <div className="flex items-center gap-4 w-1/3">
            <div className={`relative h-12 w-12 rounded-lg overflow-hidden hidden sm:block ${isPlaying ? 'animate-pulse' : ''}`}>
              <img src={currentSong.image} alt="Cover" className="h-full w-full object-cover" />
            </div>
            <div className="overflow-hidden">
              <h4 className="font-bold text-white truncate text-sm md:text-base">{currentSong.title}</h4>
              <p className="text-xs text-zinc-400 truncate hover:text-violet-400 transition-colors cursor-pointer">{currentSong.artist}</p>
            </div>
          </div>

          {/* Contrôles (Centre) */}
          <div className="flex items-center justify-center gap-4 md:gap-6">
            <button className="text-zinc-400 hover:text-white transition-colors hidden md:block">
              <SkipBack size={20} />
            </button>
            
            <button 
              onClick={(e) => { e.stopPropagation(); togglePlay(); }}
              className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
            </button>

            <button className="text-zinc-400 hover:text-white transition-colors hidden md:block">
              <SkipForward size={20} />
            </button>
          </div>

          {/* Volume / Expand (Droite) */}
          <div className="flex items-center justify-end gap-3 w-1/3">
             <div className="hidden md:flex items-center gap-2 w-32 group">
                <Volume2 size={18} className="text-zinc-400" />
                <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden cursor-pointer">
                  <div className="h-full w-2/3 bg-zinc-500 group-hover:bg-violet-400 transition-colors" />
                </div>
             </div>
             
             <button 
               onClick={(e) => { e.stopPropagation(); toggleExpand(); }}
               className="p-2 text-zinc-400 hover:text-white md:hidden"
             >
               <Maximize2 size={20} />
             </button>
          </div>
        </div>
      </div>
    </>
  );
}