import { Check, Sparkles, X, Crown, Zap, Shield } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function TicketsPage() {
  const plans = [
    {
      name: "Explorateur",
      price: "0€",
      period: "/mois",
      description: "Pour découvrir les artistes émergents.",
      features: ["Écoute avec publicités", "Qualité audio standard", "Accès aux Artistes", "Pas de mode hors-ligne"],
      highlight: false,
      icon: <Zap className="w-6 h-6" />,
      color: "from-zinc-500 to-zinc-700"
    },
    {
      name: "Premium Gold",
      price: "9.99€",
      period: "/mois",
      description: "L'expérience musicale sans limites.",
      features: ["Zéro publicité", "Qualité audio Haute Fidélité", "Mode Hors-ligne illimité", "Accès aux préventes concerts"],
      highlight: true, // Met cette carte en avant
      icon: <Sparkles className="w-6 h-6 text-black" />,
      color: "from-amber-300 via-yellow-500 to-amber-600"
    },
    {
      name: "Platinum VIP",
      price: "19.99€",
      period: "/mois",
      description: "Pour les vrais passionnés de live.",
      features: ["Tout du Premium Gold", "Audio Spatial (Dolby Atmos)", "Rencontres Artistes (Meet & Greet)", "Merch exclusif offert"],
      highlight: false,
      icon: <Crown className="w-6 h-6" />,
      color: "from-violet-500 to-fuchsia-600"
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-violet-500 selection:text-white pb-20 pt-24">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      {/* Header */}
      <div className="text-center px-6 mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 text-violet-400 text-xs font-bold uppercase tracking-widest mb-4">
            <Shield size={12} /> Abonnements Sécurisés
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter">
          PASSEZ AU NIVEAU <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500">SUPÉRIEUR.</span>
        </h1>
        <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
          Choisissez l'offre qui correspond à votre rythme de vie. Annulable à tout moment.
        </p>
      </div>

      {/* Grille des Prix */}
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl items-center">
        {plans.map((plan, index) => (
          <div 
            key={plan.name}
            className={`relative group rounded-3xl p-1 transition-all duration-500 ${plan.highlight ? 'scale-105 z-10' : 'hover:scale-105'}`}
          >
            {/* Bordure animée (Gradient) */}
            <div className={`absolute inset-0 bg-gradient-to-b ${plan.color} rounded-3xl opacity-20 group-hover:opacity-100 blur-xl transition-opacity duration-500`}></div>
            <div className={`absolute inset-0 bg-gradient-to-b ${plan.color} rounded-3xl opacity-50`}></div>
            
            {/* Contenu de la carte */}
            <div className="relative bg-[#0e0e0e] h-full rounded-[22px] p-8 flex flex-col border border-white/10 group-hover:border-transparent transition-colors">
                
                {plan.highlight && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-amber-300 to-yellow-500 text-black font-bold text-xs uppercase px-4 py-1 rounded-full shadow-lg shadow-yellow-500/50">
                        Le plus populaire
                    </div>
                )}

                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-6 shadow-lg`}>
                    {plan.icon}
                </div>

                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-zinc-400 text-sm mb-6 h-10">{plan.description}</p>
                
                <div className="flex items-end gap-1 mb-8">
                    <span className="text-4xl font-black">{plan.price}</span>
                    <span className="text-zinc-500 font-medium mb-1">{plan.period}</span>
                </div>

                <button className={`w-full py-4 rounded-xl font-bold text-sm transition-all duration-300 mb-8 ${
                    plan.highlight 
                    ? 'bg-gradient-to-r from-amber-300 to-yellow-500 text-black hover:shadow-[0_0_30px_rgba(252,211,77,0.6)] hover:scale-105' 
                    : 'bg-white/10 hover:bg-white text-white hover:text-black'
                }`}>
                    Choisir {plan.name}
                </button>

                <div className="space-y-4 flex-1">
                    {plan.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm">
                            {feature.startsWith("Pas") || feature.includes("publicités") && plan.name === "Explorateur" ? (
                                <div className="p-1 rounded-full bg-zinc-800 text-zinc-500"><X size={10} /></div>
                            ) : (
                                <div className={`p-1 rounded-full ${plan.highlight ? 'bg-yellow-500/20 text-yellow-500' : 'bg-violet-500/20 text-violet-500'}`}><Check size={10} /></div>
                            )}
                            <span className={feature.startsWith("Pas") ? "text-zinc-500" : "text-zinc-300"}>{feature}</span>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}