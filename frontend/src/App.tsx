import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/useAuthStore'
import { initSentry } from './lib/sentry'

import Home from './pages/Home'
import ArtistsPage from './pages/ArtistsPage'
import ArtistDetailPage from './pages/ArtistDetailPage'
import AboutPage from './pages/AboutPage'
import LoginPage from './pages/LoginPage'
import TicketsPage from './pages/TicketsPage'

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth)

  useEffect(() => {
    initSentry()
    checkAuth()
  }, [checkAuth])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/artists" element={<ArtistsPage />} />
        <Route path="/artist/:id" element={<ArtistDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/tickets" element={<TicketsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
