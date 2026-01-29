import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Artist } from '../data/mockData';

interface ArtistMarqueeProps {
  artists: Artist[];
}

export default function ArtistMarquee({ artists }: ArtistMarqueeProps) {
  const navigate = useNavigate();
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);

  // On duplique la liste pour l'effet "infini"
  const scrollingArtists = [...artists, ...artists, ...artists];

  return (
    <div className="relative py-20 overflow-hidden group">
      
      {/* L'image qui apparaît au survol (Background) */}
      <div className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-500 flex items-center justify-center">
        {hoveredImage && (
           <div className="w-[400px] h-[500px] rounded-2xl overflow-hidden shadow-2xl rotate-3 transition-transform duration-700">
             <img 
               src={hoveredImage} 
               alt="Artist Preview" 
               className="w-full h-full object-cover grayscale contrast-125"
             />
             {/* Petit filtre violet par dessus style Deezer */}
             <div className="absolute inset-0 bg-violet-600/20 mix-blend-overlay"></div>
           </div>
        )}
      </div>

      {/* Le texte qui défile */}
      <div className="relative z-10 flex whitespace-nowrap animate-marquee">
        {scrollingArtists.map((artist, index) => (
          <div
            key={`${artist.id}-${index}`}
            onMouseEnter={() => setHoveredImage(artist.image)}
            onMouseLeave={() => setHoveredImage(null)}
            onClick={() => navigate(`/artist/${artist.id}`)}
            className="inline-block px-8 cursor-pointer transition-opacity duration-300 hover:opacity-100 opacity-30"
          >
            <span className="text-[8rem] md:text-[10rem] font-display leading-none text-transparent text-stroke hover:text-white transition-colors duration-300">
              {artist.name}
            </span>
            {/* Petit point de séparation */}
            <span className="text-4xl align-middle ml-8 text-violet-500">•</span>
          </div>
        ))}
      </div>
      
      {/* Ajout d'une ligne pour le contour du texte (Stroke) */}
      <style>{`
        .text-stroke {
          -webkit-text-stroke: 2px rgba(255, 255, 255, 0.5);
        }
        .text-stroke:hover {
          -webkit-text-stroke: 0px;
        }
      `}</style>
    </div>
  );
}