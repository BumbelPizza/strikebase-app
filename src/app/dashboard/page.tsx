'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Swords, ShoppingCart, Users, TrendingUp, LogOut, Settings, Trophy, Target } from 'lucide-react';
import { LoadingCard } from '@/components/Loading';
import { ErrorBoundary } from '@/components/ErrorBoundary';

interface Fighter {
  id: number;
  name: string;
  image_url: string | null;
  wins: number;
  losses: number;
  kos: number;
  value: number;
}

interface Profile {
  id: string;
  manager_name: string;
  gym_name: string;
  cash: number;
}

export default function Dashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [fighters, setFighters] = useState<Fighter[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalFighters: 0,
    totalValue: 0,
    winRate: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // Load profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError || !profileData) {
        router.push('/setup');
        return;
      }

      setProfile(profileData);

      // Load owned fighters
      const { data: fightersData, error: fightersError } = await supabase
        .from('fighters')
        .select('id, name, image_url, wins, losses, kos, value')
        .eq('owner_id', user.id)
        .order('value', { ascending: false });

      if (!fightersError && fightersData) {
        setFighters(fightersData);

        // Calculate stats
        const totalFighters = fightersData.length;
        const totalValue = fightersData.reduce((sum, f) => sum + (f.value || 0), 0);
        const totalFights = fightersData.reduce((sum, f) => sum + f.wins + f.losses, 0);
        const totalWins = fightersData.reduce((sum, f) => sum + f.wins, 0);
        const winRate = totalFights > 0 ? Math.round((totalWins / totalFights) * 100) : 0;

        setStats({ totalFighters, totalValue, winRate });
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return <LoadingCard title="Loading Dashboard..." className="min-h-screen" />;
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-white mb-4">Profile not found</h1>
          <Link href="/setup" className="text-red-500 hover:text-red-400">
            Complete your setup
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-zinc-950 text-white p-4 sm:p-8 pt-20">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Header */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 sm:p-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-oswald italic uppercase text-white mb-2">
                  {profile.manager_name}
                </h1>
                <h2 className="text-xl sm:text-2xl text-red-500 font-oswald uppercase">
                  {profile.gym_name}
                </h2>
                <p className="text-zinc-400 mt-2">Gym Manager Dashboard</p>
              </div>

              <div className="flex flex-col sm:flex-row items-end gap-4">
                <div className="text-right">
                  <div className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Bank Account</div>
                  <div className="text-3xl sm:text-4xl font-mono text-green-400 font-bold">
                    ${profile.cash.toLocaleString()}
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 text-center">
              <Users className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white">{stats.totalFighters}</div>
              <div className="text-zinc-400 text-sm uppercase">Fighters</div>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 text-center">
              <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white">${stats.totalValue.toLocaleString()}</div>
              <div className="text-zinc-400 text-sm uppercase">Total Value</div>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 text-center">
              <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white">{stats.winRate}%</div>
              <div className="text-zinc-400 text-sm uppercase">Win Rate</div>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 text-center">
              <Target className="w-8 h-8 text-red-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white">Elite</div>
              <div className="text-zinc-400 text-sm uppercase">Gym Rank</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-xl font-oswald uppercase mb-6 text-white">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link
                href="/arena"
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 hover:scale-105 flex items-center justify-center gap-3"
              >
                <Swords size={20} />
                Enter Arena
              </Link>

              <Link
                href="/market"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 hover:scale-105 flex items-center justify-center gap-3"
              >
                <ShoppingCart size={20} />
                Transfer Market
              </Link>

              <Link
                href="/fighters"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 hover:scale-105 flex items-center justify-center gap-3"
              >
                <Users size={20} />
                Browse Fighters
              </Link>

              <button
                onClick={() => router.push('/settings')}
                className="bg-zinc-700 hover:bg-zinc-600 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 hover:scale-105 flex items-center justify-center gap-3"
              >
                <Settings size={20} />
                Settings
              </button>
            </div>
          </div>

          {/* My Fighters */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-oswald uppercase text-white">My Fighters</h2>
              <Link
                href="/fighters?owned=true"
                className="text-red-400 hover:text-red-300 text-sm font-medium"
              >
                View All →
              </Link>
            </div>

            {fighters.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
                <h3 className="text-lg text-zinc-400 mb-2">No fighters yet</h3>
                <p className="text-zinc-500 text-sm mb-4">
                  Visit the transfer market to sign your first fighter
                </p>
                <Link
                  href="/market"
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Go to Market
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {fighters.slice(0, 8).map((fighter) => (
                  <Link
                    key={fighter.id}
                    href={`/fighter/${fighter.id}`}
                    className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 hover:border-red-500/50 transition-colors duration-200 group"
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 bg-zinc-700 rounded-full mx-auto mb-3 overflow-hidden">
                        {fighter.image_url ? (
                          <Image
                            src={fighter.image_url}
                            alt={fighter.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-500 text-xl font-bold">
                            ?
                          </div>
                        )}
                      </div>

                      <h3 className="font-oswald text-sm uppercase text-white mb-2 truncate">
                        {fighter.name}
                      </h3>

                      <div className="text-xs text-zinc-400 space-y-1">
                        <div>{fighter.wins}W - {fighter.losses}L - {fighter.kos}KO</div>
                        <div className="text-green-400 font-medium">${fighter.value}</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </ErrorBoundary>
  );
}