import { XCircle, ArrowLeft } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

export default function VerifyError() {
  const [searchParams] = useSearchParams();
  const reason = searchParams.get('reason');

  let errorMessage = "Le lien de vérification est invalide ou a expiré.";
  if (reason === "expired") {
    errorMessage = "Le lien de vérification a expiré. Veuillez en demander un nouveau.";
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl text-center shadow-2xl">
        <div className="w-20 h-20 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/30">
          <XCircle className="text-red-400 w-10 h-10" />
        </div>
        
        <h1 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">
          Erreur de Vérification
        </h1>
        
        <p className="text-slate-400 mb-8 leading-relaxed">
          {errorMessage}
        </p>

        <Link 
          to="/login" 
          className="w-full bg-white text-black font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-violet-600 hover:text-white transition-all shadow-lg shadow-white/5"
        >
          <ArrowLeft size={20} /> Retour à la connexion
        </Link>
      </div>
    </div>
  );
}
