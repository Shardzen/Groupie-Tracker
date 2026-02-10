import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import Navbar from './Navbar'; 
import Player from './Player';
import CartDrawer from './CartDrawer';
import PWAInstallButton from './PWAInstallButton';
import NetworkStatus from './NetworkStatus';

export default function Layout() {
  return (
    <div className="min-h-screen bg-black text-white relative flex flex-col">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <Player />
      <CartDrawer />
      <PWAInstallButton />
      <NetworkStatus />
      
      <Toaster position="top-center" theme="dark" richColors />
    </div>
  );
}
