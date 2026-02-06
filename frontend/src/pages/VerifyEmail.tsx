import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { toast } from 'sonner';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const [status, setStatus] = useState('Vérification en cours...');

  useEffect(() => {
    const verify = async () => {
      try {
        await api.get(`/auth/verify-email?token=${token}`);
        toast.success('Email vérifié avec succès !');
        setStatus('Compte activé ! Redirection...');
        setTimeout(() => navigate('/login'), 3000);
      } catch (err) {
        setStatus('Lien invalide ou expiré.');
        toast.error('Erreur de vérification');
      }
    };
    if (token) verify();
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
      <div className="bg-white/5 p-8 rounded-2xl border border-white/10 text-center">
        <h1 className="text-2xl font-bold mb-4">Vérification de l'email</h1>
        <p className="text-slate-400">{status}</p>
      </div>
    </div>
  );
}