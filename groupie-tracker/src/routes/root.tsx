import { createRootRoute, Outlet, Link } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/router-devtools" 
import { AudioPlayer } from "@/features/player/components/AudioPlayer" // pas initialisé maintenant 
import { Toaster } from "@/componentss/ui/sonner"

export const Route = createRootRoute({
    component: RootComponent
})

function RootComponent() {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
        
      </div>
    )