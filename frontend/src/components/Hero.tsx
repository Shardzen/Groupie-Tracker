import { useState, useEffect } from 'react';
import { Play, Info, Volume2, VolumeX } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  const featured = {
    title: "Arctic Monkeys",
    subtitle: "Live in Paris 2026",
    description: "Découvrez l'un des plus grands groupes rock de notre génération dans un concert exceptionnel à Paris. Une expérience inoubliable vous attend.",
    genre: "Rock • Alternative",
    rating: "★ 4.9",
    year: "2026",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1920&q=80"
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsVideoLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0">
        <div 
          className={`absolute inset-0 transition-opacity duration-1000 ${isVideoLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{
            backgroundImage: `url(${featured.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 30%',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20"></div>
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent"></div>
        </div>

        <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj4KICA8ZmlsdGVyIGlkPSJhIj4KICAgIDxmZVR1cmJ1bGVuY2UgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIiB0eXBlPSJmcmFjdGFsTm9pc2UiLz4KICAgIDxmZUNvbG9yTWF0cml4IHR5cGU9InNhdHVyYXRlIiB2YWx1ZXM9IjAiLz4KICA8L2ZpbHRlcj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjYSkiIG9wYWNpdHk9Ii4wNSIvPgo8L3N2Zz4=')] animate-grain"></div>
        </div>
      </div>

      <div className="relative z-10 h-full flex items-end pb-32 px-4 md:px-12 lg:px-16">
        <div className="max-w-2xl space-y-6 fade-in">
          <div className="flex items-center gap-4 text-sm">
            <span className="px-3 py-1 bg-red-600 text-white font-semibold rounded">
              FEATURED
            </span>
            <span className="text-zinc-300 font-medium">{featured.genre}</span>
            <span className="text-zinc-400">•</span>
            <span className="text-zinc-300 font-medium">{featured.rating}</span>
            <span className="text-zinc-400">•</span>
            <span className="text-zinc-300 font-medium">{featured.year}</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white text-shadow tracking-tight">
              {featured.title}
            </h1>
            <h2 className="text-2xl md:text-3xl font-bold text-zinc-300 text-shadow">
              {featured.subtitle}
            </h2>
          </div>

          <p className="text-base md:text-lg text-zinc-200 max-w-xl leading-relaxed text-shadow">
            {featured.description}
          </p>

          <div className="flex flex-col sm:flex-row items-start gap-4 pt-4">
            <Link to="/artists">
              <button className="group flex items-center gap-3 bg-white hover:bg-white/90 text-black font-bold px-8 py-4 rounded-md transition-all duration-200 hover:scale-105 shadow-xl">
                <Play className="w-6 h-6 fill-black group-hover:scale-110 transition-transform" />
                <span className="text-lg">Explorer</span>
              </button>
            </Link>

            <Link to="/artists">
              <button className="group flex items-center gap-3 bg-zinc-800/80 hover:bg-zinc-700/80 text-white font-semibold px-8 py-4 rounded-md transition-all duration-200 backdrop-blur-sm hover:scale-105 border border-zinc-600/50">
                <Info className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span className="text-lg">Plus d'infos</span>
              </button>
            </Link>
          </div>

          <div className="flex items-center gap-8 pt-6 text-sm text-zinc-300">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium">500+ Artistes disponibles</span>
            </div>
            <span className="text-zinc-500">•</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="font-medium">Places limitées</span>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => setIsMuted(!isMuted)}
        className="absolute bottom-32 right-8 md:right-12 z-20 p-3 rounded-full border-2 border-zinc-600 bg-black/40 backdrop-blur-sm hover:bg-black/60 hover:border-white transition-all duration-200 group"
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
        ) : (
          <Volume2 className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
        )}
      </button>

      <div className="absolute top-24 right-8 md:right-12 z-20 px-2 py-1 border-2 border-zinc-500 text-zinc-400 text-xs font-bold rounded">
        ALL
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none bg-gradient-to-t from-black to-transparent"></div>
    </section>
  );
}
