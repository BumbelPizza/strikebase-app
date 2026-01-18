'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Search, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

// --- Optimized Types ---
export interface Fighter {
  id: number;
  name: string;
  image_url: string | null;
  wins: number;
  losses: number;
  kos: number;
  value?: number;
}

interface Props {
  onSelect: (fighter: Fighter) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export default function FighterSearch({
  onSelect,
  label = "Search Fighter",
  placeholder = "Search fighters...",
  className = "",
  disabled = false
}: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Fighter[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Debounced search function
  const searchFighters = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('fighters')
        .select('id, name, image_url, wins, losses, kos, value')
        .ilike('name', `%${searchQuery}%`)
        .order('name')
        .limit(8);

      if (error) throw error;

      setResults(data || []);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search fighters');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      searchFighters(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, searchFighters]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          handleSelect(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSelect = (fighter: Fighter) => {
    onSelect(fighter);
    setQuery(fighter.name);
    setIsOpen(false);
    setSelectedIndex(-1);
    setError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsOpen(true);
    setSelectedIndex(-1);
    setError(null);
  };

  const handleFocus = () => {
    if (query.length >= 2) {
      setIsOpen(true);
    }
  };

  const handleBlur = () => {
    // Delay closing to allow for clicks on results
    setTimeout(() => {
      setIsOpen(false);
      setSelectedIndex(-1);
    }, 150);
  };

  return (
    <div className={`relative w-full ${className}`}>
      {label && (
        <label
          htmlFor="fighter-search"
          className="block text-red-500 font-oswald uppercase text-sm mb-2 tracking-wider"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={16} className="text-zinc-400" />
        </div>

        <input
          ref={inputRef}
          id="fighter-search"
          type="text"
          placeholder={placeholder}
          className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          autoComplete="off"
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-autocomplete="list"
        />

        {loading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <Loader2 size={16} className="text-zinc-400 animate-spin" />
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-2 text-sm text-red-400" role="alert">
          {error}
        </div>
      )}

      {/* Results Dropdown */}
      <AnimatePresence>
        {isOpen && (results.length > 0 || loading) && (
          <motion.div
            ref={resultsRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl max-h-80 overflow-y-auto"
            role="listbox"
          >
            {loading && results.length === 0 ? (
              <div className="p-4 text-center text-zinc-400">
                <Loader2 size={20} className="animate-spin mx-auto mb-2" />
                Searching...
              </div>
            ) : results.length > 0 ? (
              results.map((fighter, index) => (
                <div
                  key={fighter.id}
                  className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${
                    index === selectedIndex
                      ? 'bg-red-500/20 border-l-4 border-red-500'
                      : 'hover:bg-zinc-800'
                  }`}
                  onClick={() => handleSelect(fighter)}
                  role="option"
                  aria-selected={index === selectedIndex}
                >
                  <div className="w-10 h-10 rounded-full bg-zinc-700 flex-shrink-0 overflow-hidden border border-zinc-600">
                    {fighter.image_url ? (
                      <Image
                        src={fighter.image_url}
                        alt={fighter.name}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-500 text-sm font-bold">
                        ?
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-white font-medium truncate">{fighter.name}</div>
                    <div className="text-xs text-zinc-400">
                      {fighter.wins}W - {fighter.losses}L - {fighter.kos}KO
                      {fighter.value && ` • $${fighter.value}`}
                    </div>
                  </div>
                </div>
              ))
            ) : query.length >= 2 && !loading ? (
              <div className="p-4 text-center text-zinc-400">
                No fighters found
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}