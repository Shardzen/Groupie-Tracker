import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Upload, 
  Users, 
  Music, 
  Calendar, 
  CreditCard,
  Activity,
  LayoutDashboard
} from 'lucide-react';
import api from '@/lib/api';
import { useNavigate } from 'react-router-dom';

interface Artist {
  id: number;
  name: string;
  image: string;
  members: string[];
  creation_date: number;
  first_album: string;
}

interface Concert {
  id: number;
  artist_id: number;
  artist_name: string;
  artist_image: string;
  location: string;
  date: string;
  available_tickets: number;
  price: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
  email_verified: boolean;
  created_at: string;
  total_bookings: number;
}

interface Payment {
  id: number;
  user_name: string;
  user_email: string;
  artist_name: string;
  concert_location: string;
  concert_date: string;
  tickets: number;
  total_price: number;
  payment_status: string;
  created_at: string;
}

export default function AdminPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [artists, setArtists] = useState<Artist[]>([]);
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog states
  const [showArtistDialog, setShowArtistDialog] = useState(false);
  const [showConcertDialog, setShowConcertDialog] = useState(false);
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null);
  const [editingConcert, setEditingConcert] = useState<Concert | null>(null);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'artists':
          const artistsRes = await api.get('/admin/artists');
          setArtists(artistsRes.data);
          break;
        case 'concerts':
          const concertsRes = await api.get('/admin/concerts');
          setConcerts(concertsRes.data);
          break;
        case 'users':
          const usersRes = await api.get('/admin/users');
          setUsers(usersRes.data);
          break;
        case 'payments':
          const paymentsRes = await api.get('/admin/payments');
          setPayments(paymentsRes.data);
          break;
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteArtist = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet artiste ?')) return;
    try {
      await api.delete(`/admin/artists/${id}`);
      loadData();
    } catch (error) {
      console.error('Error deleting artist:', error);
    }
  };

  const handleDeleteConcert = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce concert ?')) return;
    try {
      await api.delete(`/admin/concerts/${id}`);
      loadData();
    } catch (error) {
      console.error('Error deleting concert:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Administration</h1>
          <p className="text-slate-400">Gérez votre plateforme de billetterie</p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-slate-900 border border-slate-700 grid grid-cols-5 w-full max-w-2xl">
            <TabsTrigger 
              value="dashboard" 
              className="data-[state=active]:bg-purple-500"
            >
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger 
              value="artists"
              className="data-[state=active]:bg-purple-500"
            >
              <Music className="w-4 h-4 mr-2" />
              Artistes
            </TabsTrigger>
            <TabsTrigger 
              value="concerts"
              className="data-[state=active]:bg-purple-500"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Concerts
            </TabsTrigger>
            <TabsTrigger 
              value="users"
              className="data-[state=active]:bg-purple-500"
            >
              <Users className="w-4 h-4 mr-2" />
              Utilisateurs
            </TabsTrigger>
            <TabsTrigger 
              value="payments"
              className="data-[state=active]:bg-purple-500"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Paiements
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard">
            <Button onClick={() => navigate('/admin/dashboard')}>
              Voir Dashboard Complet
            </Button>
          </TabsContent>

          {/* Artists Tab */}
          <TabsContent value="artists" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">
                Artistes ({artists.length})
              </h2>
              <Button 
                onClick={() => {
                  setEditingArtist(null);
                  setShowArtistDialog(true);
                }}
                className="bg-purple-500 hover:bg-purple-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un artiste
              </Button>
            </div>

            <Card className="bg-slate-900 border-slate-700">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-slate-300">Image</TableHead>
                      <TableHead className="text-slate-300">Nom</TableHead>
                      <TableHead className="text-slate-300">Membres</TableHead>
                      <TableHead className="text-slate-300">Création</TableHead>
                      <TableHead className="text-slate-300">Premier Album</TableHead>
                      <TableHead className="text-slate-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {artists.map((artist) => (
                      <TableRow key={artist.id} className="border-slate-700">
                        <TableCell>
                          <img
                            src={artist.image}
                            alt={artist.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        </TableCell>
                        <TableCell className="font-semibold text-white">
                          {artist.name}
                        </TableCell>
                        <TableCell className="text-slate-400">
                          {artist.members.length} membre{artist.members.length > 1 ? 's' : ''}
                        </TableCell>
                        <TableCell className="text-slate-400">
                          {artist.creation_date}
                        </TableCell>
                        <TableCell className="text-slate-400">
                          {artist.first_album}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingArtist(artist);
                                setShowArtistDialog(true);
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteArtist(artist.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Concerts Tab */}
          <TabsContent value="concerts" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">
                Concerts ({concerts.length})
              </h2>
              <Button 
                onClick={() => {
                  setEditingConcert(null);
                  setShowConcertDialog(true);
                }}
                className="bg-purple-500 hover:bg-purple-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un concert
              </Button>
            </div>

            <Card className="bg-slate-900 border-slate-700">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-slate-300">Artiste</TableHead>
                      <TableHead className="text-slate-300">Lieu</TableHead>
                      <TableHead className="text-slate-300">Date</TableHead>
                      <TableHead className="text-slate-300">Tickets</TableHead>
                      <TableHead className="text-slate-300">Prix</TableHead>
                      <TableHead className="text-slate-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {concerts.map((concert) => (
                      <TableRow key={concert.id} className="border-slate-700">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img
                              src={concert.artist_image}
                              alt={concert.artist_name}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                            <span className="font-semibold text-white">
                              {concert.artist_name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-400">
                          {concert.location}
                        </TableCell>
                        <TableCell className="text-slate-400">
                          {new Date(concert.date).toLocaleDateString('fr-FR')}
                        </TableCell>
                        <TableCell className="text-slate-400">
                          {concert.available_tickets} disponibles
                        </TableCell>
                        <TableCell className="text-green-400 font-semibold">
                          {concert.price}€
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingConcert(concert);
                                setShowConcertDialog(true);
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteConcert(concert.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <h2 className="text-2xl font-bold text-white">
              Utilisateurs ({users.length})
            </h2>

            <Card className="bg-slate-900 border-slate-700">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-slate-300">Nom</TableHead>
                      <TableHead className="text-slate-300">Email</TableHead>
                      <TableHead className="text-slate-300">Statut</TableHead>
                      <TableHead className="text-slate-300">Réservations</TableHead>
                      <TableHead className="text-slate-300">Inscrit le</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id} className="border-slate-700">
                        <TableCell className="font-semibold text-white">
                          {user.name}
                        </TableCell>
                        <TableCell className="text-slate-400">
                          {user.email}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {user.is_admin && (
                              <Badge variant="destructive">Admin</Badge>
                            )}
                            {user.email_verified ? (
                              <Badge className="bg-green-500">Vérifié</Badge>
                            ) : (
                              <Badge variant="secondary">Non vérifié</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-400">
                          {user.total_bookings}
                        </TableCell>
                        <TableCell className="text-slate-400">
                          {new Date(user.created_at).toLocaleDateString('fr-FR')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-4">
            <h2 className="text-2xl font-bold text-white">
              Paiements ({payments.length})
            </h2>

            <Card className="bg-slate-900 border-slate-700">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-slate-300">Utilisateur</TableHead>
                      <TableHead className="text-slate-300">Concert</TableHead>
                      <TableHead className="text-slate-300">Tickets</TableHead>
                      <TableHead className="text-slate-300">Montant</TableHead>
                      <TableHead className="text-slate-300">Statut</TableHead>
                      <TableHead className="text-slate-300">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => (
                      <TableRow key={payment.id} className="border-slate-700">
                        <TableCell>
                          <div className="text-white font-semibold">
                            {payment.user_name}
                          </div>
                          <div className="text-sm text-slate-400">
                            {payment.user_email}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-white">{payment.artist_name}</div>
                          <div className="text-sm text-slate-400">
                            {payment.concert_location}
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-400">
                          {payment.tickets}
                        </TableCell>
                        <TableCell className="text-green-400 font-semibold">
                          {payment.total_price}€
                        </TableCell>
                        <TableCell>
                          <Badge 
                            className={
                              payment.payment_status === 'succeeded'
                                ? 'bg-green-500'
                                : payment.payment_status === 'pending'
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                            }
                          >
                            {payment.payment_status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-400">
                          {new Date(payment.created_at).toLocaleDateString('fr-FR')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
