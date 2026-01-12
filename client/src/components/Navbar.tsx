import { Button } from "@/components/ui/button";
import { Music, Heart, User, LogOut } from "lucide-react";

interface NavbarProps {
  isAuthenticated?: boolean;
  onLogout?: () => void;
}

export function Navbar({ isAuthenticated = false, onLogout }: NavbarProps) {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Music className="text-primary" size={28} />
          <h1 className="text-2xl font-bold">Groupie Tracker</h1>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Button variant="ghost" size="sm">
                <Heart size={18} />
                Favoris
              </Button>
              <Button variant="ghost" size="sm">
                <User size={18} />
                Profil
              </Button>
              <Button variant="ghost" size="sm" onClick={onLogout}>
                <LogOut size={18} />
                Déconnexion
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm">
                Connexion
              </Button>
              <Button size="sm">
                Inscription
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
