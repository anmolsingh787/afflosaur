// ==========================================
// Afflosaur - Authentication Page (User Login)
// Admin login is hidden — triple-click the 🦖 logo
// ==========================================

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { supabase } from '../lib/supabaseClient';
import { isSupabaseConfigured } from '../lib/supabaseClient';

export function AuthPage() {
  const { login, showNotification } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Hidden admin trigger: triple-click the 🦖 dino logo
  const dinoClickCount = useRef(0);
  const dinoClickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleDinoClick = () => {
    dinoClickCount.current += 1;
    if (dinoClickTimer.current) clearTimeout(dinoClickTimer.current);

    if (dinoClickCount.current >= 3) {
      dinoClickCount.current = 0;
      navigate('/admin/login');
      return;
    }

    dinoClickTimer.current = setTimeout(() => {
      dinoClickCount.current = 0;
    }, 800);
  };

  // Auto-redirect if already logged in
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles').select('role').eq('id', session.user.id).single();
        if (profile?.role === 'admin') navigate('/admin/dashboard');
        else navigate('/');
      }
    };
    checkAuth();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!isSupabaseConfigured) {
        login();
        showNotification('Welcome to Afflosaur! 🦖');
        navigate('/');
        return;
      }

      let result;
      if (isSignUp) {
        result = await supabase.auth.signUp({
          email, password,
          options: { data: { username: email.split('@')[0] } },
        });
      } else {
        result = await supabase.auth.signInWithPassword({ email, password });
      }

      const { data, error: authError } = result;
      if (authError) { setError(authError.message); return; }
      if (!data.user) { setError(isSignUp ? 'Sign up failed' : 'Login failed'); return; }

      const { data: profile } = await supabase
        .from('profiles').select('role').eq('id', data.user.id).single();

      if (profile?.role === 'admin') {
        setError('Admin accounts must use the admin portal.');
        await supabase.auth.signOut();
        return;
      }

      showNotification('Welcome back! Start earning coins 🪙');
      navigate('/');
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-linear-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 text-center">
          <div onClick={handleDinoClick} className="select-none cursor-default mb-4 inline-block">
            <span className="text-6xl">🦖</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Afflosaur</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Supabase not configured — demo mode</p>
          <button
            onClick={() => { login(); navigate('/'); }}
            className="w-full py-3 bg-linear-to-r from-green-500 to-emerald-600 text-white font-bold rounded-2xl hover:shadow-lg transition-all"
          >
            Enter Demo Mode 🦖
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo — hidden admin access on triple-click */}
        <div className="text-center mb-8">
          <div onClick={handleDinoClick} className="select-none cursor-default inline-block">
            <span className="text-7xl drop-shadow-lg">🦖</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mt-3">Afflosaur</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {isSignUp ? 'Create your account' : 'Sign in to continue'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8">
          {error && (
            <div className="mb-5 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 text-sm flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-transparent dark:bg-gray-700 dark:text-white outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 pr-12 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-transparent dark:bg-gray-700 dark:text-white outline-none transition"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-60 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              {isLoading
                ? (isSignUp ? 'Creating account...' : 'Signing in...')
                : (isSignUp ? 'Create Account' : 'Sign In')}
            </button>
          </form>

          <div className="mt-5 text-center">
            <button
              type="button"
              onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
              className="text-sm text-green-600 dark:text-green-400 hover:underline font-medium"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>

          <div className="mt-5 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-green-800 dark:text-green-200">Earn Afflo Coins Daily 🪙</p>
              <p className="text-xs text-green-700 dark:text-green-300 mt-0.5">
                Login daily, write reviews & complete missions to unlock rewards!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
