import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Play } from 'lucide-react'

export const Route = createFileRoute('/artists')({
  component: ArtistsPage,
})

function ArtistsPage() {
  // 1. On demande les données à l'API publique (le Backend)
  const { data: artists, isLoading, isError } = useQuery({
    queryKey: ['artists'],
    queryFn: async () => {
      const res = await axios.get('https://groupietrackers.herokuapp.com/api/artists')
      return res.data
    },
  })

  // 2. Gestion des états de chargement (UX)
  if (isLoading) return <div className="text-white text-center mt-20 text-xl animate-pulse">Chargement de la scène... 🎸</div>
  if (isError) return <div className="text-red-500 text-center mt-20">Erreur lors du chargement des artistes.</div>

  // 3. Affichage de la grille (UI)
  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-white mb-6">Artistes Populaires</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {artists.map((artist: any) => (
          <div key={artist.id} className="group bg-zinc-900 p-4 rounded-lg hover:bg-zinc-800 transition-all cursor-pointer relative">
            
            {/* Image avec effet d'ombre */}
            <div className="relative mb-4 shadow-lg rounded-md overflow-hidden">
              <img 
                src={artist.image} 
                alt={artist.name} 
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-300" 
              />
              {/* Bouton Play qui apparaît au survol (Style Spotify) */}
              <button className="absolute bottom-2 right-2 bg-green-500 rounded-full p-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all shadow-xl hover:scale-105 hover:bg-green-400">
                <Play fill="black" className="text-black" size={20} />
              </button>
            </div>

            {/* Infos Artiste */}
            <h3 className="font-bold text-white truncate text-lg">{artist.name}</h3>
            <p className="text-sm text-zinc-400">Depuis {artist.creationDate}</p>
          </div>
        ))}
      </div>
    </div>
  )
}