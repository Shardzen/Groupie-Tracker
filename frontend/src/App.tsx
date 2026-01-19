import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/useAuthStore';
import { initSentry } from './lib/sentry';

// Import du nouveau Layout
import Layout from './components/Layout';

import Home from './pages/Home';
import ArtistsPage from './pages/ArtistsPage';
import ArtistDetailPage from './pages/ArtistDetailPage';
import ConcertsPage from './pages/ConcertsPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import TicketsPage from './pages/TicketsPage';

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    initSentry();
    checkAuth();
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <Routes>
        {/* On enveloppe toutes les pages dans le Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/artists" element={<ArtistsPage />} />
          <Route path="/artist/:id" element={<ArtistDetailPage />} />
          <Route path="/concerts" element={<ConcertsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/tickets" element={<TicketsPage />} />
          {/* Même la 404 garde la navbar */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>

        {/* La page Login peut être hors du layout si tu veux un design plein écran sans navbar,
            sinon tu peux la mettre dedans aussi. Ici je la laisse dehors pour l'exemple. */}
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;