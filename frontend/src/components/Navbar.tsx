import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Search, User, Heart } from 'lucide-react';
import { useCartStore } from '../stores/useCartStore';

export default function Navbar() {
  const location = useLocation();
  const { toggleCart, items } = useCartStore();
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Accueil' },
    { path: '/artistes', label: 'Artistes' },
    { path: '/concerts', label: 'Concerts' },
    { path: '/tickets', label: 'Tickets' },
    { path: '/about', label: 'À Propos' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 py-4">
      <div className="container mx-auto px-6 flex items-center justify-between">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 group">
          <Heart className="text-violet-500 group-hover:scale-110 transition-transform" fill="currentColor" size={28} />
          <span className="text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500">
            GROUPIE
          </span>
        </Link>

        {/* LIENS CENTRÉS */}
        <div className="hidden md:flex items-center gap-8 font-bold uppercase tracking-wider text-sm">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`transition-colors relative group ${
                isActive(link.path) ? 'text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {link.label}
              <span className={`absolute -bottom-1 left-0 h-[2px] bg-violet-500 transition-all group-hover:w-full ${isActive(link.path) ? 'w-full' : 'w-0'}`}></span>
            </Link>
          ))}
        </div>

        {/* ICÔNES À DROITE */}
        <div className="flex items-center gap-4">
          {/* Recherche */}
          <button className="p-2 text-zinc-400 hover:text-white transition-colors rounded-full hover:bg-white/5">
            <Search size={22} />
          </button>

          {/* Panier avec Badge Jaune */}
          <button 
            onClick={toggleCart}
            className="p-2 text-zinc-400 hover:text-white transition-colors rounded-full hover:bg-white/5 relative"
          >
            <ShoppingCart size={22} />
            {itemCount > 0 && (
              <span className="absolute top-0 right-0 bg-yellow-500 text-black text-[10px] font-bold h-4 min-w-[1rem] px-1 rounded-full flex items-center justify-center border-2 border-[#0a0a0a]">
                {itemCount}
              </span>
            )}
          </button>

          {/* Profil Utilisateur */}
          <Link to="/profile" className="p-2 text-zinc-400 hover:text-white transition-colors rounded-full hover:bg-white/5 bg-white/5">
             <User size={22} />
          </Link>
        </div>
      </div>
    </nav>
  );
}