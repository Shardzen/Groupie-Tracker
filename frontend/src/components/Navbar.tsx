import { useState, useEffect } from 'react';
import { Search, Sparkles, User, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Accueil', href: '/' },
    { name: 'Artistes', href: '/artists' },
    { name: 'Concerts', href: '/concerts' },
    { name: 'Tickets', href: '/tickets' },
    { name: 'À Propos', href: '/about' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-black/90 backdrop-blur-2xl shadow-2xl border-b border-white/5'
            : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent'
        }`}
      >
        <div className="px-4 md:px-8 lg:px-16">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center group">
                <span className="text-2xl md:text-3xl font-black text-artistic-gradient font-display tracking-tighter hover:scale-105 transition-transform duration-300 relative">
                  GROUPIE
                  <span className="absolute -inset-1 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-orange-500 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 -z-10"></span>
                </span>
              </Link>

              <div className="hidden lg:flex items-center gap-8">
                {navLinks.map((link, idx) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="text-sm font-semibold text-zinc-300 hover:text-white transition-all duration-300 relative group"
                  >
                    {link.name}
                    <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r transition-all duration-300 group-hover:w-full ${
                      idx % 3 === 0
                        ? 'from-violet-500 to-fuchsia-500'
                        : idx % 3 === 1
                        ? 'from-fuchsia-500 to-orange-500'
                        : 'from-orange-500 to-violet-500'
                    }`}></span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">

              <div className="hidden md:block relative">
                {showSearch ? (
                  <div className="flex items-center fade-in-artistic">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Rechercher l'inspiration..."
                      className="input-artistic w-64 lg:w-80 pl-11 py-2.5 text-sm"
                      autoFocus
                      onBlur={() => {
                        if (!searchQuery) setTimeout(() => setShowSearch(false), 200);
                      }}
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-400" />
                  </div>
                ) : (
                  <button
                    onClick={() => setShowSearch(true)}
                    className="p-2.5 glass-artistic rounded-xl hover:bg-white/10 transition-all duration-300 group"
                    aria-label="Search"
                  >
                    <Search className="w-5 h-5 text-zinc-300 group-hover:text-violet-400 transition-colors" />
                  </button>
                )}
              </div>

              <Link to="/tickets">
                <button className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 border border-violet-500/30 rounded-full hover:scale-105 transition-all duration-300 group backdrop-blur-xl">
                  <Sparkles className="w-4 h-4 text-violet-400 group-hover:rotate-12 transition-transform" />
                  <span className="text-sm font-bold text-violet-300">Premium</span>
                </button>
              </Link>

              <Link to="/login">
                <button className="flex items-center gap-2 p-2 glass-artistic rounded-xl hover:bg-white/10 transition-all duration-300 group">
                  <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-lg overflow-hidden flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-glow-violet">
                    <User className="w-5 h-5 text-white" />
                  </div>
                </button>
              </Link>

              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 glass-artistic rounded-xl hover:bg-white/10 transition-all duration-300"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-white" />
                ) : (
                  <Menu className="w-5 h-5 text-white" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="md:hidden px-4 pb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher..."
              className="input-artistic w-full pl-11 py-2.5 text-sm"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-400" />
          </div>
        </div>

        <div className={`h-[2px] bg-gradient-to-r from-transparent via-violet-600 to-transparent transition-opacity duration-500 ${isScrolled ? 'opacity-100' : 'opacity-0'}`}>
          <div className="h-full w-1/3 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-orange-600 animate-gradient"></div>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${
          mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >

        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-xl"
          onClick={() => setMobileMenuOpen(false)}
        ></div>

        <div
          className={`absolute top-20 left-4 right-4 bg-gradient-to-br from-zinc-900/95 via-zinc-900/90 to-zinc-900/95 backdrop-blur-2xl border-2 border-white/10 rounded-3xl p-6 transition-all duration-500 shadow-artistic-multi ${
            mobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
          }`}
        >
          <div className="space-y-4">
            {navLinks.map((link, idx) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block text-lg font-bold text-white hover:text-artistic-gradient transition-all duration-300 p-3 rounded-xl hover:bg-white/5 ${
                  idx === 0 ? 'slide-in-left-artistic' : ''
                }`}
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <Link to="/tickets" onClick={() => setMobileMenuOpen(false)}>
            <button className="w-full mt-6 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-orange-500 text-white font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-artistic-multi">
              <Sparkles className="w-5 h-5" />
              <span>Devenir Premium</span>
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}
