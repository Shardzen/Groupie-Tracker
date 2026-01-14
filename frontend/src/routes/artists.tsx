import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent } from "../components/ui/card"
import { Play } from "lucide-react"

export const Route = createFileRoute('/artists')({
  component: Artists,
})

// Fausses données pour visualiser le design
const artists = [
  { id: 1, name: "Amelie Lens", genre: "Techno", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=500&auto=format&fit=crop" },
  { id: 2, name: "Fred Again..", genre: "House", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=500&auto=format&fit=crop" },
  { id: 3, name: "Peggy Gou", genre: "House", image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=500&auto=format&fit=crop" },
  { id: 4, name: "Boris Brejcha", genre: "High-Tech Minimal", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=500&auto=format&fit=crop" },
  { id: 5, name: "Charlotte de Witte", genre: "Acid Techno", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=500&auto=format&fit=crop" },
  { id: 6, name: "Paul Kalkbrenner", genre: "Berlin Techno", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=500&auto=format&fit=crop" },
]

function Artists() {
  return (
    <div className="container mx-auto px-6 py-10">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-4xl font-bold text-white tracking-tight">Artistes Populaires</h1>
        <p className="text-gray-400">Les DJs et producteurs qui font vibrer la scène actuelle.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {artists.map((artist) => (
          <div key={artist.id} className="group relative flex flex-col gap-3 cursor-pointer p-4 rounded-xl hover:bg-white/5 transition-colors duration-300">
            
            {/* Image de l'artiste (Ronde style Spotify ou Carré arrondi style Shotgun) */}
            <div className="relative aspect-square overflow-hidden rounded-full shadow-lg group-hover:shadow-primary/20 transition-all duration-300">
              <img 
                src={artist.image} 
                alt={artist.name} 
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              {/* Le bouton Play qui apparaît au survol (La touche Spotify !) */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <button className="h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:scale-110">
                  <Play fill="currentColor" className="ml-1 h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Infos */}
            <div className="text-center space-y-1">
              <h3 className="font-bold text-white group-hover:text-primary transition-colors truncate">
                {artist.name}
              </h3>
              <p className="text-sm text-gray-500">{artist.genre}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}