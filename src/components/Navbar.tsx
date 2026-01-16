// components/Navbar.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/fighters', label: 'Fighters' },
    { href: '/techniques', label: 'Techniques' },
  ];

  return (
    <nav className="bg-zinc-900/40 border-b border-white/5 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold tracking-tighter font-['Oswald']">
            STRIKE<span className="text-red-500">BASE</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-zinc-300 hover:text-white transition-colors text-sm font-medium">
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-zinc-300 hover:text-white">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-zinc-900/95">
          <div className="container mx-auto px-4 pb-4 pt-2 flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)} className="text-zinc-300 hover:text-white rounded-md p-2 text-base font-medium">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
