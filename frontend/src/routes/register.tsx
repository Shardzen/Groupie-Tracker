import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Music2, ArrowLeft } from "lucide-react"

export const Route = createFileRoute('/register')({
  component: Register,
})

function Register() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black relative overflow-hidden p-4">
      
      {/* Fond d'ambiance (cette fois un peu plus bleu/cyan pour changer subtilement) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="absolute top-8 left-8">
        <Link to="/" className="flex items-center text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour
        </Link>
      </div>

      <Card className="w-full max-w-md border-white/10 bg-black/60 backdrop-blur-xl relative z-10 shadow-2xl">
        <CardHeader className="space-y-1 flex flex-col items-center text-center">
          <div className="h-12 w-12 bg-primary rounded-full flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(124,58,237,0.5)]">
            <Music2 className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">Créer un compte</CardTitle>
          <CardDescription>
            Rejoignez la communauté SoundWave gratuitement
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="firstname">Prénom</Label>
                <Input id="firstname" placeholder="Jean" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="lastname">Nom</Label>
                <Input id="lastname" placeholder="Dupont" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="exemple@gmail.com" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input id="password" type="password" />
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full" size="lg">S'inscrire</Button>
          
          <div className="text-center text-sm text-gray-400">
            Déjà un compte ?{" "}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Se connecter
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}