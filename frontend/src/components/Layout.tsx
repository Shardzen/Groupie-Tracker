import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import CartDrawer from './CartDrawer';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="bg-[#0e0e0e] min-h-screen flex flex-col">
      <Navbar />
      <CartDrawer />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}