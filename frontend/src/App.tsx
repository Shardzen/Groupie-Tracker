import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/useAuthStore';
import { initSentry } from './lib/sentry';

import Layout from './components/Layout';

import Home from './pages/Home';
import ArtistsPage from './pages/ArtistsPage';
import ArtistDetailPage from './pages/ArtistDetailPage';
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
          {/* <Route path="/concerts" element={<ConcertsPage />} /> */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/tickets" element={<TicketsPage />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>

        {/* 2. Ajoute la route Register ici, à côté du Login */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<registerpage />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;