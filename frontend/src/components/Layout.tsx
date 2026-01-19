import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
// import Player from './Player'; // On décommentera ça à l'étape suivante

export default function Layout() {
  return (
    <div className="min-h-screen bg-black text-white relative flex flex-col">
      {/* La Navbar est ici une seule fois pour toute l'app */}
      <Navbar />

      {/* Outlet = L'endroit où les pages s'affichent */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Le Player sera ici plus tard */}
      {/* <Player /> */}
    </div>
  );
}