// app/fighters/page.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import FighterCard, { Fighter } from '@/components/FighterCard';
import { Search, Loader, X, ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// A more scalable set of divisions, could also be fetched from the DB
const DIVISIONS = ['All', 'Heavyweight', 'Light Heavyweight', 'Middleweight', 'Welterweight', 'Lightweight', 'Featherweight', 'Bantamweight', 'Flyweight'];

// Framer Motion Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
  exit: {
    y: -20,
    opacity: 0,
    transition: {
        duration: 0.2,
    }
  }
};


export default function FightersDashboardPage() {
  const [allFighters, setAllFighters] = useState<Fighter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDivision, setActiveDivision] = useState('All');

  useEffect(() => {
    const fetchFighters = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('fighters')
          .select('*')
          .order('wins', { ascending: false });

        if (error) {
          throw error;
        }
        setAllFighters(data as Fighter[]);
      } catch (err: any) {
        setError(`Database Error: ${err.message}`);
        setAllFighters([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFighters();
  }, []);

  const filteredFighters = useMemo(() => {
    return allFighters.filter(fighter => {
      const matchesDivision = activeDivision === 'All' || fighter.division === activeDivision;
      const matchesSearch = !searchQuery || 
                            fighter.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            fighter.division?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesDivision && matchesSearch;
    });
  }, [allFighters, searchQuery, activeDivision]);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 font-inter p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto">
        <header className="text-center my-8 md:my-12">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter font-oswald uppercase">
            Fighter Roster
          </h1>
          <p className="mt-2 text-lg text-zinc-400 max-w-xl mx-auto">
            Explore, search, and filter through our database of elite fighters.
          </p>
        </header>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 sticky top-4 z-10 bg-zinc-950/80 backdrop-blur-sm p-4 rounded-xl border border-zinc-800">
          {/* Search Bar */}
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name or division..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-full py-3 pl-12 pr-10 text-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          
          {/* Division Filters */}
          <div className="relative">
             <select 
                value={activeDivision}
                onChange={(e) => setActiveDivision(e.target.value)}
                className="appearance-none w-full md:w-auto bg-zinc-900 border border-zinc-700 rounded-full py-3 px-6 text-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
             >
                {DIVISIONS.map(division => (
                  <option key={division} value={division} className="bg-zinc-800 text-white">
                    {division}
                  </option>
                ))}
             </select>
             <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 pointer-events-none" />
          </div>
        </div>

        {/* Fighters Grid */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader className="w-16 h-16 text-red-500 animate-spin" />
            <p className="ml-4 text-xl text-zinc-400">Loading Fighters...</p>
          </div>
        )}

        {error && <div className="text-red-400 bg-red-950/50 border border-red-800 rounded-lg text-center p-8 text-xl">{error}</div>}

        {!loading && !error && (
            <AnimatePresence mode="popLayout">
                <motion.div
                    key={activeDivision + searchQuery} // Re-trigger animations on filter change
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {filteredFighters.length > 0 ? (
                        filteredFighters.map(fighter => (
                        <motion.div key={fighter.id} variants={cardVariants} layout>
                            <Link href={`/fighter/${fighter.id}`} className="block">
                                <FighterCard fighter={fighter} />
                            </Link>
                        </motion.div>
                        ))
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="col-span-full text-center py-20"
                        >
                            <h3 className="text-3xl font-bold font-oswald text-zinc-500">No Fighters Found</h3>
                            <p className="text-zinc-600 mt-2 text-lg">
                            Try adjusting your search or filter settings.
                            </p>
                        </motion.div>
                    )}
                </motion.div>
            </AnimatePresence>
        )}
      </div>
    </main>
  );
}