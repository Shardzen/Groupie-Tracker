import { useState } from 'react';
import { Play, Info, Plus, ChevronDown } from 'lucide-react';
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
  const [isInList, setIsInList] = useState(false);

  return (
    <div
      className="group relative cursor-pointer transition-all duration-300 hover:z-20"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/artist/${artist.id}`}>
        <div className={`relative rounded-md overflow-hidden bg-zinc-900 transition-all duration-300 ${
          isHovered ? 'scale-125 shadow-2xl' : 'scale-100'
        }`}>
          <div className="relative aspect-[2/3] overflow-hidden">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-zinc-800 animate-pulse"></div>
            )}
            <img
              src={artist.image}
              alt={artist.name}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              className={`w-full h-full object-cover transition-all duration-500 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>
            
            {!isHovered && (
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-bold text-lg truncate text-shadow">
                  {artist.name}
                </h3>
              </div>
            )}
          </div>

          {isHovered && (
            <div className="absolute inset-0 bg-zinc-900 flex flex-col justify-end p-4 animate-fade-in">
              <div className="absolute top-0 left-0 right-0 h-32 overflow-hidden">
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="w-full h-full object-cover opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-900"></div>
              </div>

              <div className="relative z-10 space-y-3">
                <h3 className="text-white font-bold text-xl leading-tight">
                  {artist.name}
                </h3>

                <div className="flex items-center gap-2 text-xs text-zinc-300">
                  <span className="font-semibold text-green-500">
                    {Math.floor(Math.random() * 100)}% Match
                  </span>
                  <span className="px-1 py-0.5 border border-zinc-600 text-zinc-400 rounded text-[10px]">
                    ALL
                  </span>
                  <span>{artist.creationDate}</span>
                  <span>•</span>
                  <span>{artist.members.length} membres</span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  <span className="text-xs text-zinc-400">Rock</span>
                  <span className="text-xs text-zinc-500">•</span>
                  <span className="text-xs text-zinc-400">Alternative</span>
                  <span className="text-xs text-zinc-500">•</span>
                  <span className="text-xs text-zinc-400">Live</span>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Link to={`/artist/${artist.id}`} className="flex-1">
                    <button className="w-full flex items-center justify-center gap-2 bg-white hover:bg-white/90 text-black font-semibold py-2 px-4 rounded-md transition-all duration-200 text-sm">
                      <Play className="w-4 h-4 fill-black" />
                      <span>Explorer</span>
                    </button>
                  </Link>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsInList(!isInList);
                    }}
                    className={`p-2 rounded-full border-2 transition-all duration-200 ${
                      isInList
                        ? 'border-white bg-white/20'
                        : 'border-zinc-600 bg-zinc-800/80 hover:border-white'
                    }`}
                    aria-label={isInList ? "Remove from list" : "Add to list"}
                  >
                    <Plus className={`w-4 h-4 text-white transition-transform duration-200 ${
                      isInList ? 'rotate-45' : 'rotate-0'
                    }`} />
                  </button>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    className="p-2 rounded-full border-2 border-zinc-600 bg-zinc-800/80 hover:border-white transition-all duration-200"
                    aria-label="More info"
                  >
                    <ChevronDown className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
