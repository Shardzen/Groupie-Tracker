import { useState } from 'react';
import { Sparkles, MapPin, Users, Heart, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Artist {
  id: number;
  name: string;
  image: string;
  members: string[];
  creationDate: number;
  firstAlbum: string;
  locations: string[];
  concertDates: string[];
}

interface ArtistCardProps {
  artist: Artist;
}

export default function ArtistCard({ artist }: ArtistCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const randomGradients = [
    'from-violet-600/40 to-fuchsia-600/40',
    'from-fuchsia-600/40 to-orange-600/40',
    'from-orange-600/40 to-violet-600/40',
    'from-violet-600/40 to-orange-600/40',
  ];

  const gradientClass = randomGradients[artist.id % randomGradients.length];

  return (
    <Link
      to={`/artist/${artist.id}`}
      className="group relative cursor-pointer block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-3xl border-2 border-white/10 hover:border-white/30 transition-all duration-500 bg-zinc-900/50 backdrop-blur-xl shadow-lg hover:shadow-artistic-multi hover:scale-105">
        {/* Image container - TOUJOURS VISIBLE */}
        <div className="relative aspect-[3/4] overflow-hidden">
          {!imageLoaded && (
            <div className="absolute inset-0 skeleton-artistic"></div>
          )}
          <img
            src={artist.image}
            alt={artist.name}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover transition-all duration-700 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            } ${isHovered ? 'scale-110' : 'scale-100'}`}
          />
          
          {/* Gradient overlay léger */}
          <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-30 group-hover:opacity-50 transition-opacity duration-500`}></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent"></div>
          
          {/* Rating badge - toujours visible */}
          <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/60 backdrop-blur-xl rounded-full border border-white/20 shadow-lg">
            <span className="text-xs font-bold text-white flex items-center gap-1">
              ★ {(4.5 + Math.random() * 0.4).toFixed(1)}
            </span>
          </div>

          {/* Favorite button - toujours visible */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsFavorite(!isFavorite);
            }}
            className={`absolute top-4 right-4 p-2.5 backdrop-blur-xl rounded-full transition-all duration-300 ${
              isFavorite
                ? 'bg-gradient-to-br from-fuchsia-600 to-orange-600 scale-110'
                : 'bg-black/40 hover:bg-black/60 border border-white/20'
            }`}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className={`w-4 h-4 transition-all duration-300 ${
              isFavorite ? 'fill-white text-white scale-110' : 'text-white'
            }`} />
          </button>

          {/* Info toujours visible en bas */}
          <div className="absolute bottom-0 left-0 right-0 p-5 space-y-3">
            <div>
              <h3 className="text-white font-display font-bold text-2xl leading-tight mb-2 text-shadow-glow">
                {artist.name}
              </h3>
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1.5 text-zinc-300">
                  <Users className="w-3.5 h-3.5 text-violet-400" />
                  <span>{artist.members.length} membres</span>
                </div>
                <span className="text-zinc-500">•</span>
                <div className="flex items-center gap-1.5 text-zinc-300">
                  <MapPin className="w-3.5 h-3.5 text-fuchsia-400" />
                  <span>{artist.locations.length} dates</span>
                </div>
              </div>
            </div>

            {/* Button qui apparaît au hover */}
            <div className={`transition-all duration-300 ${
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-orange-500 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-artistic-multi group/btn">
                <Play className="w-4 h-4 fill-white group-hover/btn:scale-110 transition-transform" />
                <span>Découvrir</span>
              </button>
            </div>
          </div>

          {/* Play icon central au hover */}
          <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
            isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
          }`}>
            <div className="p-6 bg-gradient-to-br from-violet-600/90 to-fuchsia-600/90 backdrop-blur-xl rounded-full shadow-glow-violet border-4 border-white/20">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
