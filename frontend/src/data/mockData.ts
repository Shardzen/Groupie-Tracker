export interface Artist {
  id: string
  name: string
  genre: string
  image: string
  bio: string
  spotifyEmbed: string
  upcomingDates: ConcertDate[]
}

export interface ConcertDate {
  id: string
  venue: string
  city: string
  date: string
  ticketsUrl: string
}

export interface Event {
  id: string
  name: string
  venue: string
  city: string
  date: string
  image: string
  artistName: string
  standardPrice: number
  vipPrice: number
}

export const mockArtists: Artist[] = [
  {
    id: '1',
    name: 'Ninho',
    genre: 'Rap FR',
    image: 'https://placehold.co/600x400/8b5cf6/ffffff?text=Ninho',
    bio: 'Ninho est un rappeur français originaire d\'Essonne. Reconnu pour son flow unique et ses textes introspectifs, il est devenu l\'un des piliers du rap français moderne avec des albums certifiés platine.',
    spotifyEmbed: 'https://open.spotify.com/embed/artist/6LuN9FCkKOj5PcnpouEgny',
    upcomingDates: [
      { id: '1', venue: 'Accor Arena', city: 'Paris', date: '2026-03-15', ticketsUrl: '/tickets' },
      { id: '2', venue: 'Zénith', city: 'Lille', date: '2026-04-20', ticketsUrl: '/tickets' },
    ]
  },
  {
    id: '2',
    name: 'Angèle',
    genre: 'Pop',
    image: 'https://placehold.co/600x400/ec4899/ffffff?text=Angele',
    bio: 'Angèle Van Laeken, dite Angèle, est une auteure-compositrice-interprète belge. Son premier album "Brol" a connu un succès phénoménal en Europe francophone avec des hits comme "Tout oublier" et "Balance ton quoi".',
    spotifyEmbed: 'https://open.spotify.com/embed/artist/2cevwbv7ISD92VMNLYLHZA',
    upcomingDates: [
      { id: '3', venue: 'Olympia', city: 'Paris', date: '2026-05-10', ticketsUrl: '/tickets' },
    ]
  },
  {
    id: '3',
    name: 'Gojira',
    genre: 'Metal',
    image: 'https://placehold.co/600x400/ef4444/ffffff?text=Gojira',
    bio: 'Gojira est un groupe de metal progressif français formé à Bayonne. Reconnu internationalement, le groupe a représenté la France aux Jeux Olympiques de Paris 2024 et continue de dominer la scène metal mondiale.',
    spotifyEmbed: 'https://open.spotify.com/embed/artist/0GDGKpJFhVpcjIGF8N6Ewt',
    upcomingDates: [
      { id: '4', venue: 'Hellfest', city: 'Clisson', date: '2026-06-20', ticketsUrl: '/tickets' },
      { id: '5', venue: 'Download Festival', city: 'Paris', date: '2026-07-12', ticketsUrl: '/tickets' },
    ]
  },
  {
    id: '4',
    name: 'Orelsan',
    genre: 'Rap FR',
    image: 'https://placehold.co/600x400/3b82f6/ffffff?text=Orelsan',
    bio: 'Orelsan, de son vrai nom Aurélien Cotentin, est un rappeur, réalisateur et acteur français. Figure majeure du rap français, il est connu pour ses textes ciselés et son regard acéré sur la société contemporaine.',
    spotifyEmbed: 'https://open.spotify.com/embed/artist/7yTyUI0NXy67mCYYNn0Nvg',
    upcomingDates: [
      { id: '6', venue: 'Stade de France', city: 'Paris', date: '2026-09-05', ticketsUrl: '/tickets' },
    ]
  },
  {
    id: '5',
    name: 'Justice',
    genre: 'Électro',
    image: 'https://placehold.co/600x400/eab308/ffffff?text=Justice',
    bio: 'Justice est un duo français de musique électronique formé par Gaspard Augé et Xavier de Rosnay. Pionniers de la French Touch 2.0, ils ont révolutionné l\'électro avec leur album "Cross" en 2007.',
    spotifyEmbed: 'https://open.spotify.com/embed/artist/1gR0gsQYfi6joyO1dlp76N',
    upcomingDates: [
      { id: '7', venue: 'Coachella', city: 'California', date: '2026-04-15', ticketsUrl: '/tickets' },
    ]
  },
  {
    id: '6',
    name: 'Christine and the Queens',
    genre: 'Pop Électro',
    image: 'https://placehold.co/600x400/06b6d4/ffffff?text=Chris',
    bio: 'Christine and the Queens, désormais connu sous le nom de Chris, est un projet musical porté par Héloïse Letissier. Mêlant pop, électro et performance artistique, Chris bouscule les codes du genre avec une approche unique.',
    spotifyEmbed: 'https://open.spotify.com/embed/artist/05WLWQyajC0kgDsWshVqLc',
    upcomingDates: [
      { id: '8', venue: 'Philharmonie', city: 'Paris', date: '2026-11-03', ticketsUrl: '/tickets' },
    ]
  },
  {
    id: '7',
    name: 'PNL',
    genre: 'Rap FR',
    image: 'https://placehold.co/600x400/a855f7/ffffff?text=PNL',
    bio: 'PNL est un duo de rap français composé des frères Ademo et N.O.S. Connus pour leur univers mystérieux et leurs clips cinématographiques, ils ont révolutionné le paysage du rap français avec leur cloud rap mélancolique.',
    spotifyEmbed: 'https://open.spotify.com/embed/artist/3aQeKQSyrW4qWr35idm0cy',
    upcomingDates: [
      { id: '9', venue: 'Bercy', city: 'Paris', date: '2026-12-31', ticketsUrl: '/tickets' },
    ]
  },
  {
    id: '8',
    name: 'Daft Punk',
    genre: 'Électro',
    image: 'https://placehold.co/600x400/f59e0b/ffffff?text=Daft+Punk',
    bio: 'Daft Punk était un duo français de musique électronique légendaire. Thomas Bangalter et Guy-Manuel de Homem-Christo ont marqué l\'histoire de la musique électronique mondiale avant leur séparation en 2021. Leurs concerts restent mythiques.',
    spotifyEmbed: 'https://open.spotify.com/embed/artist/4tZwfgrHOc3mvqYlEYSvVi',
    upcomingDates: []
  }
]

