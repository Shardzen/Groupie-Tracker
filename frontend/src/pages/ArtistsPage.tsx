import { Link } from 'react-router-dom'
import { mockArtists } from '../data/mockData'
import { Music, Play } from 'lucide-react'
import { useState } from 'react'

export default function ArtistsPage() {
  const [selectedGenre, setSelectedGenre] = useState<string>('all')

  const genres = ['all', ...new Set(mockArtists.map(a => a.genre))]
  
  const filteredArtists = selectedGenre === 'all' 
    ? mockArtists 
    : mockArtists.filter(a => a.genre === selectedGenre)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Tous les Artistes
          </h1>
          <p className="text-xl text-gray-300">
            Découvrez notre sélection complète d'artistes exceptionnels
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {genres.map(genre => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                selectedGenre === genre
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {genre === 'all' ? 'Tous les genres' : genre}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredArtists.map((artist) => (
            <Link
              key={artist.id}
              to={`/artists/${artist.id}`}
              className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-purple-500/50 transition-all transform hover:scale-105 hover:shadow-2xl"
            >
              <div className="aspect-square overflow-hidden relative">
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <span className="bg-purple-500/80 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {artist.genre}
                  </span>
                </div>

                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-purple-500 rounded-full p-4">
                    <Play className="text-white" size={32} fill="white" />
                  </div>
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-xl font-bold mb-2">{artist.name}</h3>
                {artist.upcomingDates.length > 0 ? (
                  <p className="text-purple-300 text-sm flex items-center gap-2">
                    <Music size={16} />
                    {artist.upcomingDates.length} concert{artist.upcomingDates.length > 1 ? 's' : ''} à venir
                  </p>
                ) : (
                  <p className="text-gray-500 text-sm">Pas de concert prévu</p>
                )}
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-purple-500/0 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          ))}
        </div>

        {filteredArtists.length === 0 && (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-400">Aucun artiste trouvé dans cette catégorie</p>
          </div>
        )}
      </div>
    </div>
  )
}
