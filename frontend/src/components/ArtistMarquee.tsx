import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Artist } from '../data/mockData';

interface ArtistMarqueeProps {
  artists: Artist[];
}

export default function ArtistMarquee({ artists }: ArtistMarqueeProps) {
  const navigate = useNavigate();
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);

  const scrollingArtists = [...artists, ...artists, ...artists];

  return (
    <div className="relative py-24 overflow-hidden group bg-[#0e0e0e]">
      
      <div 
        className={`pointer-events-none fixed inset-0 z-0 flex items-center justify-center transition-all duration-700 ease-in-out ${
          hoveredImage ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        {hoveredImage && (
           <div className="w-[450px] h-[550px] rounded-[2rem] overflow-hidden shadow-2xl rotate-3 relative">
             <img 
               src={hoveredImage} 
               alt="Artist Preview" 
               className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out scale-110" 
             />
             <div className="absolute inset-0 bg-violet-900/20 mix-blend-overlay"></div>
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
           </div>
        )}
      </div>

      <div className="relative z-10 flex whitespace-nowrap animate-marquee">
        {scrollingArtists.map((artist, index) => (
          <div
            key={`${artist.id}-${index}`}
            onMouseEnter={() => setHoveredImage(artist.image)}
            onMouseLeave={() => setHoveredImage(null)}
            onClick={() => navigate(`/artist/${artist.id}`)}
            className="inline-block px-12 cursor-pointer transition-opacity duration-500 hover:opacity-100 opacity-20"
          >
            <span className="text-[9rem] md:text-[11rem] font-display leading-none text-transparent text-stroke hover:text-white transition-colors duration-300 tracking-tighter">
              {artist.name}
            </span>
            <span className="text-4xl align-middle ml-12 text-violet-600">•</span>
          </div>
        ))}
      </div>
      
      <style>{`
        .text-stroke {
          -webkit-text-stroke: 2px rgba(255, 255, 255, 0.3);
        }
        .text-stroke:hover {
          -webkit-text-stroke: 0px;
        }
      `}</style>
    </div>
  );
}