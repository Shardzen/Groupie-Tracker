import { useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { mockArtists } from '../data/mockData';
import { Calendar, Ticket, Globe, Navigation } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '16px',
};

const defaultCenter = {
  lat: 48.8566,
  lng: 2.3522
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
  styles: [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
    { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
    { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#263c3f" }] },
    { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#6b9a76" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
    { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
    { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
    { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#746855" }] },
    { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1f2835" }] },
    { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#f3d19c" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
    { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
    { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] }
  ]
};

export default function ConcertsPage() {
  const navigate = useNavigate();

  const allConcerts = mockArtists.flatMap(artist => 
    artist.upcomingDates.map(date => ({
      ...date,
      artistName: artist.name,
      artistImage: artist.image,
      genre: artist.genre
    }))
  );

  const [selectedConcert, setSelectedConcert] = useState<any>(null);

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-[#050505] text-white pt-8 pb-4">
      
      <div className="container mx-auto px-6 mb-4 flex justify-between items-end">
        <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3">
              <Globe className="text-violet-500 animate-pulse" />
              World Tour <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500">2026</span>
            </h1>
        </div>
        <div className="text-right hidden md:block">
            <span className="text-zinc-400 text-sm">Prochaines dates : </span>
            <span className="text-white font-bold">{allConcerts.length}</span>
        </div>
      </div>

      <div className="flex-1 container mx-auto px-4 flex gap-6 overflow-hidden">
        
        {/* LISTE GAUCHE */}
        <div className="w-full md:w-[350px] shrink-0 flex flex-col bg-[#121212] rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-white/5 bg-white/5">
             <h2 className="font-bold text-sm uppercase tracking-wider text-zinc-400">Liste des concerts</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3">
             {allConcerts.map((concert) => (
               <div 
                 key={concert.id} 
                 onClick={() => setSelectedConcert(concert)}
                 className={`relative p-3 rounded-xl border transition-all duration-300 cursor-pointer group ${
                   selectedConcert?.id === concert.id 
                     ? 'bg-violet-500/10 border-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.3)]' 
                     : 'bg-zinc-900/40 border-white/5 hover:bg-zinc-800 hover:border-white/20'
                 }`}
               >
                 <div className="flex items-center gap-3">
                    <img 
                      src={concert.artistImage} 
                      alt={concert.artistName} 
                      className="w-12 h-12 rounded-lg object-cover shadow-lg group-hover:scale-105 transition-transform" 
                    />
                    <div className="min-w-0">
                        <h3 className={`font-bold truncate text-sm ${selectedConcert?.id === concert.id ? 'text-white' : 'text-zinc-200'}`}>
                            {concert.artistName}
                        </h3>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-wide mt-0.5">
                           {concert.genre}
                        </p>
                    </div>
                 </div>
                 
                 <div className="mt-3 flex justify-between items-center text-xs text-zinc-400">
                    <span className="flex items-center gap-1.5 font-medium bg-black/30 px-2 py-1 rounded-md">
                      <Calendar size={10} className="text-violet-400"/> 
                      {concert.date}
                    </span>
                    <span className="flex items-center gap-1.5 font-medium">
                      <Navigation size={10} className="text-fuchsia-400"/> 
                      {concert.city}
                    </span>
                 </div>

                 {/* BOUTON RÉSERVER */}
                 <button 
                    onClick={(e) => {
                        e.stopPropagation(); 
                        // Modification ICI : On envoie le nom de l'artiste dans l'URL
                        navigate(`/tickets?search=${encodeURIComponent(concert.artistName)}`);
                    }}
                    className="w-full mt-3 py-2 bg-violet-600/10 hover:bg-violet-600 text-violet-300 hover:text-white border border-violet-500/30 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 group-hover:shadow-lg"
                 >
                    <Ticket size={12} /> Réserver
                 </button>

               </div>
             ))}
          </div>
        </div>

        {/* CARTE DROITE */}
        <div className="flex-1 relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl hidden md:block">
          <LoadScript googleMapsApiKey=""> 
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={selectedConcert ? { lat: selectedConcert.lat, lng: selectedConcert.lng } : defaultCenter}
              zoom={selectedConcert ? 12 : 4} 
              options={mapOptions}
            >
              {allConcerts.map((concert) => (
                <Marker
                  key={concert.id}
                  position={{ lat: concert.lat, lng: concert.lng }}
                  onClick={() => setSelectedConcert(concert)}
                />
              ))}

              {selectedConcert && (
                <InfoWindow
                  position={{ lat: selectedConcert.lat, lng: selectedConcert.lng }}
                  onCloseClick={() => setSelectedConcert(null)}
                  options={{ pixelOffset: new window.google.maps.Size(0, -30) }}
                >
                  <div className="text-black p-2 min-w-[200px]">
                    <div className="flex items-center gap-3 mb-2">
                          <img src={selectedConcert.artistImage} className="w-10 h-10 rounded-md object-cover" />
                          <div>
                             <span className="font-bold text-sm block">{selectedConcert.artistName}</span>
                             <span className="text-[10px] text-gray-500 uppercase">{selectedConcert.genre}</span>
                          </div>
                    </div>
                    
                    <div className="bg-gray-100 rounded p-2 mb-2 text-xs space-y-1">
                        <p className="font-bold">{selectedConcert.venue}</p>
                        <p>{selectedConcert.city}</p>
                        <p className="text-violet-700 font-semibold">{selectedConcert.date}</p>
                    </div>

                    <Link 
                        // Modification ICI aussi pour la bulle info
                        to={`/tickets?search=${encodeURIComponent(selectedConcert.artistName)}`}
                        className="block w-full bg-black text-white text-center py-2 rounded text-[10px] font-bold uppercase hover:bg-violet-600 transition-colors"
                    >
                        Réserver
                    </Link>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </LoadScript>
        </div>

      </div>
    </div>
  );
}