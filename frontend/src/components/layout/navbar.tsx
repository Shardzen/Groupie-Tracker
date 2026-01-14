import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { Music2, Search, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/50 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          
          {/* 1. Logo */}
          <Link to="/" className="flex items-center gap-2 text-lg font-bold tracking-tight text-white hover:opacity-80 transition-opacity">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
              <Music2 className="h-5 w-5 text-white" />
            </div>
            <span>SoundWave</span>
          </Link>

          {/* 2. Menu Bureau (Caché sur mobile) */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink to="/" label="Accueil" />
            <NavLink to="/concerts" label="Concerts" />
            <NavLink to="/artists" label="Artistes" />
          </div>

          {/* 3. Actions & Menu Mobile Toggle */}
          <div className="flex items-center gap-4">
            <button className="text-gray-400 hover:text-white transition-colors">
              <Search className="h-5 w-5" />
            </button>
            
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">Se connecter</Button>
              </Link>
              <Link to="/register">
                <Button size="sm">S'inscrire</Button>
              </Link>
            </div>

            {/* Bouton Hamburger (Visible seulement sur mobile) */}
            <button 
              className="md:hidden text-white"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* 4. Le Volet Mobile (Animation) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-black pt-20 px-6 md:hidden"
          >
            <div className="flex flex-col gap-6 text-xl font-medium">
              <MobileLink to="/" onClick={() => setIsOpen(false)}>Accueil</MobileLink>
              <MobileLink to="/concerts" onClick={() => setIsOpen(false)}>Concerts</MobileLink>
              <MobileLink to="/artists" onClick={() => setIsOpen(false)}>Artistes</MobileLink>
              <div className="h-px bg-white/10 my-2" />
              <Link to="/login" onClick={() => setIsOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-lg">Se connecter</Button>
              </Link>
              <Link to="/register" onClick={() => setIsOpen(false)}>
                <Button className="w-full text-lg">S'inscrire</Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

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

function MobileLink({ to, children, onClick }: { to: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link 
      to={to} 
      onClick={onClick}
      className="text-white hover:text-primary transition-colors block py-2 border-b border-white/5"
    >
      {children}
    </Link>
  );
}