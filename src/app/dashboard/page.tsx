'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Dashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const checkProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      const { data, error } = await supabase
        .from('profiles').select('*').eq('id', user.id).single();

      // Wenn kein Profil da ist -> Ab zum Setup
      if (error || !data) router.push('/setup');
      else setProfile(data);
    };
    checkProfile();
  }, []);

  if (!profile) return <div className="bg-black min-h-screen p-10 text-white">Lade Daten...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-8 pt-24">
      <div className="border-b border-white/10 pb-6 mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-6xl font-oswald italic uppercase">{profile.manager_name}</h1>
          <div className="text-red-500 font-oswald text-2xl">{profile.gym_name}</div>
        </div>
        <div className="text-right">
          <div className="text-gray-500 text-xs uppercase">Bank Account</div>
          <div className="text-4xl font-mono text-green-500 font-bold">${profile.cash}</div>
        </div>
      </div>
      <div className="bg-zinc-900/50 border border-white/10 p-6 rounded-xl">
        <h2 className="text-xl font-oswald uppercase mb-4">Aktionen</h2>
        <div className="flex gap-4">
          <button onClick={() => router.push('/arena')} className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded text-sm">
            Zur Arena
          </button>
          <button onClick={() => router.push('/market')} className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded text-sm font-bold">
            Transfer Market
          </button>
        </div>
      </div>
    </div>
  );
}