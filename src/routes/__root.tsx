import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="min-h-screen bg-gray-950">
        <nav className="bg-gray-900 border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <Link to="/" className="flex items-center">
                  <span className="text-2xl font-bold text-purple-500">🎸 Groupie Tracker</span>
                </Link>
                <div className="ml-10 flex items-center space-x-4">
                  <Link
                    to="/artists"
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                    activeProps={{ className: 'text-white bg-gray-800' }}
                  >
                    Artists
                  </Link>
                  <Link
                    to="/concerts"
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                    activeProps={{ className: 'text-white bg-gray-800' }}
                  >
                    Concerts
                  </Link>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <main>
          <Outlet />
        </main>
        <footer className="bg-gray-900 border-t border-gray-800 mt-20">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <p className="text-center text-gray-400 text-sm">
              © 2025 Groupie Tracker. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
      <TanStackRouterDevtools />
    </>
  ),
})
