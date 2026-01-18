'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'error' | 'success' } | null>(null);

  // Redirect if already logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        router.push('/dashboard');
      }
    };
    checkUser();
  }, [router]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        if (data.user && !data.user.email_confirmed_at) {
          setMessage({
            text: 'Account created! Please check your email to confirm your account.',
            type: 'success'
          });
        } else {
          setMessage({
            text: 'Account created successfully! Redirecting...',
            type: 'success'
          });
          setTimeout(() => router.push('/setup'), 1500);
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        router.push('/dashboard');
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      setMessage({
        text: error.message || 'An error occurred during authentication',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setMessage(null);
    setEmail('');
    setPassword('');
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-block">
          <h1 className="text-4xl sm:text-6xl font-oswald italic text-red-500 mb-2 uppercase tracking-tighter">
            Strike<span className="text-white">Base</span>
          </h1>
        </Link>
        <p className="text-zinc-400 font-mono text-xs uppercase tracking-widest">
          Combat Sports Management Platform
        </p>
      </div>

      {/* Auth Card */}
      <div className="w-full max-w-md bg-zinc-900/50 border border-zinc-800 p-8 rounded-xl shadow-2xl backdrop-blur-sm">
        <div className="text-center mb-6">
          <h2 className="text-2xl text-white font-oswald mb-2 uppercase">
            {isSignUp ? 'Create Account' : 'Manager Login'}
          </h2>
          <p className="text-zinc-400 text-sm">
            {isSignUp ? 'Join the elite combat sports network' : 'Access your gym management dashboard'}
          </p>
        </div>

        {/* Status Message */}
        {message && (
          <div className={`p-4 rounded-lg mb-6 flex items-start gap-3 ${
            message.type === 'error'
              ? 'bg-red-900/20 border border-red-800 text-red-400'
              : 'bg-green-900/20 border border-green-800 text-green-400'
          }`}>
            {message.type === 'error' ? (
              <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
            ) : (
              <CheckCircle size={20} className="flex-shrink-0 mt-0.5" />
            )}
            <p className="text-sm">{message.text}</p>
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm text-zinc-300 mb-2 font-medium">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded-lg text-white placeholder-zinc-400 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all duration-200"
              placeholder="manager@gym.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm text-zinc-300 mb-2 font-medium">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                className="w-full bg-zinc-800 border border-zinc-700 p-3 pr-12 rounded-lg text-white placeholder-zinc-400 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all duration-200"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-300 transition-colors"
                disabled={loading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-zinc-700 text-white font-oswald uppercase font-bold py-4 px-6 rounded-lg transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-red-900/25"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                {isSignUp ? 'Creating Account...' : 'Signing In...'}
              </>
            ) : (
              isSignUp ? 'Create Account' : 'Sign In'
            )}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-6 text-center">
          <button
            onClick={toggleMode}
            className="text-zinc-400 hover:text-white text-sm transition-colors underline underline-offset-4"
            disabled={loading}
          >
            {isSignUp
              ? 'Already have an account? Sign in'
              : "Don't have an account? Sign up"
            }
          </button>
        </div>

        {/* Back to Home */}
        <div className="mt-4 text-center">
          <Link
            href="/"
            className="text-zinc-500 hover:text-zinc-400 text-xs transition-colors"
          >
            ← Back to StrikeBase
          </Link>
        </div>
      </div>
    </div>
  );
}