import { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  const [isLoaded, setIsLoaded] = useState(false);

  const featured = {
    title: "Arctic Monkeys",
    subtitle: "Live in Paris 2026",
    description: "Plongez dans une expérience sonore inoubliable où la créativité rencontre l'excellence. Un spectacle qui redéfinit les limites de la performance live.",
    genre: "Rock • Alternative",
    rating: "★ 4.9",
    year: "2026",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1920&q=80"
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen w-full overflow-hidden">

      <div className="absolute inset-0 overflow-hidden">
        <div className="blob-artistic w-96 h-96 bg-violet-500 top-0 -left-48 opacity-20"></div>
        <div className="blob-artistic w-96 h-96 bg-fuchsia-500 top-20 right-0 opacity-20 animation-delay-2000"></div>
        <div className="blob-artistic w-96 h-96 bg-orange-500 bottom-0 left-1/3 opacity-20 animation-delay-4000"></div>
      </div>

      <div className="noise-overlay"></div>

      <div className="relative z-10 min-h-screen grid lg:grid-cols-2 gap-12 items-center px-4 md:px-12 lg:px-16 py-32">

        <div className={`space-y-8 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>

          <div className="flex items-center gap-4 flex-wrap">
            <div className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 border border-violet-500/30 rounded-full backdrop-blur-sm hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 text-violet-400 group-hover:rotate-12 transition-transform" />
              <span className="text-sm font-semibold text-violet-300">FEATURED</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 glass-artistic rounded-full">
              <TrendingUp className="w-4 h-4 text-fuchsia-400" />
              <span className="text-sm font-medium text-zinc-300">{featured.genre}</span>
            </div>
            <div className="px-4 py-2 glass-artistic rounded-full">
              <span className="text-sm font-medium text-orange-300">{featured.rating}</span>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="font-display text-6xl md:text-7xl lg:text-8xl font-black leading-none">
              <span className="block text-artistic-gradient text-artistic-glow animate-gradient">
                {featured.title}
              </span>
            </h1>
            <h2 className="text-3xl md:text-4xl font-bold text-white/90 font-display tracking-tight">
              {featured.subtitle}
            </h2>
          </div>

          <p className="text-lg md:text-xl text-zinc-300 leading-relaxed max-w-xl">
            {featured.description}
          </p>

          <div className="flex flex-col sm:flex-row items-start gap-4 pt-4">
            <Link to="/artists" className="w-full sm:w-auto">
              <button className="btn-artistic-primary w-full sm:w-auto group">
                <Zap className="inline-block w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                <span className="text-lg">Découvrir</span>
              </button>
            </Link>

            <Link to="/artists" className="w-full sm:w-auto">
              <button className="btn-artistic-outline w-full sm:w-auto group">
                <Sparkles className="inline-block w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                <span className="text-lg">Explorer</span>
              </button>
            </Link>
          </div>

          <div className="flex items-center gap-8 pt-8 flex-wrap">
            <div className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-3 h-3 bg-violet-500 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 w-3 h-3 bg-violet-500 rounded-full animate-ping opacity-75"></div>
              </div>
              <span className="text-sm font-semibold text-zinc-300 group-hover:text-white transition-colors">
                500+ Artistes
              </span>
            </div>
            <div className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-3 h-3 bg-fuchsia-500 rounded-full animate-pulse animation-delay-1000"></div>
                <div className="absolute inset-0 w-3 h-3 bg-fuchsia-500 rounded-full animate-ping opacity-75 animation-delay-1000"></div>
              </div>
              <span className="text-sm font-semibold text-zinc-300 group-hover:text-white transition-colors">
                Places limitées
              </span>
            </div>
            <div className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse animation-delay-2000"></div>
                <div className="absolute inset-0 w-3 h-3 bg-orange-500 rounded-full animate-ping opacity-75 animation-delay-2000"></div>
              </div>
              <span className="text-sm font-semibold text-zinc-300 group-hover:text-white transition-colors">
                Événements live
              </span>
            </div>
          </div>
        </div>

        <div className={`relative transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <div className="relative group">

            <div className="absolute -inset-4 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-orange-500 rounded-artistic opacity-20 blur-3xl group-hover:opacity-40 transition-opacity duration-500 animate-glow"></div>
            
            <div className="relative overflow-hidden rounded-artistic border-4 border-white/10 shadow-artistic-multi">

              <div className="aspect-[4/5] relative">
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="eager"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60"></div>

                <div className="absolute top-0 left-0 w-24 h-24 border-t-4 border-l-4 border-violet-500 rounded-tl-artistic"></div>
                <div className="absolute bottom-0 right-0 w-24 h-24 border-b-4 border-r-4 border-orange-500 rounded-br-artistic"></div>
                
                <div className="absolute top-6 right-6 px-4 py-2 bg-gradient-to-br from-violet-600/80 to-fuchsia-600/80 backdrop-blur-xl rounded-2xl border border-white/20 shadow-glow-violet">
                  <span className="text-sm font-bold text-white">{featured.year}</span>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-fuchsia-500 to-orange-500 rounded-full blur-3xl opacity-50 animate-pulse"></div>
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full blur-3xl opacity-50 animate-pulse animation-delay-1000"></div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-white/60 rounded-full animate-pulse"></div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none bg-gradient-to-t from-black to-transparent"></div>
    </section>
  );
}
