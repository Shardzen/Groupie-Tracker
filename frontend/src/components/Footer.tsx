import { Instagram, Twitter, Youtube, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-16 pb-8 border-t border-white/10 text-sm">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Colonne 1 */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg mb-4">Liens utiles</h3>
            <ul className="space-y-2 text-zinc-400">
              <li><a href="#" className="hover:text-violet-500 transition">Télécharger l'app</a></li>
              <li><a href="#" className="hover:text-violet-500 transition">Offres</a></li>
              <li><a href="#" className="hover:text-violet-500 transition">Promotions</a></li>
              <li><a href="#" className="hover:text-violet-500 transition">Avis clients</a></li>
              <li><a href="#" className="hover:text-violet-500 transition">Activer un code promo</a></li>
            </ul>
          </div>

          {/* Colonne 2 */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg mb-4">Découvrir</h3>
            <ul className="space-y-2 text-zinc-400">
              <li><a href="#" className="hover:text-violet-500 transition">Flow</a></li>
              <li><a href="#" className="hover:text-violet-500 transition">Reconnaissance musique</a></li>
              <li><a href="#" className="hover:text-violet-500 transition">Transférer des playlists</a></li>
              <li><a href="#" className="hover:text-violet-500 transition">Paroles de chansons</a></li>
            </ul>
          </div>

           {/* Colonne 3 */}
           <div className="space-y-4">
            <h3 className="font-bold text-lg mb-4">Live the Music</h3>
            <ul className="space-y-2 text-zinc-400">
              <li><a href="#" className="hover:text-violet-500 transition">Explorer le catalogue</a></li>
              <li><a href="#" className="hover:text-violet-500 transition">Top écoutes</a></li>
              <li><a href="#" className="hover:text-violet-500 transition">Nouvelles sorties</a></li>
            </ul>
          </div>

           {/* Colonne 4 */}
           <div className="space-y-4">
            <h3 className="font-bold text-lg mb-4">À propos</h3>
            <ul className="space-y-2 text-zinc-400">
              <li><a href="#" className="hover:text-violet-500 transition">Presse & actualités</a></li>
              <li><a href="#" className="hover:text-violet-500 transition">Rémunération des artistes</a></li>
              <li><a href="#" className="hover:text-violet-500 transition">Pour les créateurs</a></li>
              <li><a href="#" className="hover:text-violet-500 transition">Investisseurs</a></li>
            </ul>
          </div>

          {/* Colonne 5 (Légal) */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg mb-4">Légal</h3>
            <ul className="space-y-2 text-zinc-400">
              <li><a href="#" className="hover:text-violet-500 transition">CGU</a></li>
              <li><a href="#" className="hover:text-violet-500 transition">Protection des données</a></li>
              <li><a href="#" className="hover:text-violet-500 transition">Cookies</a></li>
              <li><a href="#" className="hover:text-violet-500 transition">Accessibilité</a></li>
            </ul>
          </div>
        </div>

        {/* Bas de page avec Logo et Réseaux */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10">
            <div className="flex items-center gap-6 mb-4 md:mb-0">
                <h2 className="text-2xl font-black tracking-tighter uppercase flex items-center gap-2">
                    GROUPIE <span className="text-violet-500">TRACKER</span>
                </h2>
                <div className="flex gap-4 text-zinc-400">
                    <Facebook size={20} className="hover:text-white cursor-pointer"/>
                    <Instagram size={20} className="hover:text-white cursor-pointer"/>
                    <Twitter size={20} className="hover:text-white cursor-pointer"/>
                    <Youtube size={20} className="hover:text-white cursor-pointer"/>
                </div>
            </div>
            <p className="text-zinc-500 text-xs">© 2026 Groupie Tracker. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}