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
    image: 'https://e-cdns-images.dzcdn.net/images/artist/f104d4128531e285094269894101e18d/1000x1000-000000-80-0-0.jpg',
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
    image: 'https://e-cdns-images.dzcdn.net/images/artist/013754d909cb57e500b59b581d0df9eb/1000x1000-000000-80-0-0.jpg',
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
    image: 'https://e-cdns-images.dzcdn.net/images/artist/199d35688d01d674b3356bc0c78a0a03/1000x1000-000000-80-0-0.jpg',
    bio: 'La puissance du metal français à l\'international.',
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
    image: 'https://e-cdns-images.dzcdn.net/images/artist/11833534b86851b4c3ce7d353270912f/1000x1000-000000-80-0-0.jpg',
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
    image: 'https://e-cdns-images.dzcdn.net/images/artist/f2bc007e9133c946ac3c3907ddc509cc/1000x1000-000000-80-0-0.jpg',
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
    image: 'https://e-cdns-images.dzcdn.net/images/artist/5d2fa7f140a6bdc2c864c3461a9e467e/1000x1000-000000-80-0-0.jpg',
    bio: 'Deux frères.',
    topTracks: [
        { title: 'Au DD', plays: '300M', duration: '4:00' }
    ],
    upcomingDates: []
  }
];

export const mockEvents: Event[] = []; // Tu peux laisser vide ou remettre tes events si tu en as