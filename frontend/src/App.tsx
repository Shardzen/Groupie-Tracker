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
import ConcertsPage from './pages/ConcertsPage';
<<<<<<< HEAD
import NotFoundPage from './pages/NotFoundPage';
=======
import NotFoundPage from './pages/NotFoundPage'; 
>>>>>>> e0aae8438798b0ec941ae70283668f7122cd0c87

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    initSentry();
    checkAuth();
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/artists" element={<ArtistsPage />} />
          <Route path="/artist/:id" element={<ArtistDetailPage />} />
          <Route path="/concerts" element={<ConcertsPage />} />
          <Route path="/tickets" element={<TicketsPage />} />
          <Route path="/about" element={<AboutPage />} />
          
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;