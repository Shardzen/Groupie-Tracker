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
    image: '/artists/ninho.jpg.jpg', 
    bio: 'Le recordman du rap français.',
    topTracks: [
      { title: 'Jefe', plays: '145M', duration: '3:12' },
      { title: 'Lettre à une femme', plays: '120M', duration: '2:58' }
    ],
    upcomingDates: []
  },
  {
    id: '2',
    name: 'Angèle',
    genre: 'Pop',
    image: '/artists/angele.jpg.jpg',
    bio: 'La reine de la pop belge.',
    topTracks: [
      { title: 'Bruxelles je t\'aime', plays: '95M', duration: '3:45' },
      { title: 'Balance ton quoi', plays: '110M', duration: '3:10' }
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
      { title: 'Silvera', plays: '70M', duration: '3:50' }
    ],
    upcomingDates: []
  },
  {
    id: '4',
    name: 'Orelsan',
    genre: 'Rap FR',
    image: '/artists/orelsan.jpg',
    bio: 'Civilisation.',
    topTracks: [
      { title: 'La Quête', plays: '90M', duration: '4:00' },
      { title: 'Basique', plays: '150M', duration: '3:10' }
    ],
    upcomingDates: []
  },
  {
    id: '5',
    name: 'Daft Punk',
    genre: 'Electro',
    image: '/artists/daftpunk.jpg',
    bio: 'Les légendes.',
    topTracks: [
        { title: 'One More Time', plays: '500M', duration: '5:20' }
    ],
    upcomingDates: []
  },
  {
    id: '6',
    name: 'PNL',
    genre: 'Rap Cloud',
    image: '/artists/pnl.jpg',
    bio: 'Deux frères.',
    topTracks: [
        { title: 'Au DD', plays: '300M', duration: '4:00' }
    ],
    upcomingDates: []
  }
];

export const mockEvents: Event[] = [];