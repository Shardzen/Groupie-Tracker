import { useNavigate } from 'react-router-dom';
import { Artist } from '../data/mockData';
import { Play } from 'lucide-react';

interface PodiumProps {
  artists: Artist[];
}

export default function Podium({ artists }: PodiumProps) {
  const navigate = useNavigate();
  
  const top3 = artists.slice(0, 3);
  const [winner, second, third] = top3;

  return (
    <div className="w-full py-10">
       <h2 className="text-3xl font-bold text-center mb-12 font-display uppercase">Les plus écoutés <span className="text-violet-500">ce mois-ci</span></h2>
       
       <div className="flex flex-wrap justify-center items-end gap-4 md:gap-8 px-4 h-[500px]">
          
          <div 
            onClick={() => navigate(`/artist/${second.id}`)}
            className="group relative w-1/3 max-w-[200px] cursor-pointer"
          >
             <div className="text-center mb-4 font-bold text-zinc-500 text-xl">#2</div>
             <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 group-hover:border-white/30 transition-all duration-300">
                <img src={second.image} alt={second.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                   <h3 className="font-bold text-xl">{second.name}</h3>
                </div>
             </div>
          </div>

          <div 
            onClick={() => navigate(`/artist/${winner.id}`)}
            className="group relative w-1/3 max-w-[280px] -mt-12 z-10 cursor-pointer"
          >
             <div className="flex justify-center mb-4">
                <span className="bg-yellow-400 text-black font-black px-4 py-1 rounded-full text-sm uppercase tracking-wider flex items-center gap-2">
                   <Play size={12} fill="currentColor" /> Top 1
                </span>
             </div>
             
             <div className="absolute inset-0 bg-violet-600/30 blur-[50px] rounded-full pointer-events-none"></div>

             <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border-2 border-violet-500 shadow-[0_0_30px_rgba(124,58,237,0.3)] transition-all duration-300 group-hover:scale-105">
                <img src={winner.image} alt={winner.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-violet-900/80 via-transparent to-transparent flex items-end p-6">
                   <div>
                      <h3 className="font-black text-3xl md:text-4xl uppercase italic">{winner.name}</h3>
                      <p className="text-violet-200 text-sm font-medium mt-1">145M Écoutes</p>
                   </div>
                </div>
             </div>
          </div>

          <div 
            onClick={() => navigate(`/artist/${third.id}`)}
            className="group relative w-1/3 max-w-[200px] cursor-pointer"
          >
             <div className="text-center mb-4 font-bold text-zinc-500 text-xl">#3</div>
             <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 group-hover:border-white/30 transition-all duration-300">
                <img src={third.image} alt={third.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                   <h3 className="font-bold text-xl">{third.name}</h3>
                </div>
             </div>
          </div>

       </div>
    </div>
  );
}