'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- Supabase direkt hier initialisieren für Sicherheit ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// --- Typen-Definition ---
export interface Fighter {
  id: number;
  name: string;
  image_url: string | null;
  wins: number;
  losses: number;
  draws: number;
  kos: number;
  // Falls du die Spalten noch nicht hast, sind sie optional (?)
  age?: string;
  division?: string;
}

interface Props {
  onSelect: (fighter: Fighter) => void;
  label: string;
}

export default function FighterSearch({ onSelect, label }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Fighter[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchFighters = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }
      setLoading(true);
      
      const { data, error } = await supabase
        .from('fighters')
        .select('*')
        .ilike('name', `%${query}%`)
        .limit(5);

      if (data) setResults(data as Fighter[]);
      setLoading(false);
    };

    const timer = setTimeout(searchFighters, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="relative w-full max-w-sm mx-auto mb-8">
      <label className="block text-red-500 font-oswald uppercase text-sm mb-2 tracking-wider">
        {label}
      </label>
      
      <input
        type="text"
        placeholder="Suche Kämpfer..."
        className="w-full bg-zinc-900 border border-white/10 rounded p-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
      />

      {/* Lade-Indikator */}
      {loading && <div className="absolute right-3 top-10 text-xs text-gray-500">...</div>}

      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-zinc-900 border border-white/10 rounded shadow-xl max-h-60 overflow-y-auto">
          {results.map((fighter) => (
            <div
              key={fighter.id}
              className="flex items-center gap-3 p-3 hover:bg-white/5 cursor-pointer border-b border-white/5 last:border-0"
              onClick={() => {
                onSelect(fighter);
                setQuery(fighter.name);
                setIsOpen(false);
              }}
            >
              <div className="w-10 h-10 rounded-full bg-black flex-shrink-0 overflow-hidden border border-white/10">
                {fighter.image_url ? (
                  <img src={fighter.image_url} alt={fighter.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">?</div>
                )}
              </div>
              <div className="text-sm font-bold text-white">{fighter.name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}