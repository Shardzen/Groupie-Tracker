import { useState, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, Volume2, Maximize2, Heart } from "lucide-react";
import { Slider } from "../ui/slider";
import { cn } from "../../lib/utils";
import { usePlayerStore } from "../../stores/usePlayerStore"; // <--- On importe le cerveau

export function Player() {
  // On récupère les infos du Store au lieu du useState local
  const { isPlaying, currentSong, togglePlay, volume, setVolume } = usePlayerStore();
  
  const [progress, setProgress] = useState(30);
  const [isLiked, setIsLiked] = useState(false);

  // Simulation de la barre qui avance
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 0.1));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Si pas de chanson, on n'affiche rien (ou un player vide)
  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 h-24 bg-black border-t border-white/10 px-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-center backdrop-blur-lg bg-black/90 transition-all duration-500">
      
      {/* 1. GAUCHE : Infos venant du Store */}
      <div className="flex items-center gap-4">
        <div className="relative group h-14 w-14 rounded-md overflow-hidden bg-white/5 shadow-lg">
            <img 
                src={currentSong.image} 
                alt={currentSong.title} 
                className={cn("h-full w-full object-cover transition-opacity", isPlaying ? "animate-pulse-slow" : "")}
            />
        </div>
        
        <div className="hidden sm:block">
            <h4 className="text-sm font-bold text-white hover:underline cursor-pointer">{currentSong.title}</h4>
            <p className="text-xs text-gray-400 hover:text-white hover:underline cursor-pointer">{currentSong.artist}</p>
        </div>

        <button 
            onClick={() => setIsLiked(!isLiked)} 
            className={cn("ml-2 transition-colors", isLiked ? "text-primary" : "text-gray-400 hover:text-white")}
        >
            <Heart className={cn("h-5 w-5", isLiked && "fill-current")} />
        </button>
      </div>

      {/* 2. CENTRE : Contrôles */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-6">
            <button className="text-gray-400 hover:text-white transition-colors"><Shuffle className="h-4 w-4" /></button>
            <button className="text-gray-400 hover:text-white transition-colors hover:scale-110"><SkipBack className="h-5 w-5 fill-current" /></button>
            
            {/* Le bouton Play/Pause utilise maintenant l'action globale */}
            <button 
                onClick={togglePlay}
                className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-black hover:scale-105 transition-transform"
            >
                {isPlaying ? (
                    <Pause className="h-5 w-5 fill-current" />
                ) : (
                    <Play className="h-5 w-5 fill-current ml-1" />
                )}
            </button>

            <button className="text-gray-400 hover:text-white transition-colors hover:scale-110"><SkipForward className="h-5 w-5 fill-current" /></button>
            <button className="text-gray-400 hover:text-white transition-colors"><Repeat className="h-4 w-4" /></button>
        </div>

        <div className="w-full max-w-md flex items-center gap-2 text-xs text-gray-400 font-medium">
            <span>1:24</span>
            <Slider 
                value={progress} 
                max={100} 
                onChange={(e) => setProgress(Number(e.target.value))} 
                className="w-full"
            />
            <span>3:45</span>
        </div>
      </div>

      {/* 3. DROITE : Volume global */}
      <div className="hidden md:flex items-center justify-end gap-3">
        <Volume2 className="h-5 w-5 text-gray-400" />
        <div className="w-24">
            <Slider 
                value={volume} 
                max={100} 
                onChange={(e) => setVolume(Number(e.target.value))} 
            />
        </div>
        <button className="text-gray-400 hover:text-white ml-2"><Maximize2 className="h-4 w-4" /></button>
      </div>
    </div>
  );
}