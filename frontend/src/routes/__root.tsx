import { createRootRoute, Outlet } from '@tanstack/react-router'
import { Navbar } from '../components/layout/navbar'
import { Footer } from '../components/layout/footer'
import { Player } from '../components/layout/player'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
      <div className="min-h-screen bg-background text-foreground font-sans antialiased flex flex-col pb-24">
        {/* La barre de navigation en haut */}
        <Navbar />
        
        {/* Le contenu principal */}
        <main className="flex-1 pt-16">
          <Outlet />
        </main>

        {/* Le pied de page */}
        <Footer />

        {/* Le Lecteur Audio Fixe (Le bijou final) */}
        <Player />
      </div>
    </>
  )
}