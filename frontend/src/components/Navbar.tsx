import { useState, useEffect } from 'react';
import { Search, Bell, User, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-black/95 backdrop-blur-md shadow-lg'
          : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
    >
      <div className="px-4 md:px-8 lg:px-16">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center group">
              <span className="text-2xl md:text-3xl font-black text-red-600 tracking-tighter hover:scale-105 transition-transform duration-200">
                GROUPIE
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-sm font-medium text-zinc-300 hover:text-white transition-colors duration-200 relative group"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:block relative">
              {showSearch ? (
                <div className="flex items-center animate-fade-in">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher des artistes, concerts..."
                    className="w-64 lg:w-80 bg-zinc-900/80 border border-zinc-700 rounded-md pl-10 pr-4 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-red-600 transition-all duration-200"
                    autoFocus
                    onBlur={() => {
                      if (!searchQuery) setTimeout(() => setShowSearch(false), 200);
                    }}
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                </div>
              ) : (
                <button
                  onClick={() => setShowSearch(true)}
                  className="p-2 hover:bg-zinc-800/50 rounded-full transition-colors duration-200"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5 text-zinc-300" />
                </button>
              )}
            </div>

            <button
              className="hidden md:block p-2 hover:bg-zinc-800/50 rounded-full transition-colors duration-200 relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-zinc-300" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full"></span>
            </button>

            <div className="flex items-center gap-2">
              <Link to="/login">
                <button className="flex items-center gap-2 p-2 hover:bg-zinc-800/50 rounded-md transition-colors duration-200 group">
                  <div className="w-8 h-8 bg-zinc-800 rounded overflow-hidden flex items-center justify-center border border-zinc-700 group-hover:border-red-600 transition-colors duration-200">
                    <User className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors duration-200" />
                  </div>
                  <ChevronDown className="hidden md:block w-4 h-4 text-zinc-400 group-hover:text-white transition-all duration-200 group-hover:rotate-180" />
                </button>
              </Link>
            </div>

            <button className="md:hidden p-2 hover:bg-zinc-800/50 rounded-md transition-colors duration-200">
              <div className="w-5 h-4 flex flex-col justify-between">
                <span className="w-full h-0.5 bg-white rounded"></span>
                <span className="w-full h-0.5 bg-white rounded"></span>
                <span className="w-full h-0.5 bg-white rounded"></span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="md:hidden px-4 pb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher..."
            className="w-full bg-zinc-900/80 border border-zinc-700 rounded-md pl-10 pr-4 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-red-600 transition-all duration-200"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        </div>
      </div>

      <div className={`h-[1px] bg-gradient-to-r from-transparent via-red-600/50 to-transparent transition-opacity duration-300 ${isScrolled ? 'opacity-100' : 'opacity-0'}`}></div>
    </nav>
  );
}
