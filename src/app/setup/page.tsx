'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SetupPage() {
  const router = useRouter();
  const [managerName, setManagerName] = useState('');
  const [gymName, setGymName] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Prüfen wer eingeloggt ist
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) router.push('/login');
      setUser(user);
    };
    getUser();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        manager_name: managerName,
        gym_name: gymName,
        updated_at: new Date().toISOString(),
      });

    if (error) alert('Fehler: ' + error.message);
    else router.push('/dashboard'); // Weiterleitung zum Dashboard
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-oswald text-red-600 mb-2 uppercase italic">Manager Lizenz</h1>
      <p className="text-gray-500 mb-8">Registriere dein Gym bei StrikeBase</p>

      <form onSubmit={handleSave} className="w-full max-w-md bg-zinc-900 border border-white/10 p-8 rounded-xl space-y-6">
        <div>
          <label className="block text-xs text-gray-400 mb-2 uppercase">Dein Name</label>
          <input 
            type="text" required placeholder="Dana White"
            className="w-full bg-black border border-white/20 p-3 rounded text-white focus:border-red-500 outline-none"
            value={managerName} onChange={e => setManagerName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-2 uppercase">Gym Name</label>
          <input 
            type="text" required placeholder="Cobra Kai"
            className="w-full bg-black border border-white/20 p-3 rounded text-white focus:border-red-500 outline-none"
            value={gymName} onChange={e => setGymName(e.target.value)}
          />
        </div>
        <button disabled={loading} className="w-full bg-red-600 hover:bg-red-500 py-4 rounded font-oswald uppercase text-xl">
          {loading ? 'Erstelle...' : 'Unterschreiben & Starten'}
        </button>
      </form>
    </div>
  );
}