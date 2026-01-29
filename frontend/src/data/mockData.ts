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
    // Lien HD Deezer
    image: 'https://e-cdns-images.dzcdn.net/images/artist/f104d4128531e285094269894101e18d/1000x1000-000000-80-0-0.jpg',
    bio: 'Le recordman du rap français. Ninho transforme tout ce qu\'il touche en or avec des flows mélodiques et une écriture authentique.',
    topTracks: [
      { title: 'Jefe', plays: '145M', duration: '3:12' },
      { title: 'Lettre à une femme', plays: '120M', duration: '2:58' },
      { title: 'La vie qu\'on mène', plays: '98M', duration: '3:05' }
    ],
    upcomingDates: []
  },
  {
    id: '2',
    name: 'Angèle',
    genre: 'Pop',
    image: 'https://e-cdns-images.dzcdn.net/images/artist/013754d909cb57e500b59b581d0df9eb/1000x1000-000000-80-0-0.jpg',
    bio: 'La reine de la pop belge. Angèle a conquis le monde avec son humour, sa voix douce et ses textes engagés.',
    topTracks: [
      { title: 'Bruxelles je t\'aime', plays: '95M', duration: '3:45' },
      { title: 'Balance ton quoi', plays: '110M', duration: '3:10' },
      { title: 'Tout oublier', plays: '150M', duration: '3:25' }
    ],
    upcomingDates: []
  },
  {
    id: '3',
    name: 'Gojira',
    genre: 'Metal',
    image: 'https://e-cdns-images.dzcdn.net/images/artist/199d35688d01d674b3356bc0c78a0a03/1000x1000-000000-80-0-0.jpg',
    bio: 'La puissance du metal français à l\'international. Gojira allie technique death metal et conscience écologique.',
    topTracks: [
      { title: 'Stranded', plays: '80M', duration: '4:30' },
      { title: 'Silvera', plays: '70M', duration: '3:50' },
      { title: 'Amazonia', plays: '45M', duration: '5:00' }
    ],
    upcomingDates: []
  },
  {
    id: '4',
    name: 'Orelsan',
    genre: 'Rap FR',
    image: 'https://e-cdns-images.dzcdn.net/images/artist/11833534b86851b4c3ce7d353270912f/1000x1000-000000-80-0-0.jpg',
    bio: 'Civilisation. Orelsan dépeint la société moderne avec une justesse et une ironie mordante.',
    topTracks: [
      { title: 'La Quête', plays: '90M', duration: '4:00' },
      { title: 'Basique', plays: '150M', duration: '3:10' },
      { title: 'L\'odeur de l\'essence', plays: '75M', duration: '4:42' }
    ],
    upcomingDates: []
  },
  {
    id: '5',
    name: 'Daft Punk',
    genre: 'Electro',
    image: 'https://e-cdns-images.dzcdn.net/images/artist/f2bc007e9133c946ac3c3907ddc509cc/1000x1000-000000-80-0-0.jpg',
    bio: 'Les légendes. Le duo robotique qui a révolutionné la musique électronique mondiale.',
    topTracks: [
        { title: 'One More Time', plays: '500M', duration: '5:20' },
        { title: 'Get Lucky', plays: '800M', duration: '4:08' },
        { title: 'Instant Crush', plays: '400M', duration: '5:37' }
    ],
    upcomingDates: []
  },
  {
    id: '6',
    name: 'PNL',
    genre: 'Rap Cloud',
    image: 'https://e-cdns-images.dzcdn.net/images/artist/5d2fa7f140a6bdc2c864c3461a9e467e/1000x1000-000000-80-0-0.jpg',
    bio: 'Deux frères, une légende. PNL a imposé un style unique, planant et mélancolique au sommet des charts.',
    topTracks: [
        { title: 'Au DD', plays: '300M', duration: '4:00' },
        { title: '91\'s', plays: '180M', duration: '3:50' },
        { title: 'Onizuka', plays: '200M', duration: '4:12' }
    ],
    upcomingDates: []
  }
];

export const mockEvents: Event[] = [];