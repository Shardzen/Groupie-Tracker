import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export const Route = createFileRoute('/concerts')({
  component: Concerts,
})

interface Concert {
  id: number
  artistId: number
  location: string
  date: string
  price: number
  tickets: number
}

function Concerts() {
  const [search, setSearch] = useState('')

  const { data: concerts, isLoading } = useQuery<Concert[]>({
    queryKey: ['concerts', search],
    queryFn: async () => {
      const url = search
        ? `${API_URL}/api/concerts/search?q=${search}`
        : `${API_URL}/api/concerts`
      const res = await fetch(url)
      return res.json()
    },
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading concerts...</div>
      </div>
    )
  }

  return (
    <div className="bg-gray-950 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Upcoming Concerts</h1>

        <div className="mb-8">
          <input
            type="text"
            placeholder="Search by location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md px-4 py-3 bg-gray-900 text-white rounded-lg border border-gray-800 focus:border-purple-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {concerts?.map((concert) => (
            <div
              key={concert.id}
              className="bg-gray-900 rounded-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-800"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Artist #{concert.artistId}
                  </h3>
                  <p className="text-purple-400 font-semibold">{concert.location}</p>
                </div>
                <span className="bg-purple-900 text-purple-300 px-3 py-1 rounded text-sm">
                  {concert.tickets} tickets
                </span>
              </div>

              <div className="mb-4">
                <p className="text-gray-400 text-sm mb-1">Date</p>
                <p className="text-white">
                  {new Date(concert.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>

              <div className="mb-6">
                <p className="text-gray-400 text-sm mb-1">Price</p>
                <p className="text-2xl font-bold text-white">${concert.price}</p>
              </div>

              <button className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold">
                Buy Tickets
              </button>
            </div>
          ))}
        </div>

        {concerts?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No concerts found</p>
          </div>
        )}
      </div>
    </div>
  )
}
