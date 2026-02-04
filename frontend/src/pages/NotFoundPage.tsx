import { Link } from 'react-router-dom';
import { Home, Disc } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#0e0e0e] flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[100px] animate-pulse"></div>

      <div className="relative mb-8 animate-spin-slow">
         <Disc size={200} className="text-zinc-800" />
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl font-black text-white mix-blend-overlay">
            404
         </div>
      </div>

      <h1 className="text-4xl md:text-6xl font-black text-white mb-4 z-10">
        Mauvaise Piste.
      </h1>
      <p className="text-zinc-400 max-w-md mb-8 z-10">
        Il semblerait que ce vinyle soit rayé. La page que vous cherchez n'existe pas ou a été déplacée.
      </p>

      <Link to="/">
        <button className="flex items-center gap-2 px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-violet-400 hover:text-white transition-all z-10 relative shadow-xl">
            <Home size={20} /> Retour à l'accueil
        </button>
      </Link>
    </div>
  );
}