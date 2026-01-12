import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Play } from 'lucide-react'

export const Route = createFileRoute('/artists')({
  component: ArtistsPage,
})

function ArtistsPage() {
  const { data: artists, isLoading, isError } = useQuery({
    queryKey: ['artists'],
    queryFn: async () => {
      // ON UTILISE FETCH (Natif) AU LIEU D'AXIOS
      const response = await fetch('https://groupietrackers.herokuapp.com/api/artists')
      if (!response.ok) {
        throw new Error('Erreur réseau')
      }
      return response.json() // On convertit la réponse en JSON
    },
  })

  if (isLoading) return <div className="text-white p-10 animate-pulse">Chargement de la scène...</div>
  if (isError) return <div className="text-red-500 p-10">Impossible de charger les artistes.</div>

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 p-6">
      {artists?.map((artist: any) => (
        <div key={artist.id} className="group bg-zinc-900 p-4 rounded-lg hover:bg-zinc-800 transition-all relative cursor-pointer">
           <img src={artist.image} className="rounded-md mb-4 w-full shadow-lg" alt={artist.name} />
           
           {/* Bouton Play qui apparaît au survol */}
           <button className="absolute bottom-20 right-4 bg-green-500 p-3 rounded-full opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all shadow-xl hover:scale-105">
              <Play fill="black" className="text-black" size={20} />
           </button>
           
           <h3 className="text-white font-bold truncate">{artist.name}</h3>
           <p className="text-xs text-zinc-400">Depuis {artist.creationDate}</p>
        </div>
      ))}
    </div>
  )
}