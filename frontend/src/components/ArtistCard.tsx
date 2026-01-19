import { Play } from 'lucide-react';
import { usePlayerStore } from '../stores/usePlayerStore';

interface ArtistCardProps {
  id: string;
  name: string;
  image: string;
  category: string;
}

export default function ArtistCard({ id, name, image, category }: ArtistCardProps) {
  // On récupère la fonction play du store
  const { play } = usePlayerStore();

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault(); // Empêche de cliquer sur le lien de la carte
    e.stopPropagation();
    
    // On lance la musique !
    play({
      title: `Mix de ${name}`,
      artist: name,
      image: image,
    });
  };

  return (
    <div className="group relative flex flex-col gap-3 cursor-pointer p-4 rounded-3xl hover:bg-white/5 transition-colors duration-300">
      
      {/* Image avec effet Glow */}
      <div className="relative aspect-square overflow-hidden rounded-full shadow-lg group-hover:shadow-[0_0_30px_rgba(124,58,237,0.3)] transition-all duration-500">
        <img 
          src={image} 
          alt={name} 
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-2"
        />
        
        {/* Overlay Noir au survol */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
          
          {/* Bouton Play Interactif */}
          <button 
            onClick={handlePlay}
            className="h-14 w-14 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-600 text-white flex items-center justify-center shadow-lg transform translate-y-8 group-hover:translate-y-0 transition-all duration-300 hover:scale-110 hover:shadow-glow-violet"
          >
            <Play fill="currentColor" className="ml-1 h-6 w-6" />
          </button>
        </div>
      </div>

      <div className="text-center space-y-1">
        <h3 className="font-bold text-white text-lg group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-violet-400 group-hover:to-fuchsia-400 transition-all">
          {name}
        </h3>
        <p className="text-sm text-zinc-500 font-medium tracking-wide uppercase">{category}</p>
      </div>
    </div>
  );
}