import { useAuthStore } from '../stores/useAuthStore';
import { User, Mail, Shield, Calendar } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuthStore(); // On récupère l'utilisateur connecté

  if (!user) return <div className="text-white">Chargement...</div>;

  return (
    <div className="min-h-screen bg-slate-950 p-8 pt-24">
      <div className="max-w-2xl mx-auto bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-2xl flex items-center justify-center text-4xl font-black text-white">
            {user.first_name[0]}{user.last_name[0]}
          </div>
          <div>
            <h1 className="text-3xl font-black text-white">{user.first_name} {user.last_name}</h1>
            <p className="text-slate-400">Membre Groupie Tracker</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
            <Mail className="text-violet-400" />
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold">Email</p>
              <p className="text-white font-medium">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
            <Shield className="text-green-400" />
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold">Statut du compte</p>
              <p className="text-white font-medium">
                {user.email_verified ? "Vérifié ✅" : "Non vérifié ⚠️"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}