export const mockEvents: Event[] = [
  {
    id: 'e1',
    name: 'Ninho - Tour 2026',
    venue: 'Accor Arena',
    city: 'Paris',
    date: '2026-03-15',
    image: 'https://placehold.co/800x400/8b5cf6/ffffff?text=Ninho+Live',
    artistName: 'Ninho',
    standardPrice: 49.90,
    vipPrice: 149.90
  },
  {
    id: 'e2',
    name: 'Hellfest 2026',
    venue: 'Hellfest Open Air',
    city: 'Clisson',
    date: '2026-06-19',
    image: 'https://placehold.co/800x400/ef4444/ffffff?text=Hellfest+2026',
    artistName: 'Gojira + lineup',
    standardPrice: 299.00,
    vipPrice: 899.00
  },
  {
    id: 'e3',
    name: 'Angèle - Nonante Tour',
    venue: 'Olympia',
    city: 'Paris',
    date: '2026-05-10',
    image: 'https://placehold.co/800x400/ec4899/ffffff?text=Angele+Tour',
    artistName: 'Angèle',
    standardPrice: 55.00,
    vipPrice: 165.00
  },
  {
    id: 'e4',
    name: 'Orelsan - Stade de France',
    venue: 'Stade de France',
    city: 'Saint-Denis',
    date: '2026-09-05',
    image: 'https://placehold.co/800x400/3b82f6/ffffff?text=Orelsan+Live',
    artistName: 'Orelsan',
    standardPrice: 79.90,
    vipPrice: 239.90
  },
  {
    id: 'e5',
    name: 'Justice - Hyperdrama Tour',
    venue: 'Zénith Paris',
    city: 'Paris',
    date: '2026-10-22',
    image: 'https://placehold.co/800x400/eab308/ffffff?text=Justice+Live',
    artistName: 'Justice',
    standardPrice: 65.00,
    vipPrice: 195.00
  },
  {
    id: 'e6',
    name: 'PNL - Réveillon 2026',
    venue: 'Accor Arena',
    city: 'Paris',
    date: '2026-12-31',
    image: 'https://placehold.co/800x400/a855f7/ffffff?text=PNL+NYE',
    artistName: 'PNL',
    standardPrice: 89.90,
    vipPrice: 269.90
  }
]
