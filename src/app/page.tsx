// app/page.tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Database, Swords, ShieldCheck, ArrowRight } from 'lucide-react';

// Feature Card Component
const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl flex flex-col items-center text-center">
        <div className="bg-red-600/10 p-4 rounded-full mb-4 border border-red-600/30">
            {icon}
        </div>
        <h3 className="font-oswald text-2xl font-bold uppercase mb-2 text-white">{title}</h3>
        <p className="text-zinc-400">{description}</p>
    </div>
);

export default function MarketingHomepage() {
    const features = [
        {
            icon: <Database size={28} className="text-red-400" />,
            title: 'Live Database',
            description: 'Constantly updated records of fighters and events.'
        },
        {
            icon: <Swords size={28} className="text-red-400" />,
            title: 'Fight Simulator',
            description: 'Analyze matchups and predict outcomes.'
        },
        {
            icon: <ShieldCheck size={28} className="text-red-400" />,
            title: 'Verified Athletes',
            description: 'Official fighter profiles with verified stats.'
        }
    ];

    return (
        <div className="bg-zinc-950 text-zinc-100 font-inter min-h-screen">
            {/* Hero Section */}
            <main className="min-h-screen flex items-center justify-center text-center p-4 overflow-hidden">
                <div className="relative z-10 space-y-6 max-w-4xl mx-auto">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: 'easeOut' }}
                        className="text-4xl md:text-6xl lg:text-7xl font-oswald uppercase font-extrabold tracking-tighter"
                    >
                        The Future of <span className="text-red-500">Combat Data</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
                        className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto"
                    >
                        Real-time stats, fight analysis, and verified profiles.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
                        className="flex flex-col md:flex-row justify-center gap-4"
                    >
                        <Link href="/fighters" className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-full transition-transform hover:scale-105 flex items-center justify-center gap-2">
                            Browse Database <ArrowRight size={20} />
                        </Link>
                        <Link href="/arena" className="border border-zinc-600 hover:border-zinc-500 text-zinc-300 hover:text-white font-bold py-3 px-8 rounded-full transition-transform hover:scale-105 flex items-center justify-center">
                            Enter the Arena
                        </Link>
                    </motion.div>
                </div>
                {/* Background Gradient */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-zinc-950 via-zinc-950 to-black/80 z-0"></div>
                <div className="absolute -bottom-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-800/30 rounded-full blur-3xl z-0"></div>
            </main>

            {/* Features Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-oswald uppercase font-bold text-center mb-12">Why StrikeBase?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, i) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <FeatureCard {...feature} />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* For Gyms & Managers Section */}
            <section className="py-20 bg-zinc-900/50">
                <div className="container mx-auto px-4 text-center">
                    <div className="max-w-2xl mx-auto bg-zinc-900 border border-zinc-800 p-8 rounded-2xl">
                        <h2 className="text-3xl font-oswald uppercase font-bold mb-4 text-white">For Gyms & Managers</h2>
                        <p className="text-zinc-400 mb-6">
                            Own a Gym? Manage Fighters? Join StrikeBase to manage your roster.
                        </p>
                        <Link href="/partners" className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-full transition-transform hover:scale-105 inline-flex items-center gap-2">
                            Become a Partner <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-10 bg-zinc-950 border-t border-zinc-800">
                <div className="container mx-auto px-4 text-center">
                    <div className="flex flex-col md:flex-row justify-center gap-6 mb-4">
                        <Link href="/" className="text-zinc-400 hover:text-white transition-colors">Home</Link>
                        <Link href="/fighters" className="text-zinc-400 hover:text-white transition-colors">Database</Link>
                        <Link href="/login" className="text-zinc-400 hover:text-white transition-colors">Login</Link>
                    </div>
                    <p className="text-zinc-500 text-sm">&copy; 2024 StrikeBase. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
