'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Fighter {
  id: number;
  name: string;
  image_url: string | null;
  value: number;
  wins: number;
  losses: number;
  kos: number;
}

interface Profile {
  id: string;
  cash: number;
}

export default function MarketPage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [fighters, setFighters] = useState<Fighter[]>([]);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchFighters();
    }
  }, [user]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }
    setUser(user);
  };

  const fetchProfile = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('profiles')
      .select('id, cash')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return;
    }
    setProfile(data);
  };

  const fetchFighters = async () => {
    const { data, error } = await supabase
      .from('fighters')
      .select('*')
      .is('owner_id', null)
      .order('value', { ascending: false });

    if (error) {
      console.error('Error fetching fighters:', error);
      return;
    }
    setFighters(data || []);
    setLoading(false);
  };

  const buyFighter = async (fighter: Fighter) => {
    if (!user || !profile || profile.cash < fighter.value) {
      alert('Not enough cash!');
      return;
    }

    setBuying(fighter.id);

    // Start a transaction-like operation
    try {
      // Deduct cash from profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ cash: profile.cash - fighter.value })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Set owner_id on fighter
      const { error: fighterError } = await supabase
        .from('fighters')
        .update({ owner_id: user.id })
        .eq('id', fighter.id);

      if (fighterError) throw fighterError;

      // Update local state
      setProfile({ ...profile, cash: profile.cash - fighter.value });
      setFighters(fighters.filter(f => f.id !== fighter.id));

      alert(`Successfully bought ${fighter.name}!`);
    } catch (error) {
      console.error('Error buying fighter:', error);
      alert('Failed to buy fighter. Please try again.');
      // Refresh data in case of partial failure
      fetchProfile();
      fetchFighters();
    } finally {
      setBuying(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-2xl">Loading Market...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 pt-24">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-oswald text-center text-transparent bg-clip-text bg-gradient-to-b from-green-500 to-green-900 mb-8 uppercase italic">
          Transfer Market
        </h1>

        {/* Cash Display */}
        <div className="text-center mb-8">
          <div className="inline-block bg-zinc-900 border border-green-500/20 rounded-lg p-4">
            <div className="text-green-400 font-oswald text-2xl uppercase tracking-wider">
              Your Cash: ${profile?.cash || 0}
            </div>
          </div>
        </div>

        {/* Fighters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {fighters.map((fighter) => (
            <div
              key={fighter.id}
              className="bg-zinc-900/50 border border-white/10 rounded-xl p-6 hover:border-green-500/30 transition-all duration-200"
            >
              <div className="text-center">
                <div className="w-24 h-24 bg-zinc-700 rounded-full mx-auto mb-4 overflow-hidden">
                  {fighter.image_url ? (
                    <Image
                      src={fighter.image_url}
                      alt={fighter.name}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl text-gray-500">
                      ?
                    </div>
                  )}
                </div>

                <h3 className="text-xl font-oswald uppercase mb-2">{fighter.name}</h3>

                <div className="text-green-400 font-bold text-2xl mb-4">
                  ${fighter.value}
                </div>

                <div className="flex justify-center gap-4 text-xs text-gray-400 mb-4">
                  <div>W: {fighter.wins}</div>
                  <div>L: {fighter.losses}</div>
                  <div>KO: {fighter.kos}</div>
                </div>

                <button
                  onClick={() => buyFighter(fighter)}
                  disabled={buying === fighter.id || (profile?.cash || 0) < fighter.value}
                  className="w-full bg-green-600 hover:bg-green-500 disabled:bg-zinc-600 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:cursor-not-allowed"
                >
                  {buying === fighter.id ? 'Buying...' : 'Buy Fighter'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {fighters.length === 0 && (
          <div className="text-center text-gray-500 text-xl mt-12">
            No fighters available on the market.
          </div>
        )}
      </div>
    </div>
  );
}