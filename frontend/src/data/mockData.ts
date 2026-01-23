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
    {
    id: '1',
    name: 'Ninho',
    genre: 'Rap FR',
    // J'ai mis le lien direct de l'image HD ici 👇
    image: 'https://e-cdns-images.dzcdn.net/images/artist/f104d4128531e285094269894101e18d/1000x1000-000000-80-0-0.jpg',
    bio: 'Ninho est un rappeur français originaire d\'Essonne...',
    topTracks: [
      { title: 'Jefe', plays: '145M', duration: '3:12' },
      { title: 'Lettre à une femme', plays: '120M', duration: '2:58' },
      { title: 'La vie qu\'on mène', plays: '98M', duration: '3:05' },
      { title: 'Eurostar', plays: '85M', duration: '3:20' },
    ],
    upcomingDates: [
      { id: '1', venue: 'Accor Arena', city: 'Paris', date: '2026-03-15', ticketsUrl: '/tickets' },
      { id: '2', venue: 'Zénith', city: 'Lille', date: '2026-04-20', ticketsUrl: '/tickets' },
    ]
  },
  {
    id: '2',
    name: 'Angèle',
    genre: 'Pop',
    image: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=1000&auto=format&fit=crop',
    bio: 'Angèle incarne la pop moderne francophone. Mêlant humour, féminisme et mélodies imparables, la chanteuse belge a conquis le cœur du public international. Ses concerts sont de véritables shows visuels et chorégraphiés.',
    topTracks: [
      { title: 'Bruxelles je t\'aime', plays: '95M', duration: '3:45' },
      { title: 'Balance ton quoi', plays: '110M', duration: '3:10' },
      { title: 'Tout oublier', plays: '150M', duration: '3:25' },
      { title: 'Fever', plays: '200M', duration: '3:30' },
    ],
    upcomingDates: [
      { id: '3', venue: 'Olympia', city: 'Paris', date: '2026-05-10', ticketsUrl: '/tickets' },
    ]
  },
  //  jajoute les futur artist ici
];

export const mockEvents: Event[] = [
  {
    id: 'e1',
    name: 'Ninho - Tour 2026',
    venue: 'Accor Arena',
    city: 'Paris',
    date: '2026-03-15',
    image: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=1000',
    artistName: 'Ninho',
    standardPrice: 49.90,
    vipPrice: 149.90
  },
  {
    id: 'e3',
    name: 'Angèle - Nonante Tour',
    venue: 'Olympia',
    city: 'Paris',
    date: '2026-05-10',
    image: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=1000',
    artistName: 'Angèle',
    standardPrice: 55.00,
    vipPrice: 165.00
  },
];