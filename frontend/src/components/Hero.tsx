import { Play } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative h-[80vh] w-full overflow-hidden flex items-center justify-center">
      
      {/* BACKGROUND VIDEO */}
      <div className="absolute inset-0 z-0">
         <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-full object-cover scale-105 opacity-60"
         >
            {/* Vidéo libre de droits (Concert crowd) */}
            <source src="https://videos.pexels.com/video-files/2034810/2034810-hd_1920_1080_30fps.mp4" type="video/mp4" />
         </video>
         {/* Overlay sombre pour que le texte ressorte */}
         <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-[#0e0e0e]/50 to-transparent"></div>
         <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"></div>
      </div>

      {/* CONTENT */}
      <div className="relative z-10 text-center px-4 animate-fade-in-up">
        <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md">
            <span className="text-xs font-bold tracking-[0.2em] text-violet-300 uppercase">Saison 2026</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white mb-6 drop-shadow-2xl">
          LÀ OÙ LA MUSIQUE <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-white animate-pulse-slow">
            PREND VIE.
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
          Découvrez les artistes qui façonnent le son de demain. <br/> 
          Réservez vos billets. Vivez l'expérience.
        </p>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <button className="group relative px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.3)] overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">
                    <Play fill="currentColor" size={20} /> Commencer l'écoute
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-fuchsia-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            
            <button className="px-8 py-4 rounded-full font-bold text-lg border border-white/30 hover:bg-white/10 backdrop-blur-md transition-all">
                Voir les Concerts
            </button>
        </div>
      </div>
    </div>
  );
}