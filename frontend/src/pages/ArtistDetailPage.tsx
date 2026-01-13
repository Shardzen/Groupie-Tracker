import { useState, useEffect } from 'react';
import { useParams, Link } from '@tanstack/react-router';
import Navbar from '../components/Navbar';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Users,
  Music2,
  Sparkles,
  Clock,
  Ticket,
  Heart,
  Share2,
  Play,
  ExternalLink,
} from 'lucide-react';

interface Artist {
  id: number;
  name: string;
  image: string;
  members: string[];
  creationDate: number;
  firstAlbum: string;
  locations: string[];
  concertDates: string[];
}

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export default function ArtistDetailPage() {
  const { id } = useParams({ from: '/artists/$id' });
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    fetchArtist();
  }, [id]);

  const fetchArtist = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/artists/${id}`);

      if (!response.ok) {
        throw new Error(`Erreur serveur (${response.status})`);
      }

      const data = await response.json();
      setArtist(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      console.error('Erreur lors du chargement de l\'artiste:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 bg-violet-500/20 rounded-full blur-xl animate-pulse"></div>
            <div className="relative spinner border-4 border-violet-500/20 border-t-violet-500 w-full h-full"></div>
          </div>
          <p className="text-slate-400 text-lg">Chargement des détails...</p>
        </div>
      </div>
    );
  }

  if (error || !artist) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-md mx-auto glass-card rounded-2xl p-8">
            <h1 className="text-3xl font-bold text-red-400 mb-4">Erreur</h1>
            <p className="text-slate-400 mb-6">{error || 'Artiste introuvable'}</p>
            <Link to="/">
              <button className="btn-primary">Retour à l'accueil</button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      <Navbar />

      {/* Hero Section with Background Image */}
      <div className="relative h-[60vh] min-h-[500px]">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          {!imageLoaded && <div className="skeleton absolute inset-0"></div>}
          <img
            src={artist.image}
            alt={artist.name}
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover transition-opacity duration-700 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/80 to-slate-950"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 h-full relative z-10 flex flex-col justify-end pb-12">
          {/* Back Button */}
          <Link to="/">
            <button className="absolute top-24 left-4 glass-effect px-4 py-2 rounded-xl text-white hover:bg-white/20 transition-all duration-300 flex items-center gap-2 group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Retour</span>
            </button>
          </Link>

          {/* Artist Info */}
          <div className="animate-fadeIn">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full glass-effect">
                <Calendar className="w-4 h-4 text-violet-400" />
                <span className="text-white font-semibold text-sm">
                  Depuis {artist.creationDate}
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full glass-effect">
                <Users className="w-4 h-4 text-purple-400" />
                <span className="text-white font-semibold text-sm">
                  {artist.members.length} membres
                </span>
              </div>
              {artist.concertDates.length > 0 && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-600/80 to-purple-600/80 backdrop-blur-sm">
                  <Sparkles className="w-4 h-4 text-white" />
                  <span className="text-white font-bold text-sm">
                    {artist.concertDates.length} concerts
                  </span>
                </div>
              )}
            </div>

            {/* Artist Name */}
            <h1 className="text-6xl md:text-8xl font-black text-white mb-4 text-display">
              {artist.name}
            </h1>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <button className="btn-primary flex items-center gap-3 px-8 py-4">
                <Ticket className="w-5 h-5" />
                <span className="font-bold">Réserver des billets</span>
              </button>

              <button className="px-6 py-4 rounded-xl bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/20 hover:border-violet-500/50 text-white font-bold transition-all duration-300 flex items-center gap-2 group">
                <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Écouter</span>
              </button>

              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`px-4 py-4 rounded-xl backdrop-blur-sm border transition-all duration-300 ${
                  isLiked
                    ? 'bg-red-500/20 border-red-500/50 text-red-400'
                    : 'bg-white/5 hover:bg-white/10 border-white/20 hover:border-violet-500/50 text-white'
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              </button>

              <button className="px-4 py-4 rounded-xl bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/20 hover:border-violet-500/50 text-white transition-all duration-300">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Info Card */}
            <div className="glass-card rounded-2xl p-8 animate-fadeIn">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <Music2 className="w-8 h-8 text-violet-400" />
                <span>Informations</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">
                    Premier Album
                  </p>
                  <p className="text-white text-lg font-semibold">{artist.firstAlbum}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">
                    Année de création
                  </p>
                  <p className="text-white text-lg font-semibold">{artist.creationDate}</p>
                </div>
              </div>
            </div>

            {/* Members Card */}
            <div className="glass-card rounded-2xl p-8 animate-fadeIn animate-delay-100">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <Users className="w-8 h-8 text-purple-400" />
                <span>Membres du groupe</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {artist.members.map((member, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-violet-500/30 transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform">
                      {member.charAt(0)}
                    </div>
                    <span className="text-white font-semibold">{member}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Concert Dates */}
            {artist.concertDates.length > 0 && (
              <div className="glass-card rounded-2xl p-8 animate-fadeIn animate-delay-200">
                <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                  <Clock className="w-8 h-8 text-pink-400" />
                  <span>Prochains concerts</span>
                </h2>

                <div className="space-y-3">
                  {artist.concertDates.slice(0, 5).map((date, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-violet-500/30 transition-all duration-300 group cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-white font-semibold">{date}</span>
                      </div>
                      <ExternalLink className="w-5 h-5 text-slate-400 group-hover:text-violet-400 transition-colors" />
                    </div>
                  ))}
                </div>

                {artist.concertDates.length > 5 && (
                  <button className="w-full mt-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-violet-500/50 text-white font-semibold transition-all duration-300">
                    Voir tous les {artist.concertDates.length} concerts
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Locations Card */}
            {artist.locations.length > 0 && (
              <div className="glass-card rounded-2xl p-8 animate-fadeIn">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <MapPin className="w-7 h-7 text-violet-400" />
                  <span>Lieux de concert</span>
                </h2>

                <div className="space-y-2">
                  {artist.locations.map((location, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 group"
                    >
                      <MapPin className="w-4 h-4 text-violet-400 flex-shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="text-slate-300 text-sm font-medium">{location}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA Card */}
            <div className="glass-card rounded-2xl p-8 animate-fadeIn animate-delay-100">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Ne ratez rien</h3>
                <p className="text-slate-400">
                  Soyez alerté des prochains concerts de {artist.name}
                </p>
                <button className="btn-primary w-full">
                  S'abonner aux alertes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-20">
        <div className="container mx-auto px-4 py-12 text-center text-slate-500">
          <p className="mb-2">
            Powered by <span className="text-violet-400 font-semibold">YNOT</span>
          </p>
          <p className="text-sm">© 2026 - Tous droits réservés</p>
        </div>
      </footer>
    </div>
  );
}
