import { Outlet } from 'react-router-dom';
import Navbar from './Navbar'; 
import Player from './Player';

export default function Layout() {
  return (
    <div className="min-h-screen bg-black text-white relative flex flex-col">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Le Player est activé ! Il s'affichera dès qu'une musique est lancée */}
      <Player />
    </div>
  );
}