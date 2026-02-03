import { useEffect, useRef } from 'react';
import { usePlayerStore } from '../stores/usePlayerStore';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';

export default function Player() {
  const { currentTrack, isPlaying, toggle } = usePlayerStore();
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Erreur lecture:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#181818] border-t border-white/10 px-4 py-3 z-50 animate-slide-up">
      
      <audio 
        ref={audioRef} 
        src={currentTrack.audioUrl} 
        onEnded={() => usePlayerStore.getState().pause()}
      />

      <div className="container mx-auto flex items-center justify-between">
        
        <div className="flex items-center gap-4 w-1/3">
          <div className="w-14 h-14 rounded overflow-hidden">
             <img src={currentTrack.image} alt={currentTrack.title} className="w-full h-full object-cover" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">{currentTrack.title}</h4>
            <p className="text-xs text-zinc-400">{currentTrack.artist}</p>
          </div>
        </div>

        <div className="flex flex-col items-center w-1/3">
          <div className="flex items-center gap-6">
            <button className="text-zinc-400 hover:text-white transition"><SkipBack size={20} /></button>
            
            <button 
              onClick={toggle}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-105 transition text-black"
            >
              {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
            </button>
            
            <button className="text-zinc-400 hover:text-white transition"><SkipForward size={20} /></button>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 w-1/3 text-zinc-400">
           <Volume2 size={20} />
           <div className="w-24 h-1 bg-zinc-600 rounded-full">
             <div className="w-2/3 h-full bg-white rounded-full"></div>
           </div>
        </div>
      </div>
    </div>
  );
}