import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
// je vais importer le Player ici juste après 

export default function Layout() {
  return (
    <div className="min-h-screen bg-black text-white relative flex flex-col">
      {/* La Navbar est ici une seule fois pour toute l'app */}
      <Navbar />

      {/* Outlet = L'endroit où les pages (Home, Artists, Tickets...) s'affichent */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Le Player sera icihors du Outlet donc il ne se rechargera jamais */}
      {/* <Player /> */}
    </div>
  );
}