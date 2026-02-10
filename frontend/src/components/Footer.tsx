import { Facebook, Instagram, Twitter, Youtube, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] text-white pt-16 pb-8 border-t border-white/5">
      <div className="container mx-auto px-6">
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16 text-left">
          <div>
            <h3 className="font-bold uppercase tracking-wider mb-6 text-sm">Liens utiles</h3>
            <ul className="space-y-4">
              <li><Link to="/login" className="text-zinc-400 hover:text-white transition-colors text-sm">Se connecter</Link></li>
              <li><Link to="/tickets" className="text-zinc-400 hover:text-white transition-colors text-sm">Offres Premium</Link></li>
              <li><Link to="/concerts" className="text-zinc-400 hover:text-white transition-colors text-sm">Concerts</Link></li>
            </ul>
          </div>

          {/* Colonne 2 */}
          <div>
            <h3 className="font-bold uppercase tracking-wider mb-6 text-sm">Découvrir</h3>
            <ul className="space-y-4">
              <li><Link to="/artistes" className="text-zinc-400 hover:text-white transition-colors text-sm">Catalogue Artistes</Link></li>
              <li><Link to="/sorties" className="text-zinc-400 hover:text-white transition-colors text-sm">Dernières sorties</Link></li>
            </ul>
          </div>

          {/* Colonne 3 */}
          <div>
            <h3 className="font-bold uppercase tracking-wider mb-6 text-sm">Live the Music</h3>
            <ul className="space-y-4">
              <li><Link to="/festivals" className="text-zinc-400 hover:text-white transition-colors text-sm">Festivals Partenaires</Link></li>
              <li><Link to="/salles" className="text-zinc-400 hover:text-white transition-colors text-sm">Salles de concert</Link></li>
            </ul>
          </div>

          {/* Colonne 4 */}
          <div>
            <h3 className="font-bold uppercase tracking-wider mb-6 text-sm">À propos</h3>
            <ul className="space-y-4">
              <li><Link to="/about" className="text-zinc-400 hover:text-white transition-colors text-sm">Notre Vision</Link></li>
              <li><Link to="/careers" className="text-zinc-400 hover:text-white transition-colors text-sm">Carrières</Link></li>
            </ul>
          </div>

           {/* Colonne 5 */}
           <div>
            <h3 className="font-bold uppercase tracking-wider mb-6 text-sm">Légal</h3>
             <ul className="space-y-4">
              <li><Link to="/terms" className="text-zinc-400 hover:text-white transition-colors text-sm">Conditions Générales</Link></li>
              <li><Link to="/privacy" className="text-zinc-400 hover:text-white transition-colors text-sm">Confidentialité</Link></li>
            </ul>
          </div>
        </div>

        {/* Bas du footer : Logo et Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 mb-4 md:mb-0 group">
                <Heart className="text-violet-500 group-hover:scale-110 transition-transform" fill="currentColor" size={24} />
                <span className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500">
                GROUPIE
                </span>
            </Link>

            {/* Réseaux sociaux */}
            <div className="flex items-center gap-6 mb-4 md:mb-0">
                <a href="#" className="text-zinc-400 hover:text-white transition-colors"><Facebook size={20} /></a>
                <a href="#" className="text-zinc-400 hover:text-white transition-colors"><Instagram size={20} /></a>
                <a href="#" className="text-zinc-400 hover:text-white transition-colors"><Twitter size={20} /></a>
                <a href="#" className="text-zinc-400 hover:text-white transition-colors"><Youtube size={20} /></a>
            </div>

            {/* Copyright */}
            <p className="text-zinc-500 text-sm">
                © 2026 Groupie Tracker. Tous droits réservés.
            </p>
        </div>
      </div>
    </footer>
  );
}