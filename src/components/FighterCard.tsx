// components/FighterCard.tsx
'use client';

import { motion } from 'framer-motion';
import RadarChart from './RadarChart';
import { Award, Shield, Zap } from 'lucide-react';

// Hilfsfunktion: Alter berechnen (kann hier wiederverwendet oder in eine utils-Datei ausgelagert werden)
function getAge(dobString: string | null) {
  if (!dobString) return 'N/A';
  const today = new Date();
  const birthDate = new Date(dobString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

// Typdefinition für den Fighter
export type Fighter = {
  id: string;
  name: string | null;
  division: string | null;
  status: string | null;
  country: string | null;
  dob: string | null;
  wins: number | null;
  kos: number | null;
  losses: number | null;
  style_score: {
    power: number;
    speed: number;
    technique: number;
    stamina: number;
    defense: number;
  } | null;
  debut_date: string | null;
  last_fight_date: string | null;
};

interface FighterCardProps {
  fighter: Fighter;
}

export default function FighterCard({ fighter }: FighterCardProps) {
  return (
    <div
      className="relative group bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden
                 hover:border-red-500/50 transition-all duration-300 shadow-lg hover:shadow-red-500/10 hover:scale-105"
    >
      <div className="relative p-6 flex flex-col h-full justify-between">
        {/* Header */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-red-500 font-mono text-xs tracking-widest uppercase bg-red-500/10 px-2 py-1 rounded">
              {fighter.division || 'No Division'}
            </span>
            <div
              title={`Status: ${fighter.status}`}
              className={`w-2.5 h-2.5 rounded-full ${
                fighter.status === 'Active' ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-zinc-600'
              }`}
            ></div>
          </div>
          <h3 className="text-3xl font-bold uppercase leading-none font-oswald text-white">
            {fighter.name}
          </h3>
          <div className="flex gap-2 text-xs font-mono uppercase text-zinc-400 mt-1">
            <span>{fighter.country}</span> • <span>{getAge(fighter.dob)} Years</span>
          </div>
        </div>

        {/* Body: Chart and Stats */}
        <div className="flex items-center justify-center my-4">
          <div className="w-1/2 -ml-4">
            {fighter.style_score ? (
              <RadarChart stats={fighter.style_score} />
            ) : (
              <div className="text-zinc-600 text-center text-xs ml-4">No Stats Data</div>
            )}
          </div>
          <div className="w-1/2 text-right space-y-4 font-mono">
            <div className="flex items-center justify-end gap-2">
              <span className="text-3xl font-bold text-white">{fighter.wins}</span>
              <Award className="w-5 h-5 text-green-500" />
            </div>
            <div className="flex items-center justify-end gap-2">
              <span className="text-3xl font-bold text-red-500">{fighter.kos}</span>
              <Zap className="w-5 h-5 text-red-500" />
            </div>
            <div className="flex items-center justify-end gap-2">
              <span className="text-3xl font-bold text-zinc-400">{fighter.losses}</span>
              <Shield className="w-5 h-5 text-zinc-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
