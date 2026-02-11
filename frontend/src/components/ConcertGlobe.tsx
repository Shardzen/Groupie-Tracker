import { useEffect, useState, useRef, useMemo } from 'react';
import Globe from 'react-globe.gl';
import { mockArtists } from '../data/mockData';
import { useNavigate } from 'react-router-dom';

export default function ConcertGlobe() {
  const globeEl = useRef<any>();
  const navigate = useNavigate();
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. Adapter la taille du globe
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

  // 2. Auto-rotation
  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.5;
      globeEl.current.pointOfView({ lat: 20, lng: 0, altitude: 2.5 });
    }
  }, []);

  // 3. Données
  const pointsData = useMemo(() => {
    return mockArtists.flatMap(artist => 
      artist.upcomingDates.map(date => ({
        lat: date.lat,
        lng: date.lng,
        label: `${artist.name} - ${date.city}`,
        artistName: artist.name,
        city: date.city,
        color: '#8b5cf6',
        size: 0.5
      }))
    );
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full bg-[#050505] relative cursor-move rounded-2xl overflow-hidden">
      <Globe
        ref={globeEl}
        width={dimensions.width}
        height={dimensions.height}
        
        // Apparence "Nuit"
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        backgroundColor="#000000"
        
        // COUCHE 1 : Les Points (Fixes)
        pointsData={pointsData}
        pointAltitude={0.07}
        pointColor={() => '#a78bfa'} 
        pointRadius={0.6}
        pointResolution={24}
        
        // COUCHE 2 : Les Anneaux (Animation Pulsation) <-- C'EST ICI LA CORRECTION
        ringsData={pointsData}
        ringColor={() => '#8b5cf6'}
        ringMaxRadius={5}
        ringPropagationSpeed={2}
        ringRepeatPeriod={1000}
        
        // Labels
        labelsData={pointsData}
        labelLat="lat"
        labelLng="lng"
        labelText="city"
        labelSize={1.5}
        labelDotRadius={0.4}
        labelColor={() => "rgba(255, 255, 255, 0.75)"}
        labelResolution={2}

        // Clic
        onPointClick={(point: any) => {
            navigate(`/tickets?search=${encodeURIComponent(point.artistName)}`);
        }}

        atmosphereColor="#8b5cf6" 
        atmosphereAltitude={0.15}
      />
      
      <div className="absolute bottom-4 left-4 text-[10px] text-white/40 pointer-events-none bg-black/50 px-2 py-1 rounded backdrop-blur-md border border-white/5">
        Maintenez pour tourner • Roulette pour zoomer
      </div>
    </div>
  );
} 