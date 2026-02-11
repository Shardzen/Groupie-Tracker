import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuthStore } from './stores/useAuthStore';
import { initSentry } from './lib/sentry';

// Layout & Pages
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

// --- AJOUTS : Composants Globaux ---
import Player from './components/Player';
import CartDrawer from './components/CartDrawer';

function AnimatedRoutes() {
  const location = useLocation();
  const { user } = useAuthStore();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        
        {/* Routes avec Layout (Navbar + Footer) */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/artists" element={<ArtistsPage />} />
          <Route path="/artist/:id" element={<ArtistDetailPage />} />
          <Route path="/concerts" element={<ConcertsPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/tickets" element={<TicketsPage />} />

          {/* Routes Admin protégées */}
          {user?.is_admin && (
            <>
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            </>
          )}
          
          {/* Redirection par défaut */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
        
        {/* Routes sans Layout (Plein écran) */}
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
      
      {/* --- AJOUTS : Ces composants doivent être accessibles partout --- */}
      <Player />
      <CartDrawer />
      
    </BrowserRouter>
  );
}

export default App;