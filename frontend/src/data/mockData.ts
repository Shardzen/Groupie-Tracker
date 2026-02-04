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
  {
    id: '1',
    name: 'Ninho',
    genre: 'Rap FR',
    image: '/artists/ninho.jpg.jpg', // Gardé tel quel selon ton fichier
    bio: 'Le recordman du rap français.',
    topTracks: [
      { title: 'Jefe', plays: '145M', duration: '3:12', previewUrl: 'https://cdns-preview-d.dzcdn.net/stream/c-d8f5b81a6243ddfa4c97b6a4b8c6d40b-4.mp3' },
      { title: 'Lettre à une femme', plays: '120M', duration: '2:58', previewUrl: 'https://cdns-preview-9.dzcdn.net/stream/c-922634e062f928e08d6c703d1544a031-4.mp3' },
      { title: 'La vie qu\'on mène', plays: '155M', duration: '3:29' },
      { title: 'Goutte d\'eau', plays: '110M', duration: '3:02' },
      { title: 'Maman ne le sait pas', plays: '95M', duration: '3:22' },
      { title: 'Putana', plays: '88M', duration: '3:10' },
      { title: 'Vrai de vrai', plays: '76M', duration: '3:05' },
      { title: 'Tout va bien', plays: '65M', duration: '3:15' }
    ],
    upcomingDates: []
  },
  {
    id: '4',
    name: 'Orelsan',
    genre: 'Rap FR',
    image: '/artists/orelsan.jpg',
    bio: 'Civilisation. La plume la plus aiguisée de Caen.',
    topTracks: [
      { title: 'La Quête', plays: '90M', duration: '4:00' },
      { title: 'Basique', plays: '150M', duration: '3:10' },
      { title: 'L\'odeur de l\'essence', plays: '85M', duration: '4:42' },
      { title: 'Du propre', plays: '55M', duration: '3:27' },
      { title: 'San', plays: '65M', duration: '4:02' },
      { title: 'La Terre est ronde', plays: '98M', duration: '3:39' },
      { title: 'Défaite de famille', plays: '72M', duration: '3:44' },
      { title: 'Notes pour trop tard', plays: '45M', duration: '7:31' }
    ],
    upcomingDates: []
  },
  {
    id: '7',
    name: 'Leto',
    genre: 'Rap FR',
    image: '/artists/leto.jpg',
    bio: 'Le roi de la Trap parisienne. Capitaine Jackson.',
    topTracks: [
      { title: 'Macaroni', plays: '80M', duration: '3:20' },
      { title: 'Tes parents', plays: '65M', duration: '3:45' },
      { title: 'Train de vie', plays: '40M', duration: '3:10' },
      { title: 'Double Binks', plays: '55M', duration: '3:00' },
      { title: 'Paris c\'est magique', plays: '30M', duration: '3:15' },
      { title: 'Mozart Capitaine Jackson', plays: '25M', duration: '2:55' },
      { title: 'Vie de star', plays: '20M', duration: '3:05' },
      { title: 'Mélodie', plays: '18M', duration: '3:30' }
    ],
    upcomingDates: []
  },
  {
    id: '8',
    name: 'Nono La Grinta',
    genre: 'Rap FR',
    image: '/artists/nonolagrinta.jpg',
    bio: 'La nouvelle pépite du 91. Flow agressif et technique.',
    topTracks: [
      { title: 'LA QUOI??', plays: '15M', duration: '2:50' },
      { title: 'Paris', plays: '10M', duration: '3:00' },
      { title: 'Probleme', plays: '5M', duration: '2:45' },
      { title: 'Wari', plays: '4M', duration: '3:10' },
      { title: 'Drogue', plays: '3M', duration: '2:55' },
      { title: 'Freestyle Grinta #1', plays: '2M', duration: '2:30' },
      { title: 'Pas de refrain', plays: '1.5M', duration: '2:40' },
      { title: 'Bussdown', plays: '1M', duration: '3:05' }
    ],
    upcomingDates: []
  },
  {
    id: '9',
    name: 'Keeqaid',
    genre: 'Rap FR',
    image: '/artists/keeqaid.jpg',
    bio: 'Le futur de la scène. Un style unique qui mélange les genres.',
    topTracks: [
      { title: 'Tequila', plays: '5M', duration: '2:40' },
      { title: 'Coachella', plays: '4M', duration: '3:10' },
      { title: 'Violetta', plays: '3M', duration: '2:55' },
      { title: 'Mélodie', plays: '2.5M', duration: '3:00' },
      { title: 'Joga Bonito', plays: '2M', duration: '2:45' },
      { title: 'Rolex', plays: '1.5M', duration: '3:05' },
      { title: '91', plays: '1M', duration: '2:50' },
      { title: 'Freestyle K', plays: '800k', duration: '2:30' }
    ],
    upcomingDates: []
  },
  {
    id: '10',
    name: 'Timar',
    genre: 'Rap FR',
    image: '/artists/timar.jpg',
    bio: 'Une voix qui marque et des textes qui percutent.',
    topTracks: [
      { title: 'Sierra Leone', plays: '3M', duration: '2:55' },
      { title: '4h44', plays: '2M', duration: '3:05' },
      { title: 'Rose', plays: '1.5M', duration: '2:45' },
      { title: '100k', plays: '1M', duration: '3:10' },
      { title: 'Dans le noir', plays: '800k', duration: '3:00' },
      { title: 'Maman', plays: '700k', duration: '3:20' },
      { title: 'Zone', plays: '600k', duration: '2:50' },
      { title: 'Freestyle T', plays: '500k', duration: '2:30' }
    ],
    upcomingDates: []
  },
  {
    id: '11',
    name: 'Lamano',
    genre: 'Rap FR',
    image: '/artists/lamano.jpg',
    bio: 'L\'étoile montante. À suivre de très près cette année.',
    topTracks: [
      { title: 'Im sorry', plays: '8M', duration: '2:30' },
      { title: 'Canon', plays: '6M', duration: '2:45' },
      { title: 'Hiver', plays: '4M', duration: '3:00' },
      { title: 'Automne', plays: '3M', duration: '2:55' },
      { title: 'Printemps', plays: '2.5M', duration: '3:10' },
      { title: 'Eté', plays: '2M', duration: '2:40' },
      { title: 'Love', plays: '1.5M', duration: '3:05' },
      { title: 'Solo', plays: '1M', duration: '2:50' }
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
      { title: 'Bruxelles je t\'aime', plays: '95M', duration: '3:45', previewUrl: 'https://cdns-preview-b.dzcdn.net/stream/c-b93952701f6630f55e0031846c434226-6.mp3' },
      { title: 'Balance ton quoi', plays: '110M', duration: '3:10', previewUrl: 'https://cdns-preview-8.dzcdn.net/stream/c-89260c07d353683f12b6946059632832-6.mp3' },
      { title: 'Tout oublier', plays: '180M', duration: '3:22' },
      { title: 'Oui ou Non', plays: '85M', duration: '3:16' },
      { title: 'Ta Reine', plays: '110M', duration: '3:33' },
      { title: 'Fever', plays: '250M', duration: '2:37' },
      { title: 'Libre', plays: '70M', duration: '2:44' },
      { title: 'Flou', plays: '60M', duration: '3:19' }
    ],
    upcomingDates: []
  },
  {
    id: '12',
    name: 'The Weeknd',
    genre: 'Pop',
    image: '/artists/theweeknd.jpg',
    bio: 'Starboy. L\'artiste le plus écouté au monde.',
    topTracks: [
      { title: 'Blinding Lights', plays: '3B', duration: '3:20' },
      { title: 'Starboy', plays: '2B', duration: '3:50' },
      { title: 'The Hills', plays: '1.8B', duration: '4:02' },
      { title: 'Save Your Tears', plays: '1.5B', duration: '3:35' },
      { title: 'Can\'t Feel My Face', plays: '1.3B', duration: '3:33' },
      { title: 'I Feel It Coming', plays: '1.2B', duration: '4:29' },
      { title: 'Call Out My Name', plays: '900M', duration: '3:48' },
      { title: 'Take My Breath', plays: '500M', duration: '3:40' }
    ],
    upcomingDates: []
  },
  {
    id: '13',
    name: 'Dua Lipa',
    genre: 'Pop',
    image: '/artists/dualipa.jpg',
    bio: 'La reine du Disco Pop moderne.',
    topTracks: [
      { title: 'Levitating', plays: '1.5B', duration: '3:23' },
      { title: 'Don\'t Start Now', plays: '1.8B', duration: '3:03' },
      { title: 'New Rules', plays: '1.6B', duration: '3:29' },
      { title: 'Physical', plays: '1.1B', duration: '3:13' },
      { title: 'Break My Heart', plays: '1B', duration: '3:41' },
      { title: 'One Kiss', plays: '1.3B', duration: '3:34' },
      { title: 'IDGAF', plays: '1.2B', duration: '3:37' },
      { title: 'Love Again', plays: '800M', duration: '4:18' }
    ],
    upcomingDates: []
  },
  {
    id: '14',
    name: 'Stromae',
    genre: 'Pop',
    image: '/artists/stromae.jpg',
    bio: 'Le maestro belge. Des textes sombres sur des rythmes dansants.',
    topTracks: [
      { title: 'Alors on danse', plays: '900M', duration: '3:26' },
      { title: 'Papaoutai', plays: '800M', duration: '3:52' },
      { title: 'Formidable', plays: '300M', duration: '3:33' },
      { title: 'Tous les mêmes', plays: '250M', duration: '3:33' },
      { title: 'Santé', plays: '120M', duration: '3:11' },
      { title: 'L\'enfer', plays: '180M', duration: '3:09' },
      { title: 'Carmen', plays: '150M', duration: '3:09' },
      { title: 'Ta fête', plays: '90M', duration: '2:56' }
    ],
    upcomingDates: []
  },
  {
    id: '15',
    name: 'Aya Nakamura',
    genre: 'Pop',
    image: '/artists/nakamura.jpg',
    bio: 'La reine de France. L\'artiste francophone la plus écoutée à l\'international.',
    topTracks: [
      { title: 'Djadja', plays: '850M', duration: '2:50' },
      { title: 'Pookie', plays: '600M', duration: '3:00' },
      { title: 'Copines', plays: '500M', duration: '2:51' },
      { title: 'Jolie Nana', plays: '400M', duration: '2:27' },
      { title: '40%', plays: '300M', duration: '2:54' },
      { title: 'Comportement', plays: '350M', duration: '2:53' },
      { title: 'La Dot', plays: '250M', duration: '2:58' },
      { title: 'Sucette', plays: '200M', duration: '2:57' }
    ],
    upcomingDates: []
  },
  {
    id: '3',
    name: 'Gojira',
    genre: 'Metal',
    image: '/artists/gojira.jpg',
    bio: 'La puissance du metal français.',
    topTracks: [
      { title: 'Stranded', plays: '80M', duration: '4:30' },
      { title: 'Silvera', plays: '70M', duration: '3:50' },
      { title: 'L\'enfant sauvage', plays: '60M', duration: '4:17' },
      { title: 'Flying Whales', plays: '55M', duration: '7:44' },
      { title: 'Amazonia', plays: '35M', duration: '5:00' },
      { title: 'Another World', plays: '40M', duration: '4:25' },
      { title: 'The Shooting Star', plays: '30M', duration: '5:42' },
      { title: 'Born For One Thing', plays: '25M', duration: '4:20' }
    ],
    upcomingDates: []
  },
  {
    id: '16',
    name: 'Metallica',
    genre: 'Metal',
    image: '/artists/metallica.jpg',
    bio: 'Les pères fondateurs du Thrash Metal.',
    topTracks: [
      { title: 'Enter Sandman', plays: '1B', duration: '5:31' },
      { title: 'Master of Puppets', plays: '900M', duration: '8:35' },
      { title: 'Nothing Else Matters', plays: '1.2B', duration: '6:28' },
      { title: 'One', plays: '800M', duration: '7:27' },
      { title: 'The Unforgiven', plays: '700M', duration: '6:27' },
      { title: 'For Whom The Bell Tolls', plays: '600M', duration: '5:10' },
      { title: 'Sad But True', plays: '500M', duration: '5:24' },
      { title: 'Whiskey in the Jar', plays: '450M', duration: '5:04' }
    ],
    upcomingDates: []
  },
  {
    id: '17',
    name: 'Rammstein',
    genre: 'Metal',
    image: '/artists/rammstein.jpg',
    bio: 'Le metal industriel allemand à son paroxysme. Du feu et de la fureur.',
    topTracks: [
      { title: 'Du Hast', plays: '600M', duration: '3:54' },
      { title: 'Sonne', plays: '500M', duration: '4:32' },
      { title: 'Deutschland', plays: '450M', duration: '5:22' },
      { title: 'Ich Will', plays: '400M', duration: '3:37' },
      { title: 'Feuer Frei!', plays: '350M', duration: '3:08' },
      { title: 'Engel', plays: '300M', duration: '4:24' },
      { title: 'Amerika', plays: '250M', duration: '3:46' },
      { title: 'Radio', plays: '200M', duration: '4:37' }
    ],
    upcomingDates: []
  },
  {
    id: '18',
    name: 'System of a Down',
    genre: 'Metal',
    image: '/artists/systemofadown.jpg',
    bio: 'L\'énergie brute arméno-américaine.',
    topTracks: [
      { title: 'Chop Suey!', plays: '1.2B', duration: '3:30' },
      { title: 'Toxicity', plays: '900M', duration: '3:39' },
      { title: 'B.Y.O.B.', plays: '800M', duration: '4:15' },
      { title: 'Lonely Day', plays: '700M', duration: '2:47' },
      { title: 'Aerials', plays: '600M', duration: '6:11' },
      { title: 'Hypnotize', plays: '500M', duration: '3:09' },
      { title: 'Sugar', plays: '400M', duration: '2:33' },
      { title: 'Spiders', plays: '300M', duration: '3:35' }
    ],
    upcomingDates: []
  },
  {
    id: '5',
    name: 'Daft Punk',
    genre: 'Electro',
    image: '/artists/daftpunk.jpg',
    bio: 'Les légendes. One More Time.',
    topTracks: [
      { title: 'One More Time', plays: '500M', duration: '5:20' },
      { title: 'Get Lucky', plays: '1B', duration: '4:08' },
      { title: 'Harder, Better, Faster, Stronger', plays: '700M', duration: '3:45' },
      { title: 'Instant Crush', plays: '600M', duration: '5:37' },
      { title: 'Around the World', plays: '550M', duration: '7:09' },
      { title: 'Da Funk', plays: '400M', duration: '5:28' },
      { title: 'Lose Yourself to Dance', plays: '350M', duration: '5:53' },
      { title: 'Technologic', plays: '300M', duration: '4:44' }
    ],
    upcomingDates: []
  },
  {
    id: '19',
    name: 'DJ Snake',
    genre: 'Electro',
    image: '/artists/djsnake.jpg',
    bio: 'Le français qui fait danser la planète entière.',
    topTracks: [
      { title: 'Turn Down for What', plays: '1.1B', duration: '3:33' },
      { title: 'Let Me Love You', plays: '1.8B', duration: '3:25' },
      { title: 'Taki Taki', plays: '1.5B', duration: '3:32' },
      { title: 'Middle', plays: '900M', duration: '3:40' },
      { title: 'Lean On', plays: '3B', duration: '2:56' },
      { title: 'Magenta Riddim', plays: '400M', duration: '3:14' },
      { title: 'Loco Contigo', plays: '500M', duration: '3:05' },
      { title: 'Disco Maghreb', plays: '200M', duration: '3:30' }
    ],
    upcomingDates: []
  },
  {
    id: '20',
    name: 'David Guetta',
    genre: 'Electro',
    image: '/artists/davidguetta.jpg',
    bio: 'Le numéro 1 mondial des platines.',
    topTracks: [
      { title: 'Sexy Bitch', plays: '1.5B', duration: '4:05' },
      { title: 'Memories', plays: '1.2B', duration: '2:55' },
      { title: 'Titanium', plays: '1.6B', duration: '4:05' },
      { title: 'Hey Mama', plays: '1.4B', duration: '3:12' },
      { title: 'Without You', plays: '900M', duration: '3:28' },
      { title: 'Play Hard', plays: '800M', duration: '3:21' },
      { title: 'When Love Takes Over', plays: '700M', duration: '3:11' },
      { title: 'I\'m Good (Blue)', plays: '1B', duration: '2:55' }
    ],
    upcomingDates: []
  },
  {
    id: '21',
    name: 'Kavinsky',
    genre: 'Electro',
    image: '/artists/kavinsky.jpg',
    bio: 'Synthwave legend. Nightcall.',
    topTracks: [
      { title: 'Nightcall', plays: '400M', duration: '4:18' },
      { title: 'Roadgame', plays: '100M', duration: '3:44' },
      { title: 'Odd Look', plays: '150M', duration: '4:13' },
      { title: 'Renegade', plays: '80M', duration: '3:10' },
      { title: 'Pacific Coast Highway', plays: '60M', duration: '6:06' },
      { title: 'Testarossa Autodrive', plays: '50M', duration: '3:38' },
      { title: 'Zenith', plays: '40M', duration: '3:30' },
      { title: 'Cameo', plays: '35M', duration: '4:00' }
    ],
    upcomingDates: []
  },
  {
    id: '6',
    name: 'PNL',
    genre: 'Rap Cloud',
    image: '/artists/pnl.jpg',
    bio: 'Deux frères. QLF.',
    topTracks: [
      { title: 'Au DD', plays: '300M', duration: '4:00' },
      { title: 'Da', plays: '250M', duration: '3:50' },
      { title: 'Naha', plays: '200M', duration: '4:45' },
      { title: 'Onizuka', plays: '220M', duration: '4:12' },
      { title: 'Bené', plays: '180M', duration: '3:10' },
      { title: '91\'s', plays: '190M', duration: '3:55' },
      { title: 'Blanka', plays: '150M', duration: '4:15' },
      { title: 'A l\'ammoniaque', plays: '170M', duration: '5:16' }
    ],
    upcomingDates: []
  },
  {
    id: '22',
    name: 'Hamza',
    genre: 'Rap Cloud',
    image: '/artists/hamza.jpg',
    bio: 'Le Sauce God belge. Des mélodies imparables.',
    topTracks: [
      { title: 'Life', plays: '80M', duration: '3:05' },
      { title: 'Fade Up', plays: '110M', duration: '3:30' },
      { title: 'God Bless', plays: '90M', duration: '3:40' },
      { title: 'Paradise', plays: '70M', duration: '3:15' },
      { title: 'HS', plays: '60M', duration: '3:20' },
      { title: 'Vibe', plays: '50M', duration: '3:00' },
      { title: 'Réel', plays: '45M', duration: '3:10' },
      { title: 'Pilote', plays: '40M', duration: '3:05' }
    ],
    upcomingDates: []
  },
  {
    id: '23',
    name: 'Laylow',
    genre: 'Rap Cloud',
    image: '/artists/laylow.jpg',
    bio: 'L\'étrange histoire de Mr. Anderson. Digital et émotionnel.',
    topTracks: [
      { title: 'Megatron', plays: '45M', duration: '3:20' },
      { title: 'Special', plays: '40M', duration: '3:15' },
      { title: 'Logiciel triste', plays: '35M', duration: '3:30' },
      { title: 'TrinityVille', plays: '30M', duration: '3:10' },
      { title: 'Ivoirien', plays: '25M', duration: '3:05' },
      { title: 'Une histoire étrange', plays: '20M', duration: '3:40' },
      { title: 'R9R-LINE', plays: '18M', duration: '2:50' },
      { title: 'Millionnaire', plays: '15M', duration: '3:25' }
    ],
    upcomingDates: []
  }
];

export const mockEvents: Event[] = [];