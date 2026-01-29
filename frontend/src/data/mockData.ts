export interface Track {
  title: string;
  plays: string;
  duration: string;
}

export interface Artist {
  id: string;
  name: string;
  genre: string;
  image: string;
  bio: string;
  topTracks: Track[];
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
  // --- RAP FR (Tes demandes + Classiques) ---
  {
    id: '1',
    name: 'Ninho',
    genre: 'Rap FR',
    image: 'https://e-cdns-images.dzcdn.net/images/artist/f104d4128531e285094269894101e18d/1000x1000-000000-80-0-0.jpg',
    bio: 'Le recordman du rap français. NI est intouchable.',
    topTracks: [
      { title: 'Jefe', plays: '145M', duration: '3:12' },
      { title: 'Lettre à une femme', plays: '120M', duration: '2:58' }
    ],
    upcomingDates: []
  },
  {
    id: '4',
    name: 'Orelsan',
    genre: 'Rap FR',
    image: 'https://e-cdns-images.dzcdn.net/images/artist/11833534b86851b4c3ce7d353270912f/1000x1000-000000-80-0-0.jpg',
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
    image: 'https://e-cdns-images.dzcdn.net/images/artist/c0356247c41c7b13dd911364d1f27116/1000x1000-000000-80-0-0.jpg',
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
    image: 'https://e-cdns-images.dzcdn.net/images/artist/5b6306511a3d905c1926618520295173/1000x1000-000000-80-0-0.jpg',
    bio: 'La nouvelle pépite du 91. Flow agressif et technique.',
    topTracks: [
      { title: 'Dernier étage', plays: '15M', duration: '2:50' },
      { title: 'Grinta', plays: '10M', duration: '3:00' }
    ],
    upcomingDates: []
  },
  {
    id: '9',
    name: 'Keeqaid',
    genre: 'Rap FR',
    image: 'https://e-cdns-images.dzcdn.net/images/artist/930792120021b38e07886475d4001c9c/1000x1000-000000-80-0-0.jpg',
    bio: 'Le futur de la scène. Un style unique qui mélange les genres.',
    topTracks: [
      { title: 'Sensation', plays: '5M', duration: '2:40' },
      { title: 'Mélodie', plays: '4M', duration: '3:10' }
    ],
    upcomingDates: []
  },
  {
    id: '10',
    name: 'Timar',
    genre: 'Rap FR',
    image: 'https://e-cdns-images.dzcdn.net/images/artist/77218679589d9a7f394464c8d1976a21/1000x1000-000000-80-0-0.jpg',
    bio: 'Une voix qui marque et des textes qui percutent.',
    topTracks: [
      { title: 'Vitesse', plays: '3M', duration: '2:55' },
      { title: 'Nuit', plays: '2M', duration: '3:05' }
    ],
    upcomingDates: []
  },
  {
    id: '11',
    name: 'Lamano',
    genre: 'Rap FR',
    image: 'https://e-cdns-images.dzcdn.net/images/artist/a2c6d48220021350a650d2432a584029/1000x1000-000000-80-0-0.jpg',
    bio: 'L\'étoile montante. À suivre de très près cette année.',
    topTracks: [
      { title: 'Intro', plays: '8M', duration: '2:30' },
      { title: 'Freestyle', plays: '6M', duration: '2:45' }
    ],
    upcomingDates: []
  },

  // --- POP ---
  {
    id: '2',
    name: 'Angèle',
    genre: 'Pop',
    image: 'https://e-cdns-images.dzcdn.net/images/artist/013754d909cb57e500b59b581d0df9eb/1000x1000-000000-80-0-0.jpg',
    bio: 'La reine de la pop belge.',
    topTracks: [
      { title: 'Bruxelles je t\'aime', plays: '95M', duration: '3:45' },
      { title: 'Balance ton quoi', plays: '110M', duration: '3:10' }
    ],
    upcomingDates: []
  },
  {
    id: '12',
    name: 'The Weeknd',
    genre: 'Pop',
    image: 'https://e-cdns-images.dzcdn.net/images/artist/15869ddfc0413009d17d6b382d56d817/1000x1000-000000-80-0-0.jpg',
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
    image: 'https://e-cdns-images.dzcdn.net/images/artist/f228e1d556df9c7f68c34114798e404d/1000x1000-000000-80-0-0.jpg',
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
    image: 'https://e-cdns-images.dzcdn.net/images/artist/43970b55146c965b82e3f5b75f85764d/1000x1000-000000-80-0-0.jpg',
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
    image: 'https://e-cdns-images.dzcdn.net/images/artist/6b1103b41b12b23dd48467d53b478d65/1000x1000-000000-80-0-0.jpg',
    bio: 'La reine de France. L\'artiste francophone la plus écoutée à l\'international.',
    topTracks: [
      { title: 'Djadja', plays: '850M', duration: '2:50' },
      { title: 'Pookie', plays: '600M', duration: '3:00' }
    ],
    upcomingDates: []
  },

