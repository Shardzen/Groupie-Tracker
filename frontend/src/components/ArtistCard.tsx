import { useState } from 'react';
import { MapPin, Calendar, Users, Music2, Sparkles, Play, Heart } from 'lucide-react';
import { Link } from '@tanstack/react-router';

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
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link to={`/artists/${artist.id}`}>
      <div
        className="group relative glass-card rounded-2xl overflow-hidden cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-violet-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 transition-all duration-500 pointer-events-none"></div>

        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-slate-800">
          {/* Skeleton loader */}
          {!imageLoaded && (
            <div className="absolute inset-0 skeleton"></div>
          )}

          {/* Artist Image */}
          <img
            src={artist.image}
            alt={artist.name}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover transition-all duration-700 ${
              imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
            } ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>

          {/* Holographic shine effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </div>

          {/* Top badges */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            {/* Members count badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-effect text-xs font-semibold text-white animate-fadeInScale">
              <Users className="w-3 h-3" />
              <span>{artist.members.length} membres</span>
            </div>

            {/* Like button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsLiked(!isLiked);
              }}
              className={`p-2 rounded-full glass-effect hover:scale-110 transition-all duration-300 ${
                isLiked ? 'bg-red-500/20' : 'bg-white/5'
              }`}
            >
              <Heart
                className={`w-4 h-4 transition-all duration-300 ${
                  isLiked ? 'text-red-500 fill-red-500' : 'text-white'
                }`}
              />
            </button>
          </div>

          {/* Play button overlay */}
          <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-violet-500/50 transform scale-0 group-hover:scale-100 transition-transform duration-300">
              <Play className="w-7 h-7 text-white ml-1" fill="white" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 relative z-10">
          {/* Artist Name */}
          <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-violet-400 group-hover:to-purple-400 transition-all duration-300">
            {artist.name}
          </h3>

          {/* Info Grid */}
          <div className="space-y-2 mb-4">
            {/* Creation Date */}
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Calendar className="w-4 h-4 text-violet-400" />
              <span>Créé en {artist.creationDate}</span>
            </div>

            {/* First Album */}
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Music2 className="w-4 h-4 text-purple-400" />
              <span className="truncate">Premier album: {artist.firstAlbum}</span>
            </div>

            {/* Locations */}
            {artist.locations.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <MapPin className="w-4 h-4 text-pink-400" />
                <span className="truncate">
                  {artist.locations.slice(0, 2).join(', ')}
                  {artist.locations.length > 2 && ` +${artist.locations.length - 2}`}
                </span>
              </div>
            )}
          </div>

          {/* Concert dates badge */}
          {artist.concertDates.length > 0 && (
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20">
                <Sparkles className="w-4 h-4 text-violet-400" />
                <span className="text-xs font-semibold text-violet-300">
                  {artist.concertDates.length} concerts à venir
                </span>
              </div>
            </div>
          )}

          {/* Action Button */}
          <button className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold transition-all duration-300 shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 transform group-hover:scale-105 flex items-center justify-center gap-2">
            <span>Voir les détails</span>
            <Sparkles className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
          </button>
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
      </div>
    </Link>
  );
}
