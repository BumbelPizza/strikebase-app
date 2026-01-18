// app/page.tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Database, Swords, ShieldCheck, ArrowRight, Users, TrendingUp } from 'lucide-react';

// Optimized Feature Card Component with better accessibility
const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <motion.div
        className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl flex flex-col items-center text-center hover:border-red-500/30 transition-colors duration-200"
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 300 }}
    >
        <div className="bg-red-600/10 p-3 rounded-full mb-4 border border-red-600/30">
            {icon}
        </div>
        <h3 className="font-oswald text-xl font-bold uppercase mb-2 text-white">{title}</h3>
        <p className="text-zinc-400 text-sm leading-relaxed">{description}</p>
    </motion.div>
);

// Stats Component for social proof
const StatsCard = ({ number, label }: { number: string, label: string }) => (
    <div className="text-center">
        <div className="text-2xl md:text-3xl font-bold text-red-400 font-mono">{number}</div>
        <div className="text-zinc-400 text-sm uppercase tracking-wider">{label}</div>
    </div>
);

export default function MarketingHomepage() {
    const features = [
        {
            icon: <Database size={24} className="text-red-400" />,
            title: 'Live Database',
            description: 'Real-time fighter stats and comprehensive combat records.'
        },
        {
            icon: <Swords size={24} className="text-red-400" />,
            title: 'Fight Simulator',
            description: 'Advanced matchup analysis and predictive modeling.'
        },
        {
            icon: <ShieldCheck size={24} className="text-red-400" />,
            title: 'Verified Data',
            description: 'Official profiles with authenticated statistics.'
        },
        {
            icon: <Users size={24} className="text-red-400" />,
            title: 'Community',
            description: 'Connect with gyms, managers, and fight enthusiasts.'
        },
        {
            icon: <TrendingUp size={24} className="text-red-400" />,
            title: 'Analytics',
            description: 'Deep insights and performance tracking tools.'
        }
    ];

    return (
        <div className="bg-zinc-950 text-zinc-100 font-inter min-h-screen">
            {/* Hero Section - Optimized for mobile */}
            <main className="min-h-screen flex items-center justify-center text-center p-4 pt-20 pb-16">
                <div className="relative z-10 space-y-6 max-w-4xl mx-auto px-4">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-oswald uppercase font-extrabold tracking-tighter leading-tight"
                    >
                        The Future of <span className="text-red-500 block sm:inline">Combat Data</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-base md:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed"
                    >
                        Real-time statistics, advanced fight analysis, and verified athlete profiles for the modern combat sports era.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4"
                    >
                        <Link
                            href="/fighters"
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 sm:px-8 rounded-full transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-red-500/25 flex items-center justify-center gap-2 text-sm sm:text-base"
                            aria-label="Browse fighter database"
                        >
                            Browse Database <ArrowRight size={18} />
                        </Link>
                        <Link
                            href="/arena"
                            className="border border-zinc-600 hover:border-red-500 text-zinc-300 hover:text-white font-bold py-3 px-6 sm:px-8 rounded-full transition-all duration-200 hover:scale-105 flex items-center justify-center text-sm sm:text-base"
                            aria-label="Enter fight simulator"
                        >
                            Enter Arena
                        </Link>
                    </motion.div>

                    {/* Stats Section */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="grid grid-cols-3 gap-4 max-w-md mx-auto mt-12 pt-8 border-t border-zinc-800"
                    >
                        <StatsCard number="500+" label="Fighters" />
                        <StatsCard number="50+" label="Events" />
                        <StatsCard number="24/7" label="Live Updates" />
                    </motion.div>
                </div>

                {/* Optimized Background */}
                <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-950 to-black/90"></div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 h-80 sm:w-96 sm:h-96 bg-red-800/20 rounded-full blur-3xl"></div>
            </main>

            {/* Features Section - Improved grid */}
            <section className="py-16 sm:py-20">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl sm:text-4xl font-oswald uppercase font-bold mb-4">Why StrikeBase?</h2>
                        <p className="text-zinc-400 max-w-2xl mx-auto">The most comprehensive platform for combat sports intelligence</p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
                        {features.map((feature, i) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 30 }}
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

            {/* CTA Section - Simplified */}
            <section className="py-16 sm:py-20 bg-zinc-900/30">
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="max-w-2xl mx-auto"
                    >
                        <h2 className="text-2xl sm:text-3xl font-oswald uppercase font-bold mb-4 text-white">Ready to Fight?</h2>
                        <p className="text-zinc-400 mb-8 leading-relaxed">
                            Join thousands of fighters, coaches, and fans using StrikeBase for their combat sports needs.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/register"
                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-full transition-all duration-200 hover:scale-105"
                            >
                                Get Started Free
                            </Link>
                            <Link
                                href="/demo"
                                className="border border-zinc-600 hover:border-zinc-500 text-zinc-300 hover:text-white font-bold py-3 px-8 rounded-full transition-all duration-200 hover:scale-105"
                            >
                                View Demo
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer - Clean and accessible */}
            <footer className="py-8 sm:py-10 bg-zinc-950 border-t border-zinc-800">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="text-center md:text-left">
                            <div className="text-xl font-oswald font-bold text-white mb-2">
                                <span className="text-red-500">Strike</span>Base
                            </div>
                            <p className="text-zinc-500 text-sm">The future of combat data</p>
                        </div>

                        <div className="flex flex-wrap justify-center gap-6 text-sm">
                            <Link href="/fighters" className="text-zinc-400 hover:text-white transition-colors">Database</Link>
                            <Link href="/arena" className="text-zinc-400 hover:text-white transition-colors">Arena</Link>
                            <Link href="/market" className="text-zinc-400 hover:text-white transition-colors">Market</Link>
                            <Link href="/login" className="text-zinc-400 hover:text-white transition-colors">Login</Link>
                        </div>
                    </div>

                    <div className="border-t border-zinc-800 mt-6 pt-6 text-center">
                        <p className="text-zinc-500 text-xs">&copy; 2024 StrikeBase. Built for the fighters.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
