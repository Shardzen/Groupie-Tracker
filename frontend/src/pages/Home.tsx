import { useState } from 'react';
import { mockArtists } from '../data/mockData';
import ArtistMarquee from '../components/ArtistMarquee';
import Navbar from '../components/Navbar'; // Assure-toi d'avoir ta navbar

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white">
      {/* On garde ta Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#0e0e0e]/80 backdrop-blur-md border-b border-white/5">
         {/* Mets ton composant Navbar ici si tu en as un, sinon un titre simple */}
         <div className="p-6 font-bold text-2xl tracking-tighter">GROUPIE<span className="text-violet-500">.</span></div>
      </div>

      {/* Section 1 : Le gros titre style Deezer */}
      <div className="pt-32 pb-12 px-6 container mx-auto text-center md:text-left">
        <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tight leading-[0.9]">
          Là où la musique <br />
          <span className="text-violet-500">prend vie.</span>
        </h1>
        <p className="mt-6 text-xl text-zinc-400 max-w-xl">
          Découvrez les artistes les plus en vogue du moment. Réservez vos billets. Vivez l'expérience.
        </p>
      </div>

      {/* Section 2 : Le défilement infini (C'est ça que tu voulais !) */}
      <div className="py-10 border-y border-white/5 bg-[#0a0a0a]">
        <ArtistMarquee artists={mockArtists} />
      </div>

      {/* Section 3 : Grille "À la une" style Shotgun (Cartes simples) */}
      <div className="container mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-8">
            <h2 className="text-3xl font-bold">Populaires ce mois-ci</h2>
            <button className="text-sm font-bold underline decoration-violet-500 underline-offset-4 hover:text-violet-400">VOIR TOUT</button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {mockArtists.slice(0, 4).map((artist) => (
            <div key={artist.id} className="group cursor-pointer">
              <div className="aspect-[4/5] rounded-xl overflow-hidden mb-4 relative">
                <img 
                    src={artist.image} 
                    alt={artist.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
              </div>
              <h3 className="font-bold text-lg leading-none">{artist.name}</h3>
              <p className="text-sm text-zinc-500 mt-1">{artist.genre}</p>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
}