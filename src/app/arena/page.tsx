'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
// Wir importieren die Komponente UND den Typ von oben
import FighterSearch, { Fighter } from '@/components/FighterSearch';

// --- Rating Berechnung (Deine Logik) ---
// Formel: (Kämpfe * 1) + (Siege * 5) + (KOs * 3)
function calculateRating(fighter: Fighter | null) {
  if (!fighter) return 0;
  
  const wins = fighter.wins || 0;
  const losses = fighter.losses || 0;
  const draws = fighter.draws || 0;
  const kos = fighter.kos || 0;

  const totalFights = wins + losses + draws;
  const winScore = wins * 5;
  const koScore = kos * 3;

  return totalFights + winScore + koScore;
}

export default function ArenaPage() {
  const [fighterA, setFighterA] = useState<Fighter | null>(null);
  const [fighterB, setFighterB] = useState<Fighter | null>(null);
  const [winner, setWinner] = useState<Fighter | null>(null);
  
  const [isFighting, setIsFighting] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  const handleFight = () => {
    if (!fighterA || !fighterB) return;
    
    setIsFighting(true);
    setWinner(null);
    setLog([]);

    const scoreA = calculateRating(fighterA);
    const scoreB = calculateRating(fighterB);

    // Kampf-Simulation (2 Sekunden Verzögerung)
    setTimeout(() => {
      // Wahrscheinlichkeits-Berechnung
      const totalScore = scoreA + scoreB;
      // Verhindern von Division durch 0
      const chanceA = totalScore > 0 ? scoreA / totalScore : 0.5;
      
      const randomValue = Math.random(); // Zufall zwischen 0.0 und 1.0
      const didAWin = randomValue < chanceA;
      
      const theWinner = didAWin ? fighterA : fighterB;
      setWinner(theWinner);

      setLog([
        `Match gestartet!`,
        `${fighterA.name} (Rating: ${scoreA}) geht aggressiv vor.`,
        `${fighterB.name} (Rating: ${scoreB}) kontert.`,
        `Ein harter Schlagabtausch!`,
        `SIEGER: ${theWinner.name.toUpperCase()}!`
      ]);
      
      setIsFighting(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 pt-24">
      <h1 className="text-5xl font-oswald text-center mb-12 uppercase italic text-red-600 tracking-tighter">
        Fight Arena
      </h1>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        
        {/* --- BLUE CORNER --- */}
        <div className="bg-zinc-900/50 border border-blue-500/30 rounded-xl p-6 flex flex-col items-center">
          <h2 className="text-blue-500 font-oswald text-2xl mb-6">BLUE CORNER</h2>
          <FighterSearch label="Kämpfer A wählen" onSelect={setFighterA} />
          
          {fighterA && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
              <img 
                src={fighterA.image_url || 'https://via.placeholder.com/150'} 
                className="w-40 h-40 rounded-full object-cover border-4 border-blue-500 shadow-lg shadow-blue-500/20 mb-4 mx-auto"
              />
              <h3 className="text-2xl font-oswald uppercase">{fighterA.name}</h3>
              <div className="text-4xl font-bold text-blue-400 mt-2">
                {calculateRating(fighterA)} <span className="text-xs text-gray-500 font-normal">RATING</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* --- CENTER / FIGHT BUTTON --- */}
        <div className="flex flex-col items-center justify-center min-h-[200px]">
          {!winner ? (
            <button 
              onClick={handleFight}
              disabled={!fighterA || !fighterB || isFighting}
              className={`
                w-28 h-28 rounded-full font-oswald text-2xl italic shadow-2xl transition-all
                ${(!fighterA || !fighterB) 
                  ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' 
                  : 'bg-red-600 hover:bg-red-500 text-white hover:scale-110 shadow-red-600/50'}
                ${isFighting ? 'animate-pulse' : ''}
              `}
            >
              {isFighting ? '...' : 'VS'}
            </button>
          ) : (
            <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="text-center">
              <div className="text-yellow-500 font-oswald mb-2 tracking-widest text-sm">WINNER</div>
              <div className="text-3xl font-black font-oswald text-white uppercase italic">
                {winner.name}
              </div>
              <button onClick={() => setWinner(null)} className="mt-4 text-xs text-gray-400 underline hover:text-white">
                Reset
              </button>
            </motion.div>
          )}

          {/* Log Ausgabe */}
          {log.length > 0 && (
            <div className="mt-8 w-full bg-black/80 border border-white/10 p-3 rounded text-xs font-mono text-green-400">
              {log.map((line, i) => <div key={i}>> {line}</div>)}
            </div>
          )}
        </div>

        {/* --- RED CORNER --- */}
        <div className="bg-zinc-900/50 border border-red-500/30 rounded-xl p-6 flex flex-col items-center">
          <h2 className="text-red-500 font-oswald text-2xl mb-6">RED CORNER</h2>
          <FighterSearch label="Kämpfer B wählen" onSelect={setFighterB} />
          
          {fighterB && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
              <img 
                src={fighterB.image_url || 'https://via.placeholder.com/150'} 
                className="w-40 h-40 rounded-full object-cover border-4 border-red-500 shadow-lg shadow-red-500/20 mb-4 mx-auto"
              />
              <h3 className="text-2xl font-oswald uppercase">{fighterB.name}</h3>
              <div className="text-4xl font-bold text-red-400 mt-2">
                {calculateRating(fighterB)} <span className="text-xs text-gray-500 font-normal">RATING</span>
              </div>
            </motion.div>
          )}
        </div>

      </div>
    </div>
  );
}