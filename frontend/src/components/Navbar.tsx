import { useState, useEffect } from 'react';
import { Menu, X, Music, Search, User, LogIn, Sparkles } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Accueil', href: '/', icon: Music },
    { name: 'Artistes', href: '/artists', icon: Sparkles },
    { name: 'Concerts', href: '/concerts', icon: Music },
    { name: 'À Propos', href: '/about', icon: User },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'glass-effect shadow-2xl py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                {/* Animated glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                
                <div className="relative bg-gradient-to-br from-violet-600 to-purple-600 p-2 rounded-xl shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                  <Music className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <div className="flex flex-col">
                <span className="text-2xl font-black gradient-text tracking-tight">
                  YNOT
                </span>
                <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
                  Music Events
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link, index) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="group relative px-4 py-2 rounded-lg transition-all duration-300 hover:bg-white/5"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-slate-400 group-hover:text-violet-400 transition-colors" />
                      <span className="text-slate-300 group-hover:text-white font-medium transition-colors">
                        {link.name}
                      </span>
                    </div>
                    
                    {/* Hover underline effect */}
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full"></div>
                  </Link>
                );
              })}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Search Button */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="hidden md:flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-violet-500/50 transition-all duration-300 group"
                aria-label="Search"
              >
                <Search className="w-5 h-5 text-slate-400 group-hover:text-violet-400 transition-colors" />
              </button>

              {/* Auth Buttons */}
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login">
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-violet-500/50 text-slate-300 hover:text-white font-medium transition-all duration-300">
                    <LogIn className="w-4 h-4" />
                    <span>Connexion</span>
                  </button>
                </Link>
                
                <Link to="/register">
                  <button className="btn-primary flex items-center gap-2 relative z-10">
                    <Sparkles className="w-4 h-4" />
                    <span>S'inscrire</span>
                  </button>
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-white" />
                ) : (
                  <Menu className="w-5 h-5 text-white" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar Overlay */}
        {isSearchOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 px-4 animate-fadeIn">
            <div className="container mx-auto">
              <div className="glass-effect rounded-2xl p-4 shadow-2xl">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Rechercher un artiste, un concert..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-violet-500/50 transition-all duration-300"
                    autoFocus
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden animate-fadeIn">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>

          {/* Menu Panel */}
          <div className="absolute top-20 right-4 left-4 glass-effect rounded-2xl p-6 shadow-2xl animate-fadeInScale">
            {/* Mobile Search */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-violet-500/50"
              />
            </div>

            {/* Mobile Navigation Links */}
            <div className="space-y-2 mb-6">
              {navLinks.map((link, index) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-all duration-300 group animate-fadeIn"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <Icon className="w-5 h-5 text-violet-400 group-hover:scale-110 transition-transform" />
                    <span className="text-white font-medium">{link.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Mobile Auth Buttons */}
            <div className="space-y-3 pt-6 border-t border-white/10">
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-all duration-300">
                  <LogIn className="w-4 h-4" />
                  <span>Connexion</span>
                </button>
              </Link>
              
              <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                <button className="btn-primary w-full flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>S'inscrire</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
