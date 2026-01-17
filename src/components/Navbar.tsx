// components/Navbar.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    // Placeholder for auth state - replace with actual auth logic later
    const isLoggedIn = false;

    return (
        <nav className="fixed top-0 w-full bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 z-50">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="text-2xl font-oswald font-bold text-white">
                    <span className="text-red-500">Strike</span>Base
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex space-x-6">
                    <Link href="/fighters" className="text-zinc-300 hover:text-white transition-colors">
                        Database
                    </Link>
                    <Link href="/arena" className="text-zinc-300 hover:text-white transition-colors">
                        Arena
                    </Link>
                    <Link href={isLoggedIn ? "/profile" : "/login"} className="text-zinc-300 hover:text-white transition-colors">
                        {isLoggedIn ? "Profile" : "Login"}
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden text-zinc-300 hover:text-white transition-colors"
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
                        className="md:hidden bg-zinc-900 border-t border-zinc-800 overflow-hidden"
                    >
                        <div className="px-4 py-4 space-y-4">
                            <Link
                                href="/fighters"
                                className="block text-zinc-300 hover:text-white transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                Database
                            </Link>
                            <Link
                                href="/arena"
                                className="block text-zinc-300 hover:text-white transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                Arena
                            </Link>
                            <Link
                                href={isLoggedIn ? "/profile" : "/login"}
                                className="block text-zinc-300 hover:text-white transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                {isLoggedIn ? "Profile" : "Login"}
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
