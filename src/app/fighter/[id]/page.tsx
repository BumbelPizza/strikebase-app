// app/fighter/[id]/page.tsx

import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import RadarChart from '@/components/RadarChart';
import { ChevronLeft, UserPlus, BarChart2, TrendingUp, Shield, Zap, Award, MapPin, Target, Calendar } from 'lucide-react';

export const dynamic = 'force-dynamic';

type PageProps = {
  params: {
    id: string;
  };
};

// Helper to calculate age, can be moved to a utils file
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

// Fetch data server-side
async function getFighterData(id: string) {
    const { data, error } = await supabase
        .from('fighters')
        .select('*')
        .eq('id', id)
        .single(); // We expect only one result

    if (error || !data) {
        return null;
    }
    return data;
}


export default async function FighterProfilePage({ params }: PageProps) {
    const fighter = await getFighterData(params.id);

    // If no fighter is found, show a 404 page
    if (!fighter) {
        notFound();
    }

    // Generate hypothetical stats if not available
    const hypotheticalStats = fighter.style_score || {
        power: Math.floor(Math.random() * 100),
        speed: Math.floor(Math.random() * 100),
        technique: Math.floor(Math.random() * 100), // IQ
        stamina: Math.floor(Math.random() * 100),
        defense: Math.floor(Math.random() * 100),
    };

    const taleOfTheTape = [
        { label: 'Height', value: fighter.height ? `${fighter.height} cm` : 'N/A', icon: TrendingUp },
        { label: 'Weight', value: fighter.weight ? `${fighter.weight} lbs` : 'N/A', icon: BarChart2 },
        { label: 'Reach', value: fighter.reach ? `${fighter.reach} cm` : 'N/A', icon: Target },
        { label: 'Age', value: getAge(fighter.dob), icon: Calendar },
        { label: 'Team/Gym', value: fighter.gym || 'N/A', icon: MapPin },
        { label: 'Stance', value: fighter.stance || 'N/A', icon: Shield },
    ];

    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-100 font-inter">
            <div className="container mx-auto p-4 sm:p-6 lg:p-8">
                {/* Header and Navigation */}
                <div className="flex justify-between items-center mb-8">
                    <Link href="/fighters" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
                        <ChevronLeft size={20} />
                        Back to Database
                    </Link>
                    <button className="flex items-center gap-2 border border-zinc-600 text-zinc-300 hover:text-white font-bold py-2 px-4 rounded-lg transition-colors">
                        <UserPlus size={18} />
                        Claim this Profile
                    </button>
                </div>

                {/* Hero Section */}
                <header className="text-center border-b-2 border-red-600 pb-8 mb-8">
                    <h1 className="text-6xl md:text-8xl font-bold tracking-tighter font-oswald uppercase text-white">
                        {fighter.name}
                    </h1>
                    <p className="mt-2 text-2xl text-zinc-400 font-oswald uppercase tracking-wider">
                        {fighter.division || 'No Division'}
                    </p>
                    <div className={`mt-4 inline-block px-3 py-1 rounded-full text-sm font-semibold ${fighter.status === 'Active' ? 'bg-green-500/20 text-green-300' : 'bg-zinc-700 text-zinc-300'}`}>
                        Status: {fighter.status || 'Unknown'}
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Tale of the Tape & Record */}
                    <div className="lg:col-span-1 space-y-8">
                        {/* Tale of the Tape */}
                        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
                           <h2 className="font-oswald text-3xl uppercase font-bold mb-4 border-b border-zinc-700 pb-2">Tale of the Tape</h2>
                           <div className="space-y-3">
                               {taleOfTheTape.map(stat => (
                                   <div key={stat.label} className="flex justify-between items-center text-lg">
                                       <div className="flex items-center gap-3 text-zinc-400">
                                            <stat.icon size={18} />
                                            <span>{stat.label}</span>
                                       </div>
                                       <span className="font-semibold text-white">{stat.value}</span>
                                   </div>
                               ))}
                           </div>
                        </div>

                        {/* Record */}
                        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl text-center">
                            <h2 className="font-oswald text-3xl uppercase font-bold mb-4">Record</h2>
                            <div className="flex justify-around items-end">
                                <div>
                                    <p className="text-6xl font-bold text-green-400">{fighter.wins}</p>
                                    <p className="text-zinc-400 uppercase font-semibold">Wins</p>
                                </div>
                                <div>
                                    <p className="text-6xl font-bold text-red-500">{fighter.losses}</p>
                                    <p className="text-zinc-400 uppercase font-semibold">Losses</p>
                                </div>
                                <div>
                                    <p className="text-6xl font-bold text-zinc-500">{fighter.draws || 0}</p>
                                    <p className="text-zinc-400 uppercase font-semibold">Draws</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Radar Chart */}
                    <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 p-6 rounded-xl flex flex-col justify-center items-center min-h-[400px]">
                        <h2 className="font-oswald text-3xl uppercase font-bold mb-4 text-center">Skill Analysis</h2>
                        <div className="w-full h-full flex justify-center items-center">
                            <RadarChart stats={hypotheticalStats} />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
