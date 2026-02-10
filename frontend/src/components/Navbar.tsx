import { useState, useEffect } from 'react';
import { Search, User, Menu, X, LogOut, ShoppingCart } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { useCartStore } from '../stores/useCartStore';
import CartDrawer from './CartDrawer';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { items, toggleCart } = useCartStore();
  
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/artists?search=${encodeURIComponent(searchQuery)}`);
      setShowSearch(false);
    }
  };

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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
          isScrolled
            ? 'bg-black/80 backdrop-blur-xl border-white/10 py-2'
            : 'bg-transparent border-transparent py-4'
        }`}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center group relative z-10">
                <span className="text-2xl md:text-3xl font-black tracking-tighter hover:scale-105 transition-transform duration-300">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 via-fuchsia-500 to-white">
                    GROUPIE
                  </span>
                </span>
                <div className="absolute -inset-4 bg-violet-600/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
              </Link>

              <div className="hidden lg:flex items-center gap-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className={`text-sm font-bold transition-all duration-300 relative group ${
                        location.pathname === link.href ? 'text-white' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {link.name}
                    <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-300 ${
                        location.pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}></span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center relative">
                <div className={`flex items-center transition-all duration-300 overflow-hidden ${
                    showSearch ? 'w-64 opacity-100 mr-2' : 'w-0 opacity-0'
                }`}>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={handleSearchSubmit}
                      placeholder="Rechercher..."
                      className="w-full bg-white/10 border border-white/10 rounded-full pl-4 pr-4 py-2 text-sm text-white focus:outline-none focus:border-violet-500 placeholder:text-zinc-500"
                      onBlur={() => !searchQuery && setShowSearch(false)}
                    />
                </div>
                <button onClick={() => setShowSearch(!showSearch)} className="p-2.5 bg-white/5 border border-white/5 rounded-full hover:bg-white/10 hover:text-violet-400 transition-all text-zinc-300">
                  <Search className="w-5 h-5" />
                </button>
              </div>

              <button onClick={toggleCart} className="relative p-2.5 bg-white/5 border border-white/5 rounded-full hover:bg-white/10 text-white transition-all group mr-2">
                <ShoppingCart className="w-5 h-5 group-hover:text-[#D4AF37] transition-colors" />
                {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#D4AF37] text-black text-xs font-bold flex items-center justify-center rounded-full animate-bounce">
                        {totalItems}
                    </span>
                )}
              </button>

              {user ? (
                  <div className="relative group">
                    <button className="flex items-center gap-2 p-1 pl-2 bg-zinc-900 border border-white/10 rounded-full hover:border-violet-500/50 transition-all">
                        <span className="text-xs font-bold px-2 hidden md:block">{user.email?.split('@')[0]}</span>
                        <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-full flex items-center justify-center text-white font-bold">
                            {user.email?.[0].toUpperCase()}
                        </div>
                    </button>
                    <div className="absolute right-0 top-full mt-2 w-32 bg-zinc-900 border border-white/10 rounded-xl p-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 shadow-xl">
                        <button onClick={() => logout()} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-white/5 rounded-lg transition-colors">
                            <LogOut size={14} /> Déconnexion
                        </button>
                    </div>
                  </div>
              ) : (
                <Link to="/login">
                    <button className="flex items-center gap-2 p-2 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-all group">
                    <div className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <User className="w-5 h-5 text-zinc-400 group-hover:text-white" />
                    </div>
                    </button>
                </Link>
              )}

              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 bg-white/5 border border-white/5 rounded-xl text-white">
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
        <div className={`absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-violet-500 to-transparent transition-opacity duration-500 ${isScrolled ? 'opacity-100' : 'opacity-0'}`}></div>
      </nav>
      <CartDrawer />
    </>
  );
}