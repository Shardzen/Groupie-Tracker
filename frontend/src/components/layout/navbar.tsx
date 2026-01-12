import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { Music2, Search } from "lucide-react";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/50 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        
        {/* 1. Logo & Nom du site */}
        <Link to="/" className="flex items-center gap-2 text-lg font-bold tracking-tight text-white hover:opacity-80 transition-opacity">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
            <Music2 className="h-5 w-5 text-white" />
          </div>
          <span>SoundWave</span>
        </Link>

        {/* 2. Liens de navigation (Centre) */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink to="/" label="Accueil" />
          <NavLink to="/concerts" label="Concerts" />
          <NavLink to="/artists" label="Artistes" />
        </div>

        {/* 3. Actions (Droite) - Recherche & Connexion */}
        <div className="flex items-center gap-4">
          <button className="text-gray-400 hover:text-white transition-colors">
            <Search className="h-5 w-5" />
          </button>
          
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost" size="sm">Se connecter</Button>
            </Link>
            <Link to="/register">
              <Button size="sm">S'inscrire</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

// Un petit composant helper juste pour les liens du menu
function NavLink({ to, label }: { to: string; label: string }) {
  return (
    <Link 
      to={to} 
      className="text-sm font-medium text-gray-400 transition-colors hover:text-white [&.active]:text-primary"
    >
      {label}
    </Link>
  );
}