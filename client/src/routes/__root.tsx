import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="min-h-screen" style={{
        background: 'linear-gradient(180deg, #000000 0%, #0a0a0a 50%, #000000 100%)',
        color: '#ffffff'
      }}>
        {/* Header avec effet chrome */}
        <header className="header">
          <div className="header-content">
            <Link to="/" className="logo-link">
              <h1 className="logo-text">KNOT CREW</h1>
            </Link>
            <p className="tagline">RAP • HIP-HOP • CONCERTS • FESTIVALS</p>
          </div>
        </header>

        {/* Navigation */}
        <nav className="nav">
          <div className="nav-content">
            <div className="nav-links">
              <Link
                to="/"
                className="nav-link"
                activeProps={{ className: 'nav-link active' }}
              >
                Home
              </Link>
              <Link
                to="/artists"
                className="nav-link"
                activeProps={{ className: 'nav-link active' }}
              >
                Artists
              </Link>
              <Link
                to="/concerts"
                className="nav-link"
                activeProps={{ className: 'nav-link active' }}
              >
                Concerts
              </Link>
            </div>
            <div className="nav-auth">
              <Link
                to="/login"
                className="nav-link"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="cta-button"
              >
                Sign Up
              </Link>
