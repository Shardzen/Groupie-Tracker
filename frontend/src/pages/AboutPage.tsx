import Navbar from '../components/Navbar';
import { Heart, Users, Zap, Shield, Sparkles, Music, Globe, Award } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white overflow-hidden font-sans">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      <div className="relative pt-32 pb-20 px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-violet-600/20 rounded-full blur-[120px] -z-10 opacity-50"></div>

        <div className="max-w-4xl mx-auto text-center mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
            </span>
            <span className="text-xs font-bold tracking-widest uppercase text-zinc-300">Notre Mission</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-tight">
            Réinventer la <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-white">
              Culture Live.
            </span>
          </h1>
          
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed font-light">
            Nous sommes nés d'une frustration : la difficulté d'accéder aux événements qui nous font vibrer. Aujourd'hui, nous construisons le pont le plus direct entre les artistes et leurs fans.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          <div className="bg-[#18181b] border border-white/5 p-8 rounded-3xl hover:border-violet-500/30 transition-all duration-300 group">
            <div className="w-12 h-12 bg-violet-500/10 rounded-2xl flex items-center justify-center mb-6 text-violet-400 group-hover:scale-110 transition-transform">
              <Globe size={24} />
            </div>
            <h3 className="text-2xl font-bold mb-4">Mondial</h3>
            <p className="text-zinc-400 leading-relaxed">
              Une présence dans plus de 30 pays pour vous offrir les meilleures scènes, où que vous soyez.
            </p>
          </div>

          <div className="bg-[#18181b] border border-white/5 p-8 rounded-3xl hover:border-fuchsia-500/30 transition-all duration-300 group">
            <div className="w-12 h-12 bg-fuchsia-500/10 rounded-2xl flex items-center justify-center mb-6 text-fuchsia-400 group-hover:scale-110 transition-transform">
              <Zap size={24} />
            </div>
            <h3 className="text-2xl font-bold mb-4">Instantané</h3>
            <p className="text-zinc-400 leading-relaxed">
              Une technologie de pointe pour garantir des réservations en temps réel, sans file d'attente interminable.
            </p>
          </div>

          <div className="bg-[#18181b] border border-white/5 p-8 rounded-3xl hover:border-orange-500/30 transition-all duration-300 group">
            <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-6 text-orange-400 group-hover:scale-110 transition-transform">
              <Award size={24} />
            </div>
            <h3 className="text-2xl font-bold mb-4">Premium</h3>
            <p className="text-zinc-400 leading-relaxed">
              Des accès VIP, des rencontres artistes et des expériences exclusives réservées à notre communauté.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 mb-32">
          <div className="flex-1 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-[2rem] blur-2xl opacity-30"></div>
            <img 
              src="https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=2070&auto=format&fit=crop" 
              alt="Concert Crowd" 
              className="relative w-full rounded-[2rem] shadow-2xl border border-white/10 grayscale hover:grayscale-0 transition-all duration-700"
            />
          </div>
          <div className="flex-1 space-y-8">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">
              Plus qu'une billetterie, <br />
              <span className="text-violet-400">une communauté.</span>
            </h2>
            <p className="text-zinc-400 text-lg leading-relaxed">
              Groupie n'est pas seulement une plateforme technologique. C'est le rassemblement de passionnés qui croient que la musique live a le pouvoir de changer des vies.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="text-3xl font-black text-white">2M+</h4>
                <p className="text-sm text-zinc-500 uppercase tracking-wider font-bold">Utilisateurs Actifs</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-3xl font-black text-white">15k+</h4>
                <p className="text-sm text-zinc-500 uppercase tracking-wider font-bold">Événements / An</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-3xl font-black text-white">98%</h4>
                <p className="text-sm text-zinc-500 uppercase tracking-wider font-bold">Satisfaction Client</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-3xl font-black text-white">24/7</h4>
                <p className="text-sm text-zinc-500 uppercase tracking-wider font-bold">Support Dédié</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#18181b] to-[#0e0e0e] rounded-[2.5rem] p-12 text-center border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-[80px]"></div>
          
          <Sparkles className="w-12 h-12 text-violet-400 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Prêt à vivre l'expérience ?</h2>
          <p className="text-zinc-400 mb-10 max-w-xl mx-auto">
            Rejoignez des milliers de fans et accédez aux événements les plus exclusifs dès maintenant.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/artists" className="px-8 py-4 bg-white text-black rounded-full font-bold hover:scale-105 transition-transform">
              Explorer les Artistes
            </a>
            <a href="/tickets" className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full font-bold hover:bg-white/10 transition-colors">
              Voir les Offres Premium
            </a>
          </div>
        </div>

        <div className="mt-20 text-center border-t border-white/5 pt-8">
          <p className="text-zinc-600 text-sm flex items-center justify-center gap-2">
            Fait avec <Heart size={14} className="text-red-500 fill-red-500" /> par l'équipe Groupie Tracker
          </p>
        </div>
      </div>
    </div>
  );
}