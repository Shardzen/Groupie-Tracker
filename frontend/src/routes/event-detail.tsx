import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card"
import { Calendar, MapPin, Clock, Share2, Info, ArrowLeft } from "lucide-react"

export const Route = createFileRoute('/event-detail')({
  component: EventDetail,
})

function EventDetail() {
  return (
    <div className="min-h-screen bg-black pb-24">
      
      {/* 1. HERO HEADER (Image géante) */}
      <div className="relative h-[60vh] w-full">
        <img 
          src="https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=2000&auto=format&fit=crop" 
          alt="Event cover" 
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        
        <Link to="/concerts" className="absolute top-24 left-6 z-20">
             <Button variant="ghost" className="text-white bg-black/20 backdrop-blur-md hover:bg-black/40 rounded-full">
                <ArrowLeft className="mr-2 h-4 w-4" /> Retour
             </Button>
        </Link>

        {/* Titre flottant en bas de l'image */}
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 z-10 flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="space-y-2">
                <span className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-full uppercase tracking-wider">
                    Techno
                </span>
                <h1 className="text-4xl md:text-6xl font-black text-white leading-none">Techno Bunker Berlin</h1>
                <p className="text-xl text-gray-300 font-medium">Avec KlangKuenstler • Kobosil • 999999999</p>
            </div>
            
            <div className="flex gap-3">
                <Button variant="secondary" size="icon" className="rounded-full h-12 w-12">
                    <Share2 className="h-5 w-5" />
                </Button>
                <Button size="lg" className="rounded-full px-8 text-lg h-12 shadow-[0_0_40px_rgba(124,58,237,0.4)] animate-pulse-slow">
                    Acheter un billet
                </Button>
            </div>
        </div>
      </div>

      {/* 2. CONTENU PRINCIPAL (2 Colonnes) */}
      <div className="container mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Colonne Gauche : Infos & Lineup */}
            <div className="lg:col-span-2 space-y-10">
                
                {/* Bloc Infos Pratiques */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-primary">
                            <Calendar className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Date</p>
                            <p className="font-bold text-white">Sam. 12 Octobre</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-primary">
                            <Clock className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Horaires</p>
                            <p className="font-bold text-white">23:00 - 07:00</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-primary">
                            <MapPin className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Lieu</p>
                            <p className="font-bold text-white">Warehouse, Paris</p>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Info className="text-primary" /> À propos
                    </h2>
                    <p className="text-gray-400 leading-relaxed">
                        Préparez-vous pour une nuit intense au cœur de la zone industrielle. 
                        Le collectif berlinois débarque à Paris pour une soirée Warehouse exclusive. 
                        Système son L-Acoustics calibré, show lumière immersif et 8h de son non-stop.
                    </p>
                    <p className="text-gray-400 leading-relaxed">
                        Interdit aux mineurs. Carte d'identité obligatoire.
                    </p>
                </div>

                {/* Line Up (Liste des artistes) */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white">Line Up</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {["KlangKuenstler", "Kobosil", "999999999", "Nico Moreno"].map((dj) => (
                            <div key={dj} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                                <div className="h-12 w-12 rounded-full bg-gray-700" />
                                <div>
                                    <p className="font-bold text-white text-lg">{dj}</p>
                                    <p className="text-xs text-primary uppercase font-bold">Headliner</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Colonne Droite : Billetterie (Sticky) */}
            <div className="relative">
                <div className="sticky top-24 space-y-6">
                    <Card className="bg-white/5 border-white/10 p-6 space-y-6">
                        <h3 className="text-xl font-bold text-white">Billetterie</h3>
                        
                        <div className="space-y-3">
                            {/* Billet 1 */}
                            <div className="flex justify-between items-center p-3 rounded-lg border border-white/10 bg-black/20 opacity-50 cursor-not-allowed">
                                <div>
                                    <p className="font-bold text-gray-400">Early Bird</p>
                                    <p className="text-xs text-gray-500">Épuisé</p>
                                </div>
                                <span className="text-gray-500 font-bold">15€</span>
                            </div>

                            {/* Billet 2 (Actif) */}
                            <div className="flex justify-between items-center p-3 rounded-lg border border-primary/50 bg-primary/10 ring-1 ring-primary cursor-pointer hover:bg-primary/20 transition-colors">
                                <div>
                                    <p className="font-bold text-white">Regular</p>
                                    <p className="text-xs text-green-400">En vente</p>
                                </div>
                                <div className="text-right">
                                    <span className="block font-bold text-white">25€</span>
                                    <span className="text-xs text-gray-400">+1€ frais</span>
                                </div>
                            </div>

                            {/* Billet 3 */}
                            <div className="flex justify-between items-center p-3 rounded-lg border border-white/10 bg-black/20 hover:border-white/30 cursor-pointer transition-colors">
                                <div>
                                    <p className="font-bold text-white">Late Ticket</p>
                                    <p className="text-xs text-gray-400">Bientôt</p>
                                </div>
                                <span className="text-white font-bold">35€</span>
                            </div>
                        </div>

                        <Button className="w-full text-lg py-6" size="lg">
                            Commander (25€)
                        </Button>
                        <p className="text-xs text-center text-gray-500">Paiement 100% sécurisé</p>
                    </Card>
                </div>
            </div>

        </div>
      </div>
    </div>
  )
}