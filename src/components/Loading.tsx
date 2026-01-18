'use client';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export function LoadingSpinner({
  size = 'md',
  text,
  className = ''
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className={`${sizeClasses[size]} text-red-500`}
      >
        <Loader2 className="w-full h-full" />
      </motion.div>
      {text && (
        <p className="text-zinc-400 text-sm font-medium">{text}</p>
      )}
    </div>
  );
}

interface LoadingPageProps {
  title?: string;
  subtitle?: string;
}

export function LoadingPage({
  title = 'Loading...',
  subtitle = 'Please wait while we prepare your experience'
}: LoadingPageProps) {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md mx-auto">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <LoadingSpinner size="lg" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-2"
        >
          <h1 className="text-2xl font-oswald text-white uppercase">{title}</h1>
          <p className="text-zinc-400 text-sm leading-relaxed">{subtitle}</p>
        </motion.div>
      </div>
    </div>
  );
}

interface LoadingCardProps {
  title?: string;
  className?: string;
}

export function LoadingCard({
  title = 'Loading...',
  className = ''
}: LoadingCardProps) {
  return (
    <div className={`bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 flex flex-col items-center justify-center ${className}`}>
      <LoadingSpinner size="md" text={title} />
    </div>
  );
}