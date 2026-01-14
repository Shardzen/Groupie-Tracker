import { createFileRoute } from '@tanstack/react-router'
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "../components/ui/card"
import { Search, Calendar, MapPin, SlidersHorizontal } from "lucide-react"

export const Route = createFileRoute('/concerts')({
  component: Concerts,
})

// Données fictives pour simuler une base de données d'événements
const allEvents = [
  { id: 1, title: "Acid Night", artist: "Charlotte de Witte", date: "12 Oct", location: "Warehouse, Paris", price: "25€", image: "https://images.unsplash.com/photo-1514525253440-b393452e23f0?q=80&w=800&auto=format&fit=crop", tag: "Techno" },
  { id: 2, title: "Sunset Vibes", artist: "Folamour", date: "15 Oct", location: "Le Perchoir, Paris", price: "18€", image: "https://images.unsplash.com/photo-1459749411177-0473ef716175?q=80&w=800&auto=format&fit=crop", tag: "House" },
  { id: 3, title: "Bass Culture", artist: "Chase & Status", date: "22 Oct", location: "Trabendo, Paris", price: "30€", image: "https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=800&auto=format&fit=crop", tag: "DnB" },
  { id: 4, title: "Melodic Dreams", artist: "Ben Böhmer", date: "28 Oct", location: "Zénith, Paris", price: "45€", image: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=800&auto=format&fit=crop", tag: "Deep House" },
  { id: 5, title: "Hard Techno War", artist: "I Hate Models", date: "31 Oct", location: "Parc Expo, Paris", price: "35€", image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop", tag: "Hard Techno" },
  { id: 6, title: "Groove Session", artist: "Mochakk", date: "05 Nov", location: "Phantom, Paris", price: "22€", image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=800&auto=format&fit=crop", tag: "Tech House" },
]

function Concerts() {
  return (
    <div className="container mx-auto px-6 py-10 min-h-screen">
      
      {/* 1. En-tête avec Recherche et Filtres */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white tracking-tight">Prochains Événements ⚡️</h1>
          <p className="text-gray-400">Trouvez votre prochaine sortie parmi les meilleures soirées.</p>
        </div>
        
        {/* Barre d'outils (Recherche + Filtres) */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto bg-white/5 p-2 rounded-xl border border-white/10">
            <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input placeholder="Rechercher un artiste..." className="pl-9 bg-transparent border-none focus-visible:ring-0" />
            </div>
            <div className="h-px w-full sm:h-auto sm:w-px bg-white/10" /> {/* Séparateur */}
            <Button variant="ghost" className="text-gray-400 hover:text-white">
                <SlidersHorizontal className="mr-2 h-4 w-4" /> Filtres
            </Button>
        </div>
      </div>

      {/* 2. Les Tags de catégories (Style Shotgun) */}
      <div className="flex gap-2 overflow-x-auto pb-6 mb-2 no-scrollbar">
        {["Tout", "Techno", "House", "DnB", "Trance", "Electro"].map((tag, i) => (
            <button key={tag} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${i === 0 ? "bg-white text-black" : "bg-white/5 text-gray-300 hover:bg-white/10"}`}>
                {tag}
            </button>
        ))}
      </div>

      {/* 3. La Grille des Concerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allEvents.map((event) => (
            <Card key={event.id} className="group overflow-hidden border-white/10 bg-white/5 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(124,58,237,0.15)] cursor-pointer">
              {/* Image */}
              <div className="relative h-48 w-full overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/10">
                  {event.tag}
                </div>
              </div>

              {/* Contenu */}
              <CardHeader>
                <CardTitle className="text-xl text-white group-hover:text-primary transition-colors">
                  {event.title}
                </CardTitle>
                <CardDescription className="text-base font-medium text-gray-400">
                  {event.artist}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>{event.date} • 23:00 - 06:00</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>{event.location}</span>
                </div>
              </CardContent>

              <CardFooter className="flex items-center justify-between border-t border-white/5 pt-4 mt-2">
                <div className="flex flex-col">
                    <span className="text-xs text-gray-500">À partir de</span>
                    <span className="text-lg font-bold text-white">{event.price}</span>
                </div>
                <Button size="sm">Acheter</Button>
              </CardFooter>
            </Card>
        ))}
      </div>
      
      {/* Bouton Voir plus */}
      <div className="mt-12 flex justify-center">
        <Button variant="outline" className="w-40 border-white/10 hover:bg-white/5">Voir plus</Button>
      </div>
    </div>
  )
}