  // --- METAL ---
  {
    id: '3',
    name: 'Gojira',
    genre: 'Metal',
    image: 'https://e-cdns-images.dzcdn.net/images/artist/199d35688d01d674b3356bc0c78a0a03/1000x1000-000000-80-0-0.jpg',
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
    image: 'https://e-cdns-images.dzcdn.net/images/artist/6e1333e68df6dfb186b5c392b453eb26/1000x1000-000000-80-0-0.jpg',
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
    image: 'https://e-cdns-images.dzcdn.net/images/artist/c31500305a415951c5f3e7924eb3765e/1000x1000-000000-80-0-0.jpg',
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
    image: 'https://e-cdns-images.dzcdn.net/images/artist/55239df138137357494dfa981297127e/1000x1000-000000-80-0-0.jpg',
    bio: 'L\'énergie brute arméno-américaine.',
    topTracks: [
      { title: 'Chop Suey!', plays: '1.2B', duration: '3:30' },
      { title: 'Toxicity', plays: '900M', duration: '3:39' }
    ],
    upcomingDates: []
  },

  // --- ELECTRO ---
  {
    id: '5',
    name: 'Daft Punk',
    genre: 'Electro',
    image: 'https://e-cdns-images.dzcdn.net/images/artist/f2bc007e9133c946ac3c3907ddc509cc/1000x1000-000000-80-0-0.jpg',
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
    image: 'https://e-cdns-images.dzcdn.net/images/artist/0b1a03e33b06e9323f494548483b8dd0/1000x1000-000000-80-0-0.jpg',
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
    image: 'https://e-cdns-images.dzcdn.net/images/artist/19e8321a5a0c302920245a468e2f8914/1000x1000-000000-80-0-0.jpg',
    bio: 'Le numéro 1 mondial des platines.',
    topTracks: [
      { title: 'Titanium', plays: '1.5B', duration: '4:05' },
      { title: 'I\'m Good (Blue)', plays: '1.2B', duration: '2:55' }
    ],
    upcomingDates: []
  },
  {
    id: '21',
    name: 'Kavinsky',
    genre: 'Electro',
    image: 'https://e-cdns-images.dzcdn.net/images/artist/574241940914a2f8c5b9679237617b0d/1000x1000-000000-80-0-0.jpg',
    bio: 'Synthwave legend. Nightcall.',
    topTracks: [
      { title: 'Nightcall', plays: '400M', duration: '4:18' },
      { title: 'Roadgame', plays: '100M', duration: '3:44' }
    ],
    upcomingDates: []
  },
  
  // --- RAP CLOUD ---
  {
    id: '6',
    name: 'PNL',
    genre: 'Rap Cloud',
    image: 'https://e-cdns-images.dzcdn.net/images/artist/5d2fa7f140a6bdc2c864c3461a9e467e/1000x1000-000000-80-0-0.jpg',
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
    image: 'https://e-cdns-images.dzcdn.net/images/artist/778673a557b4478345c259838421b4a6/1000x1000-000000-80-0-0.jpg',
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
    image: 'https://e-cdns-images.dzcdn.net/images/artist/41c402120e248f2197607a77d130a84e/1000x1000-000000-80-0-0.jpg',
    bio: 'L\'étrange histoire de Mr. Anderson. Digital et émotionnel.',
    topTracks: [
      { title: 'Megatron', plays: '45M', duration: '3:20' },
      { title: 'Special', plays: '40M', duration: '3:15' }
    ],
    upcomingDates: []
  }
];

export const mockEvents: Event[] = [];