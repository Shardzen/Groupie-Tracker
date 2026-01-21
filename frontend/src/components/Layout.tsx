import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner'; // <--- Import 1
import Navbar from './Navbar'; 
import Player from './Player';
import CartDrawer from './CartDrawer';

export default function Layout() {
  return (
    <div className="min-h-screen bg-black text-white relative flex flex-col">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <Player />
      <CartDrawer />
      
      {/* Le gestionnaire de notifications */}
      <Toaster position="top-center" theme="dark" richColors /> {/* <--- Ajout 2 */}
    </div>
  );
}