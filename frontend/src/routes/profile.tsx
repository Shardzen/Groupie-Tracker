import { createFileRoute } from '@tanstack/react-router'
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs" // On va devoir créer ce petit composant Tabs juste après !
import { User, Settings, Ticket, Heart, LogOut } from "lucide-react"

export const Route = createFileRoute('/profile')({
  component: Profile,
})

function Profile() {
  return (
    <div className="container mx-auto px-6 py-10 min-h-screen">
      
      {/* 1. En-tête du Profil */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10 border-b border-white/10 pb-10">
        <div className="flex items-center gap-6">
            {/* Avatar */}
            <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-primary to-purple-500 p-1">
                <div className="h-full w-full rounded-full bg-black flex items-center justify-center">
                    <User className="h-10 w-10 text-gray-400" />
                </div>
            </div>
            
            {/* Infos */}
            <div>
                <h1 className="text-3xl font-bold text-white">Mon Profil</h1>
                <p className="text-gray-400">Membre depuis 2024</p>
                <div className="mt-2 flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold border border-primary/20">
                        Membre Gold
                    </span>
                </div>
            </div>
        </div>

        <div className="flex gap-3">
            <Button variant="outline" size="sm" className="border-white/10 text-gray-400 hover:text-white">
                <Settings className="mr-2 h-4 w-4" /> Paramètres
            </Button>
            <Button variant="danger" size="sm">
                <LogOut className="mr-2 h-4 w-4" /> Déconnexion
            </Button>
        </div>
      </div>

      {/* 2. Contenu (Billets & Favoris) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Colonne Principale (Billets) */}
        <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
                <Ticket className="text-primary" /> Mes Billets
            </h2>
            
            {/* Billet 1 */}
            <Card className="bg-white/5 border-white/10 overflow-hidden flex flex-col md:flex-row">
                <div className="w-full md:w-32 bg-primary/20 flex flex-col items-center justify-center p-4 border-b md:border-b-0 md:border-r border-white/10">
                    <span className="text-2xl font-bold text-primary">12</span>
                    <span className="text-sm uppercase font-bold text-white">OCT</span>
                </div>
                <div className="flex-1 p-6 flex flex-col justify-center">
                    <h3 className="text-xl font-bold text-white">Techno Bunker Berlin</h3>
                    <p className="text-gray-400">Warehouse, Paris • 2 billets</p>
                </div>
                <div className="p-6 flex items-center">
                    <Button variant="secondary">Voir le QR Code</Button>
                </div>
            </Card>

             {/* Billet 2 (Passé) */}
             <Card className="bg-white/5 border-white/10 overflow-hidden flex flex-col md:flex-row opacity-60">
                <div className="w-full md:w-32 bg-gray-800 flex flex-col items-center justify-center p-4 border-b md:border-b-0 md:border-r border-white/10">
                    <span className="text-2xl font-bold text-gray-400">05</span>
                    <span className="text-sm uppercase font-bold text-gray-500">SEPT</span>
                </div>
                <div className="flex-1 p-6 flex flex-col justify-center">
                    <h3 className="text-lg font-bold text-white">Summer Festival</h3>
                    <p className="text-gray-400">Événement passé</p>
                </div>
                <div className="p-6 flex items-center">
                    <Button variant="outline" disabled>Archivé</Button>
                </div>
            </Card>
        </div>

        {/* Colonne Latérale (Statistiques / Favoris) */}
        <div className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
                <Heart className="text-red-500" /> Artistes Favoris
            </h2>
            <Card className="bg-white/5 border-white/10">
                <CardContent className="p-0">
                    {[1, 2, 3].map((_, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors cursor-pointer">
                            <div className="h-10 w-10 rounded-full bg-gray-700" />
                            <div>
                                <p className="font-bold text-sm text-white">Artist Name</p>
                                <p className="text-xs text-gray-500">Techno • 12 events</p>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>

      </div>
    </div>
  )
}