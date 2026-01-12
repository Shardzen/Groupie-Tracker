import { createRootRoute, Outlet } from '@tanstack/react-router'
// import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Navbar } from '../components/layout/navbar'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
      <div className="min-h-screen bg-background text-foreground font-sans antialiased">
        <Navbar />
        
        {/* C'est ici que le contenu des pages va s'afficher (en dessous de la navbar) */}
        <main className="pt-16">
          <Outlet />
        </main>
      </div>
      
      {/* Tu pourras décommenter ça plus tard pour le debug */}
      {/* <TanStackRouterDevtools /> */}
    </>
  )
}