import { createRootRoute, Outlet } from '@tanstack/react-router'
import { Navbar } from '../components/layout/navbar'
import { Footer } from '../components/layout/footer'
import { Player } from '../components/layout/player'
import { CartDrawer } from '../components/layout/cart-drawer' // <--- Nouveau
import { Toaster } from 'sonner' // <--- Nouveau

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
      <div className="min-h-screen bg-background text-foreground font-sans antialiased flex flex-col pb-24">
        <Navbar />
        
        <main className="flex-1 pt-16">
          <Outlet />
        </main>

        <Footer />
        
        {/* Les composants "flottants" globaux */}
        <Player />
        <CartDrawer />
        <Toaster position="top-center" theme="dark" richColors />
      </div>
    </>
  )
}