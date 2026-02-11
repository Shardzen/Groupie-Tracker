import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuthStore } from './stores/useAuthStore';
import { initSentry } from './lib/sentry';

// --- IMPORT CAPACITOR (NOUVEAU) ---
import { App as CapacitorApp } from '@capacitor/app';

import Layout from './components/Layout';
import Home from './pages/Home';
import ArtistsPage from './pages/ArtistsPage';
import ArtistDetailPage from './pages/ArtistDetailPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import TicketsPage from './pages/TicketsPage';
import ConcertsPage from './pages/ConcertsPage';
import CheckoutPage from './pages/CheckoutPage';
import RegisterPage from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import AdminPage from './pages/AdminPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

import Player from './components/Player';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';

function AnimatedRoutes() {
  const location = useLocation();
  const { user } = useAuthStore();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        
        {/* TOUTES CES PAGES AURONT LA NAVBAR ET LE FOOTER */}
        <Route element={<Layout />}>
           {/* Redirection explicite pour éviter les erreurs de routing */}
          <Route path="/" element={<Home />} />
          <Route path="/artists" element={<ArtistsPage />} />
          <Route path="/artist/:id" element={<ArtistDetailPage />} />
          <Route path="/concerts" element={<ConcertsPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/tickets" element={<TicketsPage />} />

          {/* ON A DÉPLACÉ LES PAGES D'AUTH ICI */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {user?.is_admin && (
            <>
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            </>
          )}
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
        
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    // 1. Initialisation Sentry & Auth
    initSentry();
    checkAuth();

    // 2. Gestion du Bouton Retour Android (NOUVEAU)
    const setupBackButton = async () => {
      await CapacitorApp.addListener('backButton', ({ canGoBack }) => {
        // Si on est sur la home ou login, on quitte l'app
        if (window.location.pathname === '/' || window.location.pathname === '/login') {
          CapacitorApp.exitApp();
        } else {
          // Sinon on retourne en arrière dans l'historique du navigateur
          window.history.back();
        }
      });
    };

    setupBackButton();

    // Cleanup (Optionnel mais propre)
    return () => {
      CapacitorApp.removeAllListeners();
    };

  }, [checkAuth]);

  return (
    <BrowserRouter>
      <AnimatedRoutes />
      
      <Player />
      <CartDrawer />
      <Footer /> 
      
    </BrowserRouter>
  );
}

export default App;