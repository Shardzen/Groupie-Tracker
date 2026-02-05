import { useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { mockArtists } from '../data/mockData';
import { Calendar, MapPin, Ticket, Music } from 'lucide-react';
import { Link } from 'react-router-dom';

// 1. Style de la carte (doit prendre 100% du conteneur)
const containerStyle = {
  width: '100%',
  height: '100%'
};

// 2. Coordonnées par défaut (Centre de la France) pour le démarrage
const defaultCenter = {
  lat: 46.603354,
  lng: 1.888334
};

// 3. Style "Sombre" pour la carte (Google Maps Dark Mode)
const mapOptions = {
  disableDefaultUI: false, // On garde le zoom +/-
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
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
  // On crée une liste unique de tous les concerts (artistes mélangés)
  // On ajoute l'image et le nom de l'artiste à chaque concert pour l'affichage
  const allConcerts = mockArtists.flatMap(artist => 
    artist.upcomingDates.map(date => ({
      ...date,
      artistName: artist.name,
      artistImage: artist.image,
      genre: artist.genre
    }))
  );

  // État pour savoir quel concert est sélectionné (pour ouvrir l'info-bulle sur la carte)
  const [selectedConcert, setSelectedConcert] = useState<any>(null);

  return (
    <div className="flex flex-col h-screen bg-[#0e0e0e] text-white pt-20">
      
      {/* En-tête de la page */}
      <div className="container mx-auto px-6 py-6 shrink-0">
        <h1 className="text-3xl font-black uppercase tracking-tighter mb-2 flex items-center gap-3">
          <Ticket className="text-violet-500" />
          Tournées <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500">2026</span>
        </h1>
        <p className="text-zinc-400 text-sm">Sélectionnez une date pour la voir sur la carte.</p>
      </div>

      {/* Zone principale (Liste + Carte) */}
      <div className="flex-1 flex flex-col md:flex-row border-t border-white/10 overflow-hidden">
        
        {/* COLONNE GAUCHE : LISTE (Scrollable) */}
        <div className="w-full md:w-1/3 lg:w-1/4 bg-[#121212] overflow-y-auto custom-scrollbar p-4">
          <div className="space-y-3">
             {allConcerts.map((concert) => (
               <div 
                 key={concert.id} 
                 onClick={() => setSelectedConcert(concert)}
                 className={`p-4 rounded-xl border transition-all cursor-pointer group ${
                   selectedConcert?.id === concert.id 
                     ? 'bg-violet-500/10 border-violet-500/50' 
                     : 'bg-white/5 border-white/5 hover:bg-white/10'
                 }`}
               >
                 <div className="flex items-center gap-3">
                    <img 
                      src={concert.artistImage} 
                      alt={concert.artistName} 
                      className="w-12 h-12 rounded-lg object-cover" 
                    />
                    <div>
                        <h3 className="font-bold leading-tight">{concert.artistName}</h3>
                        <p className="text-xs text-zinc-400 flex items-center gap-1 mt-1">
                          <Music size={10} /> {concert.genre}
                        </p>
                    </div>
                 </div>
                 
                 <div className="mt-3 pt-3 border-t border-white/5 flex justify-between items-center text-xs text-zinc-300">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Calendar size={12} className="text-violet-400"/> 
                      {concert.date}
                    </span>
                    <span className="flex items-center gap-1.5 font-medium">
                      <MapPin size={12} className="text-fuchsia-400"/> 
                      {concert.city}
                    </span>
                 </div>
               </div>
             ))}

             {allConcerts.length === 0 && (
                <div className="text-center py-10 text-zinc-500">
                  <p>Aucune date de concert trouvée.</p>
                </div>
             )}
          </div>
        </div>

        {/* COLONNE DROITE : CARTE */}
        <div className="w-full md:w-2/3 lg:w-3/4 relative bg-[#1a1a1a]">
          {/* IMPORTANT : googleMapsApiKey est vide pour l'instant = Mode DEV */}
          <LoadScript googleMapsApiKey=""> 
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={selectedConcert ? { lat: selectedConcert.lat, lng: selectedConcert.lng } : defaultCenter}
              zoom={selectedConcert ? 12 : 5}
              options={mapOptions}
            >
              {/* On place les marqueurs pour chaque concert */}
              {allConcerts.map((concert) => (
                <Marker
                  key={concert.id}
                  position={{ lat: concert.lat, lng: concert.lng }}
                  onClick={() => setSelectedConcert(concert)}
                />
              ))}

              {/* Si un concert est sélectionné, on affiche la petite bulle */}
              {selectedConcert && (
                <InfoWindow
                  position={{ lat: selectedConcert.lat, lng: selectedConcert.lng }}
                  onCloseClick={() => setSelectedConcert(null)}
                >
                  <div className="text-black p-1 min-w-[200px]">
                    <div className="flex items-center gap-2 mb-2">
                         <img src={selectedConcert.artistImage} className="w-8 h-8 rounded object-cover" />
                         <span className="font-bold">{selectedConcert.artistName}</span>
                    </div>
                    <div className="text-xs text-gray-600 mb-2">
                        <p className="font-bold">{selectedConcert.venue}</p>
                        <p>{selectedConcert.city} - {selectedConcert.date}</p>
                    </div>
                    <Link 
                        to="/tickets" 
                        className="block w-full bg-black text-white text-center py-2 rounded text-xs font-bold uppercase hover:bg-violet-600 transition-colors"
                    >
                        Réserver un billet
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