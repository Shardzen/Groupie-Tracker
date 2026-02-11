import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
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
  Users, 
  Music, 
  Calendar, 
  CreditCard,
  LayoutDashboard
} from 'lucide-react';
import { api } from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuthApi } from '@/hooks/useAuthApi'; // Import the new hook

// --- Interfaces ---
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
  const authApi = useAuthApi(); // Initialize the authenticated API client
  
  // Data States
  const [artists, setArtists] = useState<Artist[]>([]);
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog States
  const [showArtistDialog, setShowArtistDialog] = useState(false);
  const [showConcertDialog, setShowConcertDialog] = useState(false);
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null);
  const [editingConcert, setEditingConcert] = useState<Concert | null>(null);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  // --- Chargement des données ---
  const loadData = async () => {
    setLoading(true);
    try {
      // NOTE: On assume ici que l'API renvoie directement le tableau (sans .data wrapper)
      // Si votre API renvoie { data: [...] }, rajoutez .data après le await.
      switch (activeTab) {
        case 'artists': {
          const artistsRes = await authApi.get<Artist[]>('/admin/artists');
          setArtists(artistsRes || []);
          break;
        }
        case 'concerts': {
          const concertsRes = await authApi.get<Concert[]>('/admin/concerts');
          // On charge aussi les artistes pour le select du formulaire concert
          if (artists.length === 0) {
             const allArtists = await authApi.get<Artist[]>('/admin/artists');
             setArtists(allArtists || []);
          }
          setConcerts(concertsRes || []);
          break;
        }
        case 'users': {
          const usersRes = await authApi.get<User[]>('/admin/users');
          setUsers(usersRes || []);
          break;
        }
        case 'payments': {
          const paymentsRes = await authApi.get<Payment[]>('/admin/payments');
          setPayments(paymentsRes || []);
          break;
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error("Erreur lors du chargement des données !");
    } finally {
      setLoading(false);
    }
  };

  // --- Actions ---

  const handleDeleteArtist = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet artiste ?')) return;
    try {
      await authApi.delete(`/admin/artists/${id}`);
      loadData();
      toast.success("Artiste supprimé avec succès !");
    } catch (error) {
      console.error('Error deleting artist:', error);
      toast.error("Erreur lors de la suppression de l'artiste !");
    }
  };

  const handleDeleteConcert = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce concert ?')) return;
    try {
      await authApi.delete(`/admin/concerts/${id}`);
      loadData();
      toast.success("Concert supprimé avec succès !");
    } catch (error) {
      console.error('Error deleting concert:', error);
      toast.error("Erreur lors de la suppression du concert !");
    }
  };

  const handleSaveArtist = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Traitement des membres (string vers array)
    const membersString = formData.get('members') as string;
    const membersArray = membersString.split(',').map(m => m.trim()).filter(m => m !== '');

    const artistData = {
      name: formData.get('name'),
      image: formData.get('image'),
      members: membersArray,
      creation_date: Number(formData.get('creation_date')),
      first_album: formData.get('first_album'),
    };

    try {
      if (editingArtist) {
        await authApi.put(`/admin/artists/${editingArtist.id}`, artistData);
        toast.success("Artiste modifié avec succès !");
      } else {
        await authApi.post('/admin/artists', artistData);
        toast.success("Artiste ajouté avec succès !");
      }
      setShowArtistDialog(false);
      loadData();
    } catch (error) {
      console.error('Error saving artist:', error);
      toast.error("Erreur lors de la sauvegarde de l'artiste !");
    }
  };

  const handleSaveConcert = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const concertData = {
      artist_id: Number(formData.get('artist_id')),
      location: formData.get('location'),
      date: formData.get('date'), // Format YYYY-MM-DD
      available_tickets: Number(formData.get('available_tickets')),
      price: Number(formData.get('price')),
    };

    try {
      if (editingConcert) {
        await authApi.put(`/admin/concerts/${editingConcert.id}`, concertData);
        toast.success("Concert modifié avec succès !");
      } else {
        await authApi.post('/admin/concerts', concertData);
        toast.success("Concert ajouté avec succès !");
      }
      setShowConcertDialog(false);
      loadData();
    } catch (error) {
      console.error('Error saving concert:', error);
      toast.error("Erreur lors de la sauvegarde du concert !");
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
          <TabsList className="bg-slate-900 border border-slate-700 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 w-full max-w-2xl">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-purple-500">
              <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
            </TabsTrigger>
            <TabsTrigger value="artists" className="data-[state=active]:bg-purple-500">
              <Music className="w-4 h-4 mr-2" /> Artistes
            </TabsTrigger>
            <TabsTrigger value="concerts" className="data-[state=active]:bg-purple-500">
              <Calendar className="w-4 h-4 mr-2" /> Concerts
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-purple-500">
              <Users className="w-4 h-4 mr-2" /> Utilisateurs
            </TabsTrigger>
            <TabsTrigger value="payments" className="data-[state=active]:bg-purple-500">
              <CreditCard className="w-4 h-4 mr-2" /> Paiements
            </TabsTrigger>
          </TabsList>

          {/* --- DASHBOARD --- */}
          <TabsContent value="dashboard">
            <div className="p-8 bg-slate-900 rounded-lg border border-slate-700 text-center">
              <h3 className="text-xl text-white mb-4">Vue d'ensemble disponible</h3>
              <Button onClick={() => navigate('/admin/dashboard')} className="bg-purple-500 hover:bg-purple-600">
                Accéder au Dashboard Complet
              </Button>
            </div>
          </TabsContent>

          {/* --- ARTISTS TAB --- */}
          <TabsContent value="artists" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Artistes ({artists.length})</h2>
              <Button 
                onClick={() => { setEditingArtist(null); setShowArtistDialog(true); }}
                className="bg-purple-500 hover:bg-purple-600"
              >
                <Plus className="w-4 h-4 mr-2" /> Ajouter un artiste
              </Button>
            </div>

            <Card className="bg-slate-900 border-slate-700">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-700">
                        <TableHead className="text-slate-300">Image</TableHead>
                        <TableHead className="text-slate-300">Nom</TableHead>
                        <TableHead className="text-slate-300">Membres</TableHead>
                        <TableHead className="text-slate-300">Création</TableHead>
                        <TableHead className="text-slate-300">1er Album</TableHead>
                        <TableHead className="text-slate-300">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {artists.map((artist) => (
                        <TableRow key={artist.id} className="border-slate-700">
                          <TableCell>
                            <img src={artist.image} alt={artist.name} className="w-12 h-12 rounded-lg object-cover" />
                          </TableCell>
                          <TableCell className="font-semibold text-white">{artist.name}</TableCell>
                          <TableCell className="text-slate-400">
                            {Array.isArray(artist.members) ? artist.members.length : 0} membre(s)
                          </TableCell>
                          <TableCell className="text-slate-400">{artist.creation_date}</TableCell>
                          <TableCell className="text-slate-400">{artist.first_album}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => { setEditingArtist(artist); setShowArtistDialog(true); }}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => handleDeleteArtist(artist.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

         {/* --- CONCERTS TAB --- */}
          <TabsContent value="concerts" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Concerts ({concerts.length})</h2>
              <Button 
                onClick={() => { setEditingConcert(null); setShowConcertDialog(true); }}
                className="bg-purple-500 hover:bg-purple-600"
              >
                <Plus className="w-4 h-4 mr-2" /> Ajouter un concert
              </Button>
            </div>

            <Card className="bg-slate-900 border-slate-700">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
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
                              <img src={concert.artist_image} alt={concert.artist_name} className="w-10 h-10 rounded-lg object-cover" />
                              <span className="font-semibold text-white">{concert.artist_name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-slate-400">{concert.location}</TableCell>
                          <TableCell className="text-slate-400">{new Date(concert.date).toLocaleDateString('fr-FR')}</TableCell>
                          <TableCell className="text-slate-400">{concert.available_tickets}</TableCell>
                          <TableCell className="text-green-400 font-semibold">{concert.price}€</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => { setEditingConcert(concert); setShowConcertDialog(true); }}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => handleDeleteConcert(concert.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card> {/* <--- C'EST CETTE LIGNE QUI MANQUAIT ! */}
          </TabsContent>

            {/* --- USERS TAB --- */}
            <TabsContent value="users" className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Utilisateurs ({users.length})</h2>
            <Card className="bg-slate-900 border-slate-700">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
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
                          <TableCell className="font-semibold text-white">{user.name}</TableCell>
                          <TableCell className="text-slate-400">{user.email}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {user.is_admin && <Badge variant="destructive">Admin</Badge>}
                              {user.email_verified ? 
                                <Badge className="bg-green-500">Vérifié</Badge> : 
                                <Badge variant="secondary">Non vérifié</Badge>
                              }
                            </div>
                          </TableCell>
                          <TableCell className="text-slate-400">{user.total_bookings}</TableCell>
                          <TableCell className="text-slate-400">{new Date(user.created_at).toLocaleDateString('fr-FR')}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* --- PAYMENTS TAB --- */}
          <TabsContent value="payments" className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Paiements ({payments.length})</h2>
            <Card className="bg-slate-900 border-slate-700">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
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
                            <div className="text-white font-semibold">{payment.user_name}</div>
                            <div className="text-sm text-slate-400">{payment.user_email}</div>
                          </TableCell>
                          <TableCell>
                            <div className="text-white">{payment.artist_name}</div>
                            <div className="text-sm text-slate-400">{payment.concert_location}</div>
                          </TableCell>
                          <TableCell className="text-slate-400">{payment.tickets}</TableCell>
                          <TableCell className="text-green-400 font-semibold">{payment.total_price}€</TableCell>
                          <TableCell>
                            <Badge className={
                              payment.payment_status === 'succeeded' ? 'bg-green-500' :
                              payment.payment_status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                            }>
                              {payment.payment_status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-slate-400">{new Date(payment.created_at).toLocaleDateString('fr-FR')}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* --- DIALOGS (MODALES) --- */}

      {/* Artist Dialog */}
      <Dialog open={showArtistDialog} onOpenChange={setShowArtistDialog}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>{editingArtist ? 'Modifier l\'artiste' : 'Ajouter un artiste'}</DialogTitle>
            <DialogDescription className="text-slate-400">
              Remplissez les informations ci-dessous.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveArtist} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom</Label>
              <Input id="name" name="name" defaultValue={editingArtist?.name} required className="bg-slate-800 border-slate-600" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input id="image" name="image" defaultValue={editingArtist?.image} required className="bg-slate-800 border-slate-600" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="members">Membres (séparés par des virgules)</Label>
              <Textarea 
                id="members" 
                name="members" 
                defaultValue={editingArtist?.members?.join(', ')} 
                placeholder="John, Paul, George, Ringo"
                className="bg-slate-800 border-slate-600" 
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="creation_date">Année de création</Label>
                <Input id="creation_date" name="creation_date" type="number" defaultValue={editingArtist?.creation_date} required className="bg-slate-800 border-slate-600" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="first_album">Premier Album</Label>
                <Input id="first_album" name="first_album" defaultValue={editingArtist?.first_album} required className="bg-slate-800 border-slate-600" />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowArtistDialog(false)} className="border-slate-600 text-slate-300">Annuler</Button>
              <Button type="submit" className="bg-purple-500 hover:bg-purple-600">Sauvegarder</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Concert Dialog */}
      <Dialog open={showConcertDialog} onOpenChange={setShowConcertDialog}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>{editingConcert ? 'Modifier le concert' : 'Ajouter un concert'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveConcert} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="artist_id">Artiste</Label>
              <select 
                id="artist_id" 
                name="artist_id" 
                defaultValue={editingConcert?.artist_id}
                className="w-full flex h-10 w-full rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                required
              >
                <option value="">Sélectionner un artiste</option>
                {artists.map(a => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Lieu</Label>
              <Input id="location" name="location" defaultValue={editingConcert?.location} required className="bg-slate-800 border-slate-600" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input 
                id="date" 
                name="date" 
                type="date" 
                // Formatage simple pour l'input date si la date arrive au format ISO
                defaultValue={editingConcert?.date ? new Date(editingConcert.date).toISOString().split('T')[0] : ''} 
                required 
                className="bg-slate-800 border-slate-600 text-white" 
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="available_tickets">Tickets Disponibles</Label>
                <Input id="available_tickets" name="available_tickets" type="number" defaultValue={editingConcert?.available_tickets} required className="bg-slate-800 border-slate-600" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Prix (€)</Label>
                <Input id="price" name="price" type="number" step="0.01" defaultValue={editingConcert?.price} required className="bg-slate-800 border-slate-600" />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowConcertDialog(false)} className="border-slate-600 text-slate-300">Annuler</Button>
              <Button type="submit" className="bg-purple-500 hover:bg-purple-600">Sauvegarder</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}