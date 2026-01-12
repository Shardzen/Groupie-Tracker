import { Music2, Instagram, Twitter, Facebook } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black py-12 text-gray-400">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* 1. Logo et Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white font-bold text-xl">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                <Music2 className="h-5 w-5 text-white" />
              </div>
              <span>SoundWave</span>
            </div>
            <p className="text-sm">
              La plateforme de référence pour vivre la musique électronique. 
              Réservez, sortez, vibrez.
            </p>
          </div>

          {/* 2. Liens Découverte */}
          <div>
            <h3 className="font-bold text-white mb-4">Découvrir</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/concerts" className="hover:text-primary transition-colors">Concerts à Paris</Link></li>
              <li><Link to="/artists" className="hover:text-primary transition-colors">Artistes du moment</Link></li>
              <li><Link to="/" className="hover:text-primary transition-colors">Festivals</Link></li>
              <li><Link to="/" className="hover:text-primary transition-colors">Clubs & Warehouses</Link></li>
            </ul>
          </div>

          {/* 3. Liens Aide */}
          <div>
            <h3 className="font-bold text-white mb-4">Aide & Infos</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-primary transition-colors">Centre d'aide</Link></li>
              <li><Link to="/" className="hover:text-primary transition-colors">Billetterie</Link></li>
              <li><Link to="/" className="hover:text-primary transition-colors">Organisateurs</Link></li>
              <li><Link to="/" className="hover:text-primary transition-colors">Mentions Légales</Link></li>
            </ul>
          </div>

          {/* 4. Réseaux Sociaux */}
          <div>
            <h3 className="font-bold text-white mb-4">Suivez-nous</h3>
            <div className="flex gap-4">
              <SocialIcon icon={<Instagram size={20} />} />
              <SocialIcon icon={<Twitter size={20} />} />
              <SocialIcon icon={<Facebook size={20} />} />
            </div>
          </div>

        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-center text-xs">
          <p>&copy; 2024 SoundWave Inc. Fait avec passion pour la musique.</p>
        </div>
      </div>
    </footer>
  );
}

// Petit composant helper pour les icônes sociales
function SocialIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <a href="#" className="h-10 w-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-primary hover:text-white transition-all">
      {icon}
    </a>
  );
}