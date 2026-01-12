import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export const Route = createFileRoute('/artists')({
  component: Artists,
})

interface Artist {
  id: number
  name: string
  image: string
  members: string[]
  creationDate: number
  firstAlbum: string
}

function Artists() {
  const { data: artists, isLoading } = useQuery<Artist[]>({
    queryKey: ['artists'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/artists`)
      return res.json()
    },
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="bg-gray-950 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Artists</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {artists?.map((artist) => (
            <div
              key={artist.id}
              className="bg-gray-900 rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-800"
            >
              <img
                src={artist.image}
                alt={artist.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h2 className="text-2xl font-bold text-white mb-2">{artist.name}</h2>
                <p className="text-gray-400 mb-2">Founded: {artist.creationDate}</p>
                <p className="text-gray-400 mb-4">First Album: {artist.firstAlbum}</p>
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Members:</p>
                  <div className="flex flex-wrap gap-2">
                    {artist.members.map((member, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-purple-900 text-purple-300 px-2 py-1 rounded"
                      >
                        {member}
                      </span>
                    ))}
                  </div>
                </div>
                <a
                  href={`/artists/${artist.id}`}
                  className="block w-full text-center bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition-colors"
                >
                  View Details
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
