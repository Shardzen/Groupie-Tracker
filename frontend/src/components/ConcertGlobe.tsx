import { useEffect, useState, useRef, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import Globe from 'react-globe.gl';
import { mockArtists } from '../data/mockData';
import { useNavigate } from 'react-router-dom';
import { X, Ticket, Calendar, MapPin } from 'lucide-react';

interface ConcertData {
  lat: number;
  lng: number;
  artistName: string;
  city: string;
  date: string;
  image: string;
  id?: string | number;
}

interface ConcertGlobeProps {
  focusedLocation?: ConcertData | null;
  onClose?: () => void; 
}

// --- LE PIN QUI SAUTILLE + LA CARTE ---
const BouncingMarker = ({ data, onClose, onReserve }: { data: ConcertData, onClose: () => void, onReserve: () => void }) => {
  return (
    // On positionne le tout pour que la pointe du pin touche le sol (-translate-y-full)
    <div className="pointer-events-auto flex flex-col items-center transform -translate-x-1/2 -translate-y-[90%]">
        
        {/* 1. LA CARTE (Fixe au-dessus du pin) */}
        <div className="mb-2 bg-[#121212]/90 backdrop-blur-md border border-violet-500/30 p-3 rounded-xl shadow-[0_0_30px_rgba(139,92,246,0.3)] w-[200px] flex flex-col gap-2 animate-fade-in-up">
             {/* Croix fermer */}
            <button 
                onMouseUp={(e) => { e.stopPropagation(); onClose(); }}
                className="absolute -top-2 -right-2 bg-zinc-800 text-zinc-400 hover:text-white p-1 rounded-full border border-white/10 shadow-sm z-20 cursor-pointer"
            >
                <X size={12} />
            </button>

            {/* Info Concert */}
            <div className="flex items-center gap-3">
                <img src={data.image} alt={data.artistName} className="w-8 h-8 rounded object-cover border border-white/10" />
                <div>
                    <h3 className="font-bold text-white text-xs uppercase">{data.artistName}</h3>
                    <div className="flex items-center gap-1 text-[10px] text-zinc-400">
                        <MapPin size={8} /> {data.city}
                    </div>
                </div>
            </div>

            {/* Bouton Réserver */}
            <button
                onMouseUp={(e) => { e.stopPropagation(); onReserve(); }}
                className="w-full py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded text-[10px] font-bold uppercase transition-all flex items-center justify-center gap-1 shadow-lg cursor-pointer"
            >
                <Ticket size={10} /> Réserver
            </button>
        </div>

        {/* 2. LE PIN QUI SAUTILLE (Animation) */}
        <div className="relative flex flex-col items-center justify-end h-16 w-16">
            
            {/* L'icône Pin qui bouge (animate-bounce) */}
            <div className="animate-bounce z-10 drop-shadow-[0_0_15px_rgba(167,139,250,0.8)]">
                {/* On utilise un SVG rempli pour bien le voir */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-10 h-10 text-violet-500"
                >
                  <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
            </div>

            {/* L'ombre au sol (animate-pulse) pour l'effet de profondeur */}
            <div className="absolute bottom-1 w-4 h-1.5 bg-black/60 rounded-[100%] blur-[2px] animate-pulse"></div>
            
            {/* Petit point d'ancrage précis au centre */}
            <div className="absolute bottom-0 w-1 h-1 bg-white rounded-full"></div>
        </div>

    </div>
  );
};

export default function ConcertGlobe({ focusedLocation, onClose }: ConcertGlobeProps) {
  const globeEl = useRef<any>();
  const navigate = useNavigate();
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [internalFocus, setInternalFocus] = useState<ConcertData | null>(null);

  useEffect(() => {
    if (focusedLocation) setInternalFocus(focusedLocation);
  }, [focusedLocation]);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };
    setTimeout(handleResize, 100);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (globeEl.current && internalFocus) {
      globeEl.current.controls().autoRotate = false;
      globeEl.current.pointOfView({ 
        lat: internalFocus.lat, 
        lng: internalFocus.lng, 
        altitude: 0.5 
      }, 1500);
    } else if (globeEl.current && !internalFocus) {
        globeEl.current.controls().autoRotate = true;
    }
  }, [internalFocus]);

  const pointsData = useMemo(() => {
    return mockArtists.flatMap(artist => 
      artist.upcomingDates.map(date => ({
        lat: date.lat,
        lng: date.lng,
        artistName: artist.name,
        city: date.city,
        date: date.date,
        image: artist.image,
        color: '#8b5cf6',
        size: 0.5
      }))
    );
  }, []);

  const handleClose = () => {
      setInternalFocus(null);
      if (onClose) onClose();
  };

  return (
    <div ref={containerRef} className="w-full h-full bg-[#050505] relative cursor-move rounded-2xl overflow-hidden shadow-2xl border border-white/10">
      <Globe
        ref={globeEl}
        width={dimensions.width}
        height={dimensions.height}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        backgroundColor="#000000"
        
        pointsData={pointsData}
        pointAltitude={0.07}
        pointColor={() => '#a78bfa'} 
        pointRadius={0.6}
        pointResolution={24}
        
        ringsData={pointsData}
        ringColor={() => '#8b5cf6'}
        ringMaxRadius={5}
        ringPropagationSpeed={2}
        ringRepeatPeriod={1000}

        onPointClick={(point: any) => setInternalFocus(point as ConcertData)}
        
        htmlElementsData={internalFocus ? [internalFocus] : []}
        htmlLat="lat"
        htmlLng="lng"
        htmlAltitude={0}
        
        htmlElement={(d: any) => {
            const el = document.createElement('div');
            const root = createRoot(el);
            root.render(
                <BouncingMarker 
                    data={d} 
                    onClose={handleClose} 
                    onReserve={() => navigate(`/tickets?search=${encodeURIComponent(d.artistName)}`)} 
                />
            );
            return el;
        }}

        atmosphereColor="#8b5cf6" 
        atmosphereAltitude={0.15}
      />
      <div className="absolute bottom-4 left-4 text-[10px] text-white/30 pointer-events-none bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/5">
        Tourner : Clic gauche • Zoom : Molette
      </div>
    </div>
  );
}