// components/RadarChart.tsx
import React from 'react';

const MAX_VALUE = 10;
const SIZE = 200;
const CENTER = SIZE / 2;
const RADIUS = SIZE / 2 - 20;

type Stats = {
  power: number;
  speed: number;
  technique: number;
  stamina: number;
  defense: number;
};

export default function RadarChart({ stats }: { stats: Stats }) {
  if (!stats) return null; // Sicherheitscheck

  const keys = Object.keys(stats) as Array<keyof Stats>;
  const total = keys.length;
  
  const getPoint = (value: number, index: number) => {
    const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
    const r = (value / MAX_VALUE) * RADIUS;
    return [CENTER + Math.cos(angle) * r, CENTER + Math.sin(angle) * r];
  };

  const pathData = keys.map((key, i) => {
    const val = stats[key] || 0; // Fallback falls Wert fehlt
    const [x, y] = getPoint(val, i);
    return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
  }).join(' ') + 'Z';

  return (
    <div className="relative flex justify-center items-center">
      <svg width={SIZE} height={SIZE} className="overflow-visible">
        {/* Graues Netz im Hintergrund */}
        {[2, 4, 6, 8, 10].map((r) => (
          <polygon
            key={r}
            points={keys.map((_, i) => getPoint(r, i).join(',')).join(' ')}
            fill="none"
            stroke="#333"
            strokeWidth="1"
            className="opacity-30"
          />
        ))}
        {/* Die rote Fläche (Stats) */}
        <path d={pathData} fill="rgba(239, 68, 68, 0.2)" stroke="#ef4444" strokeWidth="2" />
        
        {/* Beschriftung (Power, Speed etc.) */}
        {keys.map((key, i) => {
          const [x, y] = getPoint(MAX_VALUE + 3, i);
          return (
            <text
              key={key}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-[10px] fill-zinc-500 uppercase font-mono tracking-wider"
            >
              {key}
            </text>
          );
        })}
      </svg>
    </div>
  );
}