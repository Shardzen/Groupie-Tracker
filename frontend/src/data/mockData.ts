export interface Track {
  title: string;
  plays: string;
  duration: string;
  previewUrl?: string;
}

export interface Artist {
  id: string;
  name: string;
  genre: string;
  image: string;
  bio: string;
  topTracks: Track[]
  upcomingDates: ConcertDate[];
}

export interface ConcertDate {
  id: string;
  venue: string;
  city: string;
  date: string;
  ticketsUrl: string;
}

export interface Event {
  id: string;
  name: string;
  venue: string;
  city: string;
  date: string;
  image: string;
  artistName: string;
  standardPrice: number;
  vipPrice: number;
}

export const mockArtists: Artist[] = [

  {
    id: '1',
    name: 'Ninho',
    genre: 'Rap FR',
    image: '/artists/ninho.jpg.jpg',
    bio: 'Le recordman du rap français.',
    topTracks: [
      { 
        title: 'Jefe', 
        plays: '145M', 
        duration: '3:12',
        previewUrl: 'https://cdns-preview-d.dzcdn.net/stream/c-d8f5b81a6243ddfa4c97b6a4b8c6d40b-4.mp3' 
      },
      { 
        title: 'Lettre à une femme', 
        plays: '120M', 
        duration: '2:58',
        previewUrl: 'https://cdns-preview-9.dzcdn.net/stream/c-922634e062f928e08d6c703d1544a031-4.mp3'
      }
    ],
    upcomingDates: []
  },
  {
    id: '4',
    name: 'Orelsan',
    genre: 'Rap FR',
    image: 'artists/orelsan.jpg',
    bio: 'Civilisation. La plume la plus aiguisée de Caen.',
    topTracks: [
      { title: 'La Quête', plays: '90M', duration: '4:00' },
      { title: 'Basique', plays: '150M', duration: '3:10' }
    ],
    upcomingDates: []
  },
  {
    id: '7',
    name: 'Leto',
    genre: 'Rap FR',
    image: 'artists/leto.jpg',
    bio: 'Le roi de la Trap parisienne. Capitaine Jackson.',
    topTracks: [
      { title: 'Macaroni', plays: '80M', duration: '3:20' },
      { title: 'Tes parents', plays: '65M', duration: '3:45' }
    ],
    upcomingDates: []
  },
  {
    id: '8',
    name: 'Nono La Grinta',
    genre: 'Rap FR',
    image: 'artists/nonolagrinta.jpg',
    bio: 'La nouvelle pépite du 91. Flow agressif et technique.',
    topTracks: [
      { title: 'LA QUOI??', plays: '15M', duration: '2:50' },
      { title: 'Paris', plays: '10M', duration: '3:00' }
    ],
    upcomingDates: []
  },
  {
    id: '9',
    name: 'Keeqaid',
    genre: 'Rap FR',
    image: 'artists/keeqaid.jpg',
    bio: 'Le futur de la scène. Un style unique qui mélange les genres.',
    topTracks: [
      { title: 'Tequila', plays: '5M', duration: '2:40' },
      { title: 'Coachella', plays: '4M', duration: '3:10' }
    ],
    upcomingDates: []
  },
  {
    id: '10',
    name: 'Timar',
    genre: 'Rap FR',
    image: 'artists/timar.jpg',
    bio: 'Une voix qui marque et des textes qui percutent.',
    topTracks: [
      { title: 'Sierra Leone', plays: '3M', duration: '2:55' },
      { title: '4h44', plays: '2M', duration: '3:05' }
    ],
    upcomingDates: []
  },
  {
    id: '11',
    name: 'Lamano',
    genre: 'Rap FR',
    image: 'artists/lamano.jpg',
    bio: 'L\'étoile montante. À suivre de très près cette année.',
    topTracks: [
      { title: 'Im sorry', plays: '8M', duration: '2:30' },
      { title: 'Canon', plays: '6M', duration: '2:45' }
    ],
    upcomingDates: []
  },

  {
    id: '2',
    name: 'Angèle',
    genre: 'Pop',
    image: '/artists/angele.jpg',
    bio: 'La reine de la pop belge.',
    topTracks: [
      { 
        title: 'Bruxelles je t\'aime', 
        plays: '95M', 
        duration: '3:45', 
        previewUrl: 'https://cdns-preview-b.dzcdn.net/stream/c-b93952701f6630f55e0031846c434226-6.mp3'
      },
      { 
        title: 'Balance ton quoi', 
        plays: '110M', 
        duration: '3:10',
        previewUrl: 'https://cdns-preview-8.dzcdn.net/stream/c-89260c07d353683f12b6946059632832-6.mp3'
      }
    ],
    upcomingDates: []
  },
  {
    id: '12',
    name: 'The Weeknd',
    genre: 'Pop',
    image: 'artists/theweeknd.jpg',
    bio: 'Starboy. L\'artiste le plus écouté au monde.',
    topTracks: [
      { title: 'Blinding Lights', plays: '3B', duration: '3:20' },
      { title: 'Starboy', plays: '2B', duration: '3:50' }
    ],
    upcomingDates: []
  },
  {
    id: '13',
    name: 'Dua Lipa',
    genre: 'Pop',
    image: 'artists/dualipa.jpg',
    bio: 'La reine du Disco Pop moderne.',
    topTracks: [
      { title: 'Levitating', plays: '1.5B', duration: '3:23' },
      { title: 'Don\'t Start Now', plays: '1.8B', duration: '3:03' }
    ],
    upcomingDates: []
  },
  {
    id: '14',
    name: 'Stromae',
    genre: 'Pop',
    image: 'artists/stromae.jpg',
    bio: 'Le maestro belge. Des textes sombres sur des rythmes dansants.',
    topTracks: [
      { title: 'Alors on danse', plays: '900M', duration: '3:26' },
      { title: 'Papaoutai', plays: '800M', duration: '3:52' }
    ],
    upcomingDates: []
  },
  {
    id: '15',
    name: 'Aya Nakamura',
    genre: 'Pop',
    image: 'artists/nakamura.jpg',
    bio: 'La reine de France. L\'artiste francophone la plus écoutée à l\'international.',
    topTracks: [
      { title: 'Djadja', plays: '850M', duration: '2:50' },
      { title: 'Pookie', plays: '600M', duration: '3:00' }
    ],
    upcomingDates: []
  },

  {
    id: '3',
    name: 'Gojira',
    genre: 'Metal',
    image: 'artists/gojira.jpg',
    bio: 'La puissance du metal français.',
    topTracks: [
      { title: 'Stranded', plays: '80M', duration: '4:30' },
      { title: 'Silvera', plays: '70M', duration: '3:50' }
    ],
    upcomingDates: []
  },
  {
    id: '16',
    name: 'Metallica',
    genre: 'Metal',
    image: 'artists/metallica.jpg',
    bio: 'Les pères fondateurs du Thrash Metal.',
    topTracks: [
      { title: 'Enter Sandman', plays: '1B', duration: '5:31' },
      { title: 'Master of Puppets', plays: '900M', duration: '8:35' }
    ],
    upcomingDates: []
  },
  {
    id: '17',
    name: 'Rammstein',
    genre: 'Metal',
    image: 'artists/rammstein.jpg',
    bio: 'Le metal industriel allemand à son paroxysme. Du feu et de la fureur.',
    topTracks: [
      { title: 'Du Hast', plays: '600M', duration: '3:54' },
      { title: 'Sonne', plays: '500M', duration: '4:32' }
    ],
    upcomingDates: []
  },
  {
    id: '18',
    name: 'System of a Down',
    genre: 'Metal',
    image: 'artists/systemofadown.jpg',
    bio: 'L\'énergie brute arméno-américaine.',
    topTracks: [
      { title: 'Chop Suey!', plays: '1.2B', duration: '3:30' },
      { title: 'Toxicity', plays: '900M', duration: '3:39' }
    ],
    upcomingDates: []
  },

  {
    id: '5',
    name: 'Daft Punk',
    genre: 'Electro',
    image: 'artists/daftpunk.jpg',
    bio: 'Les légendes. One More Time.',
    topTracks: [
        { title: 'One More Time', plays: '500M', duration: '5:20' }
    ],
    upcomingDates: []
  },
  {
    id: '19',
    name: 'DJ Snake',
    genre: 'Electro',
    image: 'artists/djsnake.jpg',
    bio: 'Le français qui fait danser la planète entière.',
    topTracks: [
      { title: 'Turn Down for What', plays: '1.1B', duration: '3:33' },
      { title: 'Let Me Love You', plays: '1.8B', duration: '3:25' }
    ],
    upcomingDates: []
  },
  {
    id: '20',
    name: 'David Guetta',
    genre: 'Electro',
    image: 'artists/davidguetta.jpg',
    bio: 'Le numéro 1 mondial des platines.',
    topTracks: [
      { title: 'Sexy Bitch', plays: '1.5B', duration: '4:05' },
      { title: 'Memories', plays: '1.2B', duration: '2:55' }
    ],
    upcomingDates: []
  },
  {
    id: '21',
    name: 'Kavinsky',
    genre: 'Electro',
    image: 'artists/kavinsky.jpg',
    bio: 'Synthwave legend. Nightcall.',
    topTracks: [
      { title: 'Nightcall', plays: '400M', duration: '4:18' },
      { title: 'Roadgame', plays: '100M', duration: '3:44' }
    ],
    upcomingDates: []
  },
  
  {
    id: '6',
    name: 'PNL',
    genre: 'Rap Cloud',
    image: 'artists/pnl.jpg',
    bio: 'Deux frères. QLF.',
    topTracks: [
        { title: 'Au DD', plays: '300M', duration: '4:00' }
    ],
    upcomingDates: []
  },
  {
    id: '22',
    name: 'Hamza',
    genre: 'Rap Cloud',
    image: 'artists/hamza.jpg',
    bio: 'Le Sauce God belge. Des mélodies imparables.',
    topTracks: [
      { title: 'Life', plays: '80M', duration: '3:05' },
      { title: 'Fade Up', plays: '110M', duration: '3:30' }
    ],
    upcomingDates: []
  },
  {
    id: '23',
    name: 'Laylow',
    genre: 'Rap Cloud',
    image: 'artists/laylow.jpg',
    bio: 'L\'étrange histoire de Mr. Anderson. Digital et émotionnel.',
    topTracks: [
      { title: 'Megatron', plays: '45M', duration: '3:20' },
      { title: 'Special', plays: '40M', duration: '3:15' }
    ],
    upcomingDates: []
  }
];

export const mockEvents: Event[] = [];