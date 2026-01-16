// app/page.tsx
import Link from 'next/link';
import { Database, BarChart, Shield } from 'lucide-react';

export default function Home() {
  const features = [
    {
      name: 'Fighters',
      description: 'Explore a detailed database of martial arts fighters.',
      href: '/fighters',
      icon: Database,
    },
    {
      name: 'Techniques',
      description: 'Browse and learn about various techniques.',
      href: '/techniques',
      icon: Shield,
    },
    {
      name: 'Analytics',
      description: 'Visualize fighter stats and compare their skills.',
      href: '/fighters', // Or a future analytics page
      icon: BarChart,
    },
  ];

  return (
    <main className="min-h-screen bg-[#09090b] text-white font-sans">
      {/* Hero Section */}
      <div className="container mx-auto text-center py-20 lg:py-32">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter font-['Oswald'] uppercase">
          Welcome to StrikeBase
        </h1>
        <p className="mt-4 text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto">
          The ultimate database for martial arts. Explore fighters, techniques, and statistics in one place.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/fighters" className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
            Browse Fighters
          </Link>
          <Link href="/techniques" className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
            Explore Techniques
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div key={feature.name} className="bg-zinc-900/40 border border-white/5 p-8 rounded-xl text-center">
              <div className="flex justify-center mb-4">
                <feature.icon className="w-12 h-12 text-red-500" />
              </div>
              <h3 className="text-2xl font-bold font-['Oswald'] mb-2">{feature.name}</h3>
              <p className="text-zinc-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
