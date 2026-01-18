'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, User, Building, Mail } from 'lucide-react';
import Link from 'next/link';
import { LoadingCard } from '@/components/Loading';
import { ErrorBoundary } from '@/components/ErrorBoundary';

interface Profile {
  id: string;
  manager_name: string;
  gym_name: string;
  email?: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    manager_name: '',
    gym_name: ''
  });
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setProfile({ ...data, email: user.email });
      setFormData({
        manager_name: data.manager_name || '',
        gym_name: data.gym_name || ''
      });
    } catch (error) {
      console.error('Error loading profile:', error);
      setMessage({ text: 'Failed to load profile', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          manager_name: formData.manager_name,
          gym_name: formData.gym_name
        })
        .eq('id', profile.id);

      if (error) throw error;

      setProfile({ ...profile, ...formData });
      setMessage({ text: 'Settings saved successfully!', type: 'success' });
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ text: 'Failed to save settings', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setMessage(null); // Clear any previous messages
  };

  if (loading) {
    return <LoadingCard title="Loading Settings..." className="min-h-screen" />;
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-zinc-950 text-white p-4 sm:p-8 pt-20">
        <div className="max-w-2xl mx-auto">

          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/dashboard"
              className="bg-zinc-800 hover:bg-zinc-700 p-2 rounded-lg transition-colors duration-200"
            >
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl sm:text-3xl font-oswald uppercase">Settings</h1>
          </div>

          {/* Status Message */}
          {message && (
            <div className={`p-4 rounded-lg mb-6 flex items-center gap-3 ${
              message.type === 'error'
                ? 'bg-red-900/20 border border-red-800 text-red-400'
                : 'bg-green-900/20 border border-green-800 text-green-400'
            }`}>
              {message.type === 'success' ? (
                <Save size={20} />
              ) : (
                <div className="w-5 h-5 bg-red-500 rounded-full flex-shrink-0" />
              )}
              <p>{message.text}</p>
            </div>
          )}

          {/* Settings Form */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Email (Read-only) */}
              <div>
                <label className="flex items-center gap-2 text-sm text-zinc-300 mb-2">
                  <Mail size={16} />
                  Email Address
                </label>
                <input
                  type="email"
                  value={profile?.email || ''}
                  disabled
                  className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded-lg text-zinc-400 cursor-not-allowed"
                />
                <p className="text-xs text-zinc-500 mt-1">
                  Email cannot be changed here. Contact support if needed.
                </p>
              </div>

              {/* Manager Name */}
              <div>
                <label htmlFor="manager_name" className="flex items-center gap-2 text-sm text-zinc-300 mb-2">
                  <User size={16} />
                  Manager Name
                </label>
                <input
                  id="manager_name"
                  type="text"
                  value={formData.manager_name}
                  onChange={(e) => handleChange('manager_name', e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded-lg text-white placeholder-zinc-400 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all duration-200"
                  placeholder="Enter your name"
                  required
                />
              </div>

              {/* Gym Name */}
              <div>
                <label htmlFor="gym_name" className="flex items-center gap-2 text-sm text-zinc-300 mb-2">
                  <Building size={16} />
                  Gym Name
                </label>
                <input
                  id="gym_name"
                  type="text"
                  value={formData.gym_name}
                  onChange={(e) => handleChange('gym_name', e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded-lg text-white placeholder-zinc-400 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all duration-200"
                  placeholder="Enter your gym name"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-zinc-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Settings
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Additional Settings Sections */}
          <div className="mt-8 space-y-6">

            {/* Account Section */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <h2 className="text-lg font-oswald uppercase mb-4 text-white">Account</h2>
              <div className="space-y-4">
                <button
                  onClick={() => router.push('/reset-password')}
                  className="w-full text-left bg-zinc-800 hover:bg-zinc-700 p-3 rounded-lg transition-colors duration-200 text-zinc-300 hover:text-white"
                >
                  Change Password
                </button>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                      // Handle account deletion
                    }
                  }}
                  className="w-full text-left bg-red-900/20 hover:bg-red-900/30 border border-red-800 p-3 rounded-lg transition-colors duration-200 text-red-400 hover:text-red-300"
                >
                  Delete Account
                </button>
              </div>
            </div>

            {/* Preferences Section */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <h2 className="text-lg font-oswald uppercase mb-4 text-white">Preferences</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-300">Email Notifications</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-zinc-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-300">Dark Mode</span>
                  <span className="text-zinc-500 text-sm">Always enabled</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}