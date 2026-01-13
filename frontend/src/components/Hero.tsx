import { useState, useEffect } from 'react';
import { Sparkles, Music, Ticket, TrendingUp, Play, ChevronDown } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    { icon: Music, text: '500+ Artistes', color: 'from-violet-500 to-purple-500' },
    { icon: Ticket, text: 'Billets Premium', color: 'from-pink-500 to-rose-500' },
    { icon: TrendingUp, text: 'Tendances Live', color: 'from-blue-500 to-cyan-500' },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated Background Gradient */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)`,
          transition: 'background 0.3s ease',
        }}
      ></div>

      {/* Geometric Shapes Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large rotating circle */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-gradient-to-br from-pink-500/10 to-rose-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 grid-pattern opacity-20"></div>
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-violet-400/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect mb-8 animate-fadeInScale animate-delay-100">
            <Sparkles className="w-4 h-4 text-violet-400 animate-pulse" />
            <span className="text-sm font-semibold text-slate-300">
              Plateforme #1 d'événements musicaux en France
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-6xl md:text-8xl font-black mb-6 animate-fadeIn">
            <span className="block text-white text-display mb-2">
              Vivez la
            </span>
            <span className="block gradient-text text-display animate-shimmer">
              Musique Autrement
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed animate-fadeIn animate-delay-200">
            Découvrez les plus grands artistes internationaux, réservez vos places pour des concerts inoubliables et vivez des expériences musicales uniques.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fadeIn animate-delay-300">
            <Link to="/artists">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold rounded-2xl transition-all duration-300 shadow-2xl shadow-violet-500/50 hover:shadow-violet-500/70 hover:scale-105 flex items-center gap-3">
                <Sparkles className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                <span>Explorer les Artistes</span>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </button>
            </Link>

            <button className="group px-8 py-4 bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/20 hover:border-violet-500/50 text-white font-bold rounded-2xl transition-all duration-300 flex items-center gap-3 hover:scale-105">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-4 h-4 text-white ml-0.5" fill="white" />
              </div>
              <span>Voir la Démo</span>
            </button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 animate-fadeIn animate-delay-400">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="glass-card p-6 rounded-2xl group hover:scale-105 transition-all duration-300"
                  style={{ animationDelay: `${400 + index * 100}ms` }}
                >
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-white font-semibold text-lg">{feature.text}</p>
                </div>
              );
            })}
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-8 mb-16 animate-fadeIn animate-delay-500">
            {[
              { value: '500K+', label: 'Utilisateurs actifs' },
              { value: '1000+', label: 'Concerts organisés' },
              { value: '99%', label: 'Satisfaction client' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-black gradient-text mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Scroll Indicator */}
          <div className="animate-fadeIn animate-delay-500">
            <div className="inline-flex flex-col items-center gap-2 text-slate-400 hover:text-white transition-colors cursor-pointer group">
              <span className="text-sm font-medium">Découvrez plus</span>
              <ChevronDown className="w-6 h-6 animate-bounce group-hover:translate-y-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Decorative bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none"></div>
    </section>
  );
}
