import { useEffect, useState } from 'react';
import { usePlayerStore } from '../stores/usePlayerStore';
import { X, ExternalLink } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
export default function Player() {
  const { currentTrack, close } = usePlayerStore();
  const [widgetUrl, setWidgetUrl] = useState<string>('');
  const [hasWidget, setHasWidget] = useState(false);
  const [loading, setLoading] = useState(false);

useEffect(() => {
    if (currentTrack) {
      setLoading(true);
      
      const artistParam = encodeURIComponent(currentTrack.artist);
      const trackParam = encodeURIComponent(currentTrack.title);

      fetch(`${API_BASE_URL}/api/deezer/widget?artist=${artistParam}&track=${trackParam}`)
        .then(res => res.json())
        .then(data => {
          setHasWidget(data.has_widget);
          setWidgetUrl(data.has_widget ? data.widget_url : data.search_url);
          setLoading(false);
        })
        .catch(err => {
          console.error('Erreur Backend Deezer:', err);
          setLoading(false);
        });
    }
  }, [currentTrack]);

  if (!currentTrack) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      onClick={close}
    >
      <div 
        className="bg-[#121212] rounded-2xl shadow-2xl max-w-2xl w-full border border-white/10 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#181818]">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg overflow-hidden shadow-lg border border-white/10 shrink-0">
              <img 
                src={currentTrack.image} 
                alt={currentTrack.title} 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-bold text-white text-xl line-clamp-1">{currentTrack.artist}</h3>
              <p className="text-sm text-zinc-400">
                  {loading ? "Chargement..." : "Lecteur Deezer"}
              </p>
            </div>
          </div>
          
          <button 
            onClick={close}
            className="text-zinc-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 min-h-[300px] flex flex-col justify-center bg-[#121212]">
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : hasWidget ? (
            <div className="space-y-4">
               <div className="rounded-xl overflow-hidden shadow-lg border border-white/5 bg-[#191922]">
                <iframe
                    title="Deezer Widget"
                    src={widgetUrl}
                    width="100%"
                    height="300"
                    frameBorder="0"
                    allowTransparency={true}
                    allow="encrypted-media; clipboard-write"
                    sandbox="allow-scripts allow-same-origin allow-popups allow-presentation"
                />
               </div>
            </div>
          ) : (
            <div className="text-center space-y-6">
              <div className="text-6xl animate-bounce">🎵</div>
              <div>
                  <h4 className="text-xl font-bold text-white mb-2">
                    Écouter sur Deezer
                  </h4>
                  <p className="text-zinc-400">
                    Le widget intégré n'est pas disponible pour cet artiste.
                  </p>
              </div>
              <a
                href={widgetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-3 rounded-full transition-all transform hover:scale-105 shadow-lg"
              >
                <ExternalLink size={20} />
                Chercher sur Deezer
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}