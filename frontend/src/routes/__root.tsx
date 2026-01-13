import { createRootRoute, Outlet } from '@tanstack/react-router'
import { Navbar } from '../components/layout/navbar'
import { Footer } from '../components/layout/footer' // <--- Ajout ici

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
      <div className="min-h-screen bg-background text-foreground font-sans antialiased flex flex-col">
        <Navbar />
        <main className="flex-1 pt-16">
          <Outlet />
        </main>
        <Footer /> {/* <--- Ajout ici */}
      </div>
    </>
  )
}

































