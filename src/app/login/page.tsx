'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

// Supabase initialisieren
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false); // Schalter: Login oder Registrieren
  const [message, setMessage] = useState<{ text: string, type: 'error' | 'success' } | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (isSignUp) {
        // --- REGISTRIEREN ---
        const { error } = await supabase.auth.signUp({
          email,
          password,
          // Wichtig: Wir leiten nach der Reg direkt weiter, falls Email-Confirm aus ist
        });
        if (error) throw error;
        setMessage({ text: 'Account erstellt! Leite weiter...', type: 'success' });
        
        // Kurze Pause für den Effekt, dann ab zum Dashboard
        setTimeout(() => router.push('/dashboard'), 1000);
      } else {
        // --- LOGIN ---
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        
        // Erfolgreich eingeloggt -> Ab zum Dashboard
        router.push('/dashboard');
      }
    } catch (error: any) {
      setMessage({ text: error.message || 'Fehler aufgetreten', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      {/* Logo Area */}
      <h1 className="text-6xl font-oswald italic text-red-600 mb-2 uppercase tracking-tighter">
        StrikeBase
      </h1>
      <p className="text-gray-500 mb-8 font-mono text-xs uppercase tracking-widest">Manager Access Only</p>

      {/* Login Card */}
      <div className="w-full max-w-sm bg-zinc-900 border border-white/10 p-8 rounded-xl shadow-[0_0_50px_rgba(220,38,38,0.1)]">
        
        <h2 className="text-2xl text-white font-oswald mb-6 uppercase">
          {isSignUp ? 'Neuen Account erstellen' : 'Login'}
        </h2>

        {/* Fehlermeldungen / Erfolg */}
        {message && (
          <div className={`p-3 rounded mb-4 text-xs font-mono ${message.type === 'error' ? 'bg-red-900/30 text-red-400 border border-red-900' : 'bg-green-900/30 text-green-400 border border-green-900'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wider">Email Adresse</label>
            <input 
              type="email" 
              required
              className="w-full bg-black border border-white/10 p-3 rounded text-white focus:border-red-600 focus:outline-none transition-colors font-mono text-sm"
              placeholder="boss@gym.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wider">Passwort</label>
            <input 
              type="password" 
              required
              minLength={6}
              className="w-full bg-black border border-white/10 p-3 rounded text-white focus:border-red-600 focus:outline-none transition-colors font-mono text-sm"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-500 text-white font-oswald uppercase italic p-4 rounded text-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mt-4 shadow-lg shadow-red-900/20"
          >
            {loading ? 'Lade...' : (isSignUp ? 'Registrieren' : 'Enter')}
          </button>
        </form>

        {/* Umschalter Login <-> Register */}
        <div className="mt-6 text-center text-xs text-gray-500">
          {isSignUp ? 'Du hast schon einen Account?' : "Noch keine Lizenz?"}{' '}
          <button 
            onClick={() => {
              setIsSignUp(!isSignUp);
              setMessage(null);
            }}
            className="text-white hover:text-red-500 underline underline-offset-4 transition-colors ml-1"
          >
            {isSignUp ? 'Hier einloggen' : 'Hier erstellen'}
          </button>
        </div>

      </div>
    </div>
  );
}