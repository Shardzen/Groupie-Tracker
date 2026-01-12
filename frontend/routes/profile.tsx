import { createFileRoute } from '@tanstack/react-router'
import { User, Heart, Calendar, Settings } from 'lucide-react'

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-purple-500 to-pink-600"></div>
          <div className="px-6 pb-6">
            <div className="flex items-center -mt-16 mb-6">
              <div className="w-32 h-32 bg-white rounded-full border-4 border-white flex items-center justify-center">
                <User className="h-16 w-16 text-gray-400" />
              </div>
              <div className="ml-6">
                <h1 className="text-3xl font-bold text-gray-900">John Doe</h1>
                <p className="text-gray-600">Music enthusiast since 2015</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">47</div>
                <div className="text-gray-600">Favorite Artists</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <Calendar className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">23</div>
                <div className="text-gray-600">Concerts Attended</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <Settings className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">5</div>
                <div className="text-gray-600">Playlists Created</div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <Heart className="h-5 w-5 text-red-500 mr-3" />
                  <span className="text-gray-700">Added Taylor Swift to favorites</span>
                  <span className="text-gray-500 text-sm ml-auto">2 days ago</span>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-500 mr-3" />
                  <span className="text-gray-700">Attended Metallica concert</span>
                  <span className="text-gray-500 text-sm ml-auto">1 week ago</span>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <Settings className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Created new playlist "Rock Classics"</span>
                  <span className="text-gray-500 text-sm ml-auto">2 weeks ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
