import { useState } from 'react';
import { Sparkles, MapPin, Users, Heart } from 'lucide-react';
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
    'from-violet-600/20 to-fuchsia-600/20',
    'from-fuchsia-600/20 to-orange-600/20',
    'from-orange-600/20 to-violet-600/20',
    'from-violet-600/20 to-orange-600/20',
  ];

  const gradientClass = randomGradients[artist.id % randomGradients.length];

  return (
    <div
      className="group relative cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/artist/${artist.id}`}>
        <div className={`card-artistic transition-all duration-500 ${
          isHovered ? 'shadow-artistic-multi' : ''
        }`}>
          {/* Image container */}
          <div className="relative aspect-[3/4] overflow-hidden rounded-t-artistic">
            {!imageLoaded && (
              <div className="absolute inset-0 skeleton-artistic"></div>
            )}
            <img
              src={artist.image}
              alt={artist.name}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              className={`w-full h-full object-cover transition-all duration-700 ${
                imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              } ${isHovered ? 'scale-110' : 'scale-100'}`}
            />
            
            {/* Gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
            
            {/* Favorite button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsFavorite(!isFavorite);
              }}
              className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-xl transition-all duration-300 ${
                isFavorite
                  ? 'bg-gradient-to-br from-fuchsia-600 to-orange-600 scale-110'
                  : 'bg-white/10 hover:bg-white/20 border border-white/20'
              }`}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart className={`w-4 h-4 transition-all duration-300 ${
                isFavorite ? 'fill-white text-white scale-110' : 'text-white'
              }`} />
            </button>

            {/* Rating badge */}
            <div className="absolute top-4 left-4 px-3 py-1.5 bg-gradient-to-br from-violet-600/90 to-fuchsia-600/90 backdrop-blur-xl rounded-full border border-white/20 shadow-glow-violet">
              <span className="text-xs font-bold text-white">
                ★ {(4.5 + Math.random() * 0.4).toFixed(1)}
              </span>
            </div>

            {/* Member count badge */}
            {!isHovered && (
              <div className="absolute bottom-4 left-4 right-4 space-y-2">
                <h3 className="text-white font-display font-bold text-xl leading-tight text-artistic-glow">
                  {artist.name}
                </h3>
                <div className="flex items-center gap-2 text-xs text-zinc-300">
                  <Users className="w-3.5 h-3.5" />
                  <span>{artist.members.length} membres</span>
                </div>
              </div>
            )}
          </div>

          {/* Hover content */}
          {isHovered && (
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/95 via-zinc-900/98 to-black/95 backdrop-blur-2xl flex flex-col justify-between p-5 rounded-artistic fade-in-artistic">
              {/* Top section with mini image */}
              <div className="relative">
                <div className="w-full h-24 rounded-2xl overflow-hidden mb-4">
                  <img
                    src={artist.image}
                    alt={artist.name}
                    className="w-full h-full object-cover opacity-50"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black"></div>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-4 flex-1">
                <div>
                  <h3 className="text-white font-display font-bold text-2xl leading-tight mb-2 text-artistic-gradient">
                    {artist.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <span className="px-2 py-1 bg-gradient-to-r from-violet-600/30 to-fuchsia-600/30 border border-violet-500/30 rounded-full text-violet-300 font-semibold">
                      Depuis {artist.creationDate}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-sm">
                    <Users className="w-4 h-4 text-fuchsia-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-zinc-400 text-xs mb-1">Membres</p>
                      <p className="text-white font-medium">{artist.members.slice(0, 2).join(', ')}
                        {artist.members.length > 2 && ` +${artist.members.length - 2}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-zinc-400 text-xs mb-1">Prochains concerts</p>
                      <p className="text-white font-medium">
                        {artist.locations.length > 0 ? `${artist.locations.length} dates` : 'Aucune date'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {['Rock', 'Alternative', 'Live'].map((tag, idx) => (
                    <span
                      key={tag}
                      className={`px-2 py-1 text-xs rounded-lg backdrop-blur-sm border ${
                        idx === 0
                          ? 'bg-violet-600/20 border-violet-500/30 text-violet-300'
                          : idx === 1
                          ? 'bg-fuchsia-600/20 border-fuchsia-500/30 text-fuchsia-300'
                          : 'bg-orange-600/20 border-orange-500/30 text-orange-300'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action button */}
              <div className="pt-4">
                <Link to={`/artist/${artist.id}`} className="block">
                  <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-orange-500 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-artistic-multi group/btn">
                    <Sparkles className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
                    <span>Découvrir</span>
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
