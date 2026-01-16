// app/page.tsx
import { supabase } from '@/lib/supabase';
import RadarChart from '@/components/RadarChart';

// Hilfsfunktion: Alter berechnen
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

export default async function Home() {
  // 1. Daten abrufen
  const { data: fighters, error } = await supabase
    .from('fighters')
    .select('*')
    .order('wins', { ascending: false }); // Sortieren nach meisten Siegen

  if (error) {
    return <div className="text-red-500 p-10">Datenbank Fehler: {error.message}</div>;
  }

  return (
    <main className="min-h-screen bg-[#09090b] text-white p-4 pb-20 font-sans">
      
      {/* HEADER */}
      <header className="flex justify-between items-center py-6 mb-12 border-b border-white/5 container mx-auto">
        <div className="text-2xl font-bold tracking-tighter font-['Oswald']">
          STRIKE<span className="text-red-500">BASE</span>
        </div>
        <div className="text-xs text-zinc-500 font-mono">
          BETA V1.0
        </div>
      </header>

      {/* GRID */}
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {fighters?.map((fighter) => (
          <div key={fighter.id} className="relative group bg-zinc-900/40 border border-white/5 rounded-xl overflow-hidden hover:border-red-500/30 transition-all duration-300 min-h-[400px]">
            
            {/* Hintergrund Name (Deko) */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-5 pointer-events-none">
               <h2 className="text-[120px] font-black text-white whitespace-nowrap -rotate-12 translate-y-10 translate-x-4 font-['Oswald']">
                 {fighter.name?.split(' ').pop()} 
               </h2>
            </div>

            <div className="relative z-10 p-6 flex flex-col h-full justify-between">
              
              {/* KOPFZEILE */}
              <div>
                <div className="flex justify-between items-start mb-2">
                   <span className="text-red-500 font-mono text-xs tracking-widest uppercase bg-red-500/10 px-2 py-1 rounded">
                     {fighter.division || 'No Division'}
                   </span>
                   {/* Status Punkt */}
                   <div className={`w-2 h-2 rounded-full ${fighter.status === 'Active' ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-zinc-600'}`}></div>
                </div>
                
                <h3 className="text-3xl font-bold uppercase leading-none italic font-['Oswald'] mb-2">
                  {fighter.name}
                </h3>
                
                <div className="flex gap-2 text-[10px] font-mono uppercase text-zinc-400">
                   <span>{fighter.country}</span> • <span>{getAge(fighter.dob)} Years</span>
                </div>
              </div>

              {/* MITTE: STATS & CHART */}
              <div className="flex items-center justify-between mt-4">
                {/* Chart (links) */}
                <div className="scale-75 -ml-8">
                   {fighter.style_score ? (
                     <RadarChart stats={fighter.style_score as any} />
                   ) : (
                     <div className="text-zinc-600 text-xs ml-8">No Stats Data</div>
                   )}
                </div>

                {/* Zahlen (rechts) */}
                <div className="text-right space-y-3 font-mono">
                   <div>
                     <span className="block text-2xl font-bold text-white">{fighter.wins}</span>
                     <span className="text-[10px] text-zinc-500 uppercase">Wins</span>
                   </div>
                   <div>
                     <span className="block text-2xl font-bold text-red-500">{fighter.kos}</span>
                     <span className="text-[10px] text-zinc-500 uppercase">KO</span>
                   </div>
                   <div>
                     <span className="block text-2xl font-bold text-zinc-500">{fighter.losses}</span>
                     <span className="text-[10px] text-zinc-500 uppercase">Loss</span>
                   </div>
                </div>
              </div>

              {/* FUSSZEILE */}
              <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-[10px] font-mono text-zinc-600 uppercase">
                <div>Debut: {fighter.debut_date || '-'}</div>
                <div>Last: {fighter.last_fight_date || '-'}</div>
              </div>

            </div>
          </div>
        ))}

        {/* Wenn keine Daten da sind */}
        {fighters?.length === 0 && (
          <div className="text-zinc-500 col-span-full text-center py-20">
            Noch keine Kämpfer in der Datenbank.
          </div>
        )}
      </div>
    </main>
  );
}