import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Users, 
  Music, 
  Calendar, 
  DollarSign,
  Activity
} from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { useAuthApi } from '@/hooks/useAuthApi'; // Import the new hook
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface DashboardStats {
  total_artists: number;
  total_concerts: number;
  total_users: number;
  total_revenue: number;
  recent_bookings: number;
  upcoming_concerts: number;
  popular_artists: {
    artist_name: string;
    artist_image: string;
    total_bookings: number;
    total_revenue: number;
  }[];
  revenue_by_month: {
    month: string;
    revenue: number;
  }[];
  bookings_by_status: Record<string, number>;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const authApi = useAuthApi(); // Initialize the authenticated API client

  const fetchDashboardStats = useCallback(async () => {
    try {
      const response = await authApi.get<DashboardStats>('/admin/dashboard');
      
      setStats(response);
      
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  }, [authApi]);

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  if (loading || !stats) {
    return (
      <div className="p-8 space-y-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-800 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const revenueChartData = {
    labels: stats.revenue_by_month.map(d => d.month),
    datasets: [
      {
        label: 'Revenue (€)',
        data: stats.revenue_by_month.map(d => d.revenue),
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const bookingsChartData = {
    labels: Object.keys(stats.bookings_by_status),
    datasets: [
      {
        label: 'Bookings',
        data: Object.values(stats.bookings_by_status),
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: '#e2e8f0',
        },
      },
    },
    scales: {
      y: {
        ticks: { color: '#e2e8f0' },
        grid: { color: 'rgba(148, 163, 184, 0.1)' },
      },
      x: {
        ticks: { color: '#e2e8f0' },
        grid: { color: 'rgba(148, 163, 184, 0.1)' },
      },
    },
  };

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Dashboard Admin</h1>
          <p className="text-slate-400">Vue d'ensemble de votre plateforme</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-purple-900/50 to-slate-900 border-purple-500/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">
                Revenus Total
              </CardTitle>
              <DollarSign className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                {stats.total_revenue.toFixed(2)}€
              </div>
              <p className="text-xs text-slate-400 mt-1">
                +{stats.recent_bookings} réservations (7j)
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-900/50 to-slate-900 border-blue-500/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">
                Utilisateurs
              </CardTitle>
              <Users className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                {stats.total_users}
              </div>
              <p className="text-xs text-slate-400 mt-1">Total inscrits</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-900/50 to-slate-900 border-pink-500/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">
                Artistes
              </CardTitle>
              <Music className="h-4 w-4 text-pink-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                {stats.total_artists}
              </div>
              <p className="text-xs text-slate-400 mt-1">Catalogue complet</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-900/50 to-slate-900 border-green-500/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">
                Concerts
              </CardTitle>
              <Calendar className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                {stats.upcoming_concerts}
              </div>
              <p className="text-xs text-slate-400 mt-1">À venir</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                Revenus par Mois
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <Line data={revenueChartData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-400" />
                Réservations par Statut
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <Bar data={bookingsChartData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Popular Artists */}
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Top 5 Artistes Populaires</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.popular_artists.map((artist, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-2xl font-bold text-purple-400">
                      #{index + 1}
                    </div>
                    <img
                      src={artist.artist_image}
                      alt={artist.artist_name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold text-white">
                        {artist.artist_name}
                      </div>
                      <div className="text-sm text-slate-400">
                        {artist.total_bookings} réservations
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-green-400 border-green-400">
                    {artist.total_revenue.toFixed(2)}€
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
