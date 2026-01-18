// components/Navbar.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Database, Swords, ShoppingCart, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            if (user) {
                const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
                setProfile(data);
            }
        };
        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
                setProfile(data);
            } else {
                setProfile(null);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const navItems = [
        { href: '/fighters', label: 'Database', icon: Database },
        { href: '/arena', label: 'Arena', icon: Swords },
        ...(user ? [{ href: '/market', label: 'Market', icon: ShoppingCart }] : []),
    ];

    const closeMenu = () => setIsOpen(false);

    return (
        <nav className="fixed top-0 w-full bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800 z-50" role="navigation">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                {/* Logo */}
                <Link
                    href="/"
                    className="text-xl sm:text-2xl font-oswald font-bold text-white hover:text-red-400 transition-colors"
                    aria-label="StrikeBase Home"
                >
                    <span className="text-red-500">Strike</span>Base
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-6">
                    {navItems.map(({ href, label, icon: Icon }) => (
                        <Link
                            key={href}
                            href={href}
                            className="flex items-center gap-2 text-zinc-300 hover:text-white transition-colors text-sm font-medium"
                        >
                            <Icon size={16} />
                            {label}
                        </Link>
                    ))}

                    {/* User Section */}
                    <div className="border-l border-zinc-700 pl-6 flex items-center gap-4">
                        {user ? (
                            <>
                                <span className="text-green-400 font-mono text-sm">
                                    ${profile?.cash || 0}
                                </span>
                                <Link
                                    href="/dashboard"
                                    className="flex items-center gap-2 text-zinc-300 hover:text-white transition-colors"
                                >
                                    <User size={16} />
                                    <span className="hidden lg:inline">{profile?.manager_name || 'Dashboard'}</span>
                                </Link>
                            </>
                        ) : (
                            <Link
                                href="/login"
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden text-zinc-300 hover:text-white transition-colors p-2"
                    aria-label={isOpen ? "Close menu" : "Open menu"}
                    aria-expanded={isOpen}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden bg-zinc-900/95 backdrop-blur-md border-t border-zinc-800 overflow-hidden"
                    >
                        <div className="px-4 py-6 space-y-4">
                            {navItems.map(({ href, label, icon: Icon }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    className="flex items-center gap-3 text-zinc-300 hover:text-white transition-colors py-2"
                                    onClick={closeMenu}
                                >
                                    <Icon size={20} />
                                    {label}
                                </Link>
                            ))}

                            <div className="border-t border-zinc-700 pt-4 mt-4">
                                {user ? (
                                    <>
                                        <div className="flex items-center justify-between py-2">
                                            <span className="text-zinc-400">Cash:</span>
                                            <span className="text-green-400 font-mono">${profile?.cash || 0}</span>
                                        </div>
                                        <Link
                                            href="/dashboard"
                                            className="flex items-center gap-3 text-zinc-300 hover:text-white transition-colors py-2"
                                            onClick={closeMenu}
                                        >
                                            <User size={20} />
                                            {profile?.manager_name || 'Dashboard'}
                                        </Link>
                                    </>
                                ) : (
                                    <Link
                                        href="/login"
                                        className="block bg-red-500 hover:bg-red-600 text-white text-center py-3 px-4 rounded-lg transition-colors font-medium"
                                        onClick={closeMenu}
                                    >
                                        Login
                                    </Link>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
