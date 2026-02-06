import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuthStore } from './stores/useAuthStore';
import { initSentry } from './lib/sentry';
import ForgotPassword from './pages/ForgotPassword';
import Layout from './components/Layout';
import Home from './pages/Home';
import ArtistsPage from './pages/ArtistsPage';
import ArtistDetailPage from './pages/ArtistDetailPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import TicketsPage from './pages/TicketsPage';
import RegisterPage from './pages/Register';
import EmailSentPage from './pages/EmailSentPage';
// On crée ce composant pour pouvoir utiliser useLocation() à l'intérieur
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* On enveloppe les pages dans le Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/artists" element={<ArtistsPage />} />
          <Route path="/artist/:id" element={<ArtistDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/tickets" element={<TicketsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/email-sent" element={<EmailSentPage />} />       
        </Route>
      

        {/* Routes sans Layout pour le Login et Register */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    initSentry();
    checkAuth();
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;