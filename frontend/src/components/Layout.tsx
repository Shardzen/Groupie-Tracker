import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import CartDrawer from './CartDrawer';
import PWAInstallButton from './PWAInstallButton';
import NetworkStatus from './NetworkStatus';
import Player from './Player'; 
import { Toaster } from 'sonner'; 

export default function Layout() {
  return (
    <div className="bg-[#0e0e0e] min-h-screen flex flex-col">
      <Navbar />
      
    
      <CartDrawer /> 

      <main className="flex-1">
        <Outlet />
      </main>

      <Player />
      
      {/* <CartDrawer /> */} 
      
      <PWAInstallButton />
      <NetworkStatus />
      
      <Toaster position="top-center" theme="dark" richColors />
    </div>
  );
}