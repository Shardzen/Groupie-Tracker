import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { Home, Search, Library, Plus, Heart, Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react'
import { usePlayerStore } from '../stores/usePlayerStore'

export const Route = createRootRoute({
  component: () => {
    const { isPlaying, togglePlay } = usePlayerStore()

    return (
      <div className="flex h-screen bg-black text-zinc-400 font-sans overflow-hidden">
        
        {/* 1. SIDEBAR GAUCHE (Fixe) */}
        <aside className="w-64 flex flex-col gap-2 p-2 h-full bg-black">
          {/* Navigation Principale */}
          <div className="bg-zinc-900 rounded-lg p-4 flex flex-col gap-4">
            <Link title="accueil" to="/" className="flex items-center gap-4 hover:text-white transition-colors [&.active]:text-white">
              <Home size={24} /> <span className="font-bold">Accueil</span>
            </Link>
            <div className="flex items-center gap-4 hover:text-white cursor-pointer transition-colors">
              <Search size={24} /> <span className="font-bold">Rechercher</span>
            </div>
          </div>

          {/* Bibliothèque */}
          <div className="bg-zinc-900 rounded-lg p-4 flex-1 flex flex-col gap-4 overflow-hidden">
            <div className="flex items-center justify-between hover:text-white transition-colors cursor-pointer">
              <div className="flex items-center gap-2">
                <Library size={24} /> <span className="font-bold">Bibliothèque</span>
              </div>
              <Plus size={20} />
            </div>
            
            {/* Playlists (Exemple) */}
            <div className="flex-1 overflow-y-auto flex flex-col gap-2 py-2">
              <div className="p-2 hover:bg-zinc-800 rounded-md cursor-pointer flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-700 to-blue-300 rounded flex items-center justify-center"><Heart fill="white" size={20}/></div>
                <div><p className="text-white text-sm font-medium">Titres likés</p><p className="text-xs">Playlist • 42 titres</p></div>
              </div>
            </div>
          </div>
        </aside>

        {/* 2. ZONE DE CONTENU (Scrollable) */}
        <main className="flex-1 flex flex-col p-2 overflow-hidden">
          <div className="flex-1 bg-zinc-900 rounded-lg overflow-y-auto relative">
             {/* Header transparent/flou */}
             <header className="sticky top-0 h-16 bg-zinc-900/80 backdrop-blur-md z-10 p-4 flex items-center gap-4">
                <Link to="/artists" className="bg-black/40 p-2 rounded-full hover:bg-black">Artistes</Link>
             </header>

             <div className="p-6">
                <Outlet /> {/* C'est ici que tes pages s'affichent */}
             </div>
          </div>
        </main>

        {/* 3. PLAYER AUDIO (Fixé en bas) */}
        <footer className="fixed bottom-0 w-full h-24 bg-black border-t border-zinc-900 flex items-center justify-between px-4 z-50">
           {/* Infos Morceau */}
           <div className="flex items-center gap-4 w-[30%]">
              <div className="w-14 h-14 bg-zinc-800 rounded shadow-lg"></div>
              <div className="overflow-hidden">
                <p className="text-white text-sm font-medium truncate">En attente...</p>
                <p className="text-xs truncate">Sélectionnez un artiste</p>
              </div>
           </div>

           {/* Contrôles Player */}
           <div className="flex flex-col items-center gap-2 w-[40%]">
              <div className="flex items-center gap-6">
                 <SkipBack className="hover:text-white cursor-pointer" size={20} />
                 <button onClick={togglePlay} className="bg-white text-black p-2 rounded-full hover:scale-105 transition-transform">
                    {isPlaying ? <Pause size={24} fill="black" /> : <Play size={24} fill="black" />}
                 </button>
                 <SkipForward className="hover:text-white cursor-pointer" size={20} />
              </div>
              <div className="w-full max-w-md h-1 bg-zinc-600 rounded-full">
                 <div className="bg-white h-full w-0 rounded-full"></div>
              </div>
           </div>

           {/* Volume */}
           <div className="flex items-center justify-end gap-2 w-[30%]">
              <Volume2 size={20} />
              <div className="w-24 h-1 bg-zinc-600 rounded-full"><div className="bg-white h-full w-1/2 rounded-full"></div></div>
           </div>
        </footer>
      </div>
    )
  },
})