import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from "../components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Calendar, MapPin, ArrowRight, Play } from "lucide-react";

export const Route = createFileRoute('/')({
  component: Index,
})

const featuredEvents = [
  {
    id: 1,
    title: "Techno Bunker Berlin",
    artist: "KlangKuenstler",
    date: "12 Octobre • 23:00",
    location: "Warehouse, Paris",
    price: "25€",
    image: "https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=800&auto=format&fit=crop",
    category: "Techno"
  },
  {
    id: 2,
    title: "Neon Nights Tour",
    artist: "The Midnight",
    date: "15 Octobre • 20:00",
    location: "L'Olympia, Paris",
    price: "45€",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop",
    category: "Synthwave"
  },
  {
    id: 3,
    title: "Underground Vibes",
    artist: "Charlotte de Witte",
    date: "22 Octobre • 23:30",
    location: "Phantom, Paris",
    price: "30€",
    image: "https://images.unsplash.com/photo-1514525253440-b393452e23f0?q=80&w=800&auto=format&fit=crop",
    category: "Acid"
  }
];

function Index() {
  return (
    <div className="flex flex-col gap-10 pb-20">
      
      {/* 1. HERO SECTION (L'accroche visuelle) */}
      <section className="relative h-[80vh] w-full overflow-hidden flex items-center justify-center">
        {/* Fond d'image sombre avec dégradé */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=2000&auto=format&fit=crop" 
            alt="Hero background" 
            className="h-full w-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>

        {/* Contenu du Hero */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-6">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-white drop-shadow-2xl">
            Vivez la musique <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">
              de l'intérieur.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            Découvrez les meilleurs événements techno, house et électro près de chez vous.
            Réservez vos places en une seconde.
          </p>
          
          <div className="flex items-center justify-center gap-4 pt-4">
            <Link to="/concerts">
              <Button size="lg" className="rounded-full px-8 text-lg">
                Explorer les événements
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="rounded-full px-8 text-lg backdrop-blur-sm bg-white/5 border-white/20 text-white hover:bg-white/10">
              <Play className="mr-2 h-4 w-4" /> Voir la démo
            </Button>
          </div>
        </div>
      </section>

      {/* 2. SECTION TENDANCES (La Grille) */}
      <section className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Tendance cette semaine 🔥</h2>
          <Link to="/concerts">
            <Button variant="ghost" className="text-primary hover:text-primary/80">
              Tout voir <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* La Grille de Cartes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredEvents.map((event) => (
            <Card key={event.id} className="group overflow-hidden border-white/10 bg-white/5 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(124,58,237,0.15)]">
              {/* Image de la carte */}
              <div className="relative h-48 w-full overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/10">
                  {event.category}
                </div>
              </div>

              {/* Contenu de la carte */}
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
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>{event.location}</span>
                </div>
              </CardContent>

              <CardFooter className="flex items-center justify-between border-t border-white/5 pt-4 mt-2">
                <span className="text-lg font-bold text-white">{event.price}</span>
                <Button size="sm" variant="secondary">Réserver</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

    </div>
  )
}