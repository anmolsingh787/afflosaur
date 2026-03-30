import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, AlertTriangle, ArrowLeft } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { isSupabaseConfigured } from '../../lib/supabaseClient';
import { useApp } from '../../context/AppContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, showNotification } = useApp();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Hardcoded admin bypass
      const ADMIN_EMAIL = 'anmol4941j@gmail.com';
      const ADMIN_PASS = 'anmol9026197910singhsingh';

      if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
        const userObj = {
          id: 'admin-anmol',
          name: 'Anmol Singh',
          email: ADMIN_EMAIL,
          avatar: '???',
          role: 'admin' as const,
          joinedAt: new Date().toISOString(),
          blogCount: 0,
          reviewCount: 0,
        };
        login(userObj as any);
        showNotification('Welcome back, Admin Anmol! ???');
        navigate('/admin');
        return;
      }

      if (!isSupabaseConfigured) {
        setError('Invalid credentials.');
        return;
      }

      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) { setError(authError.message); return; }

      const userId = data.user?.id;
      if (!userId) { setError('Authentication failed'); return; }

      const { data: profileData, error: pErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (pErr || profileData?.role !== 'admin') {
        setError('Access denied. Admin privileges required.');
        await supabase.auth.signOut();
        return;
      }

      const userObj = {
        id: profileData.id,
        name: profileData.username || data.user?.email?.split('@')[0] || 'Admin',
        email: profileData.email || data.user?.email || '',
        avatar: '🛡️',
        role: profileData.role as 'admin',
        joinedAt: profileData.created_at,
        blogCount: 0,
        reviewCount: 0,
      };

      login(userObj as any);
      showNotification('Welcome back, Admin 🛡️');
      navigate('/admin');
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dark background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,165,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,165,0,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Back to user login */}
      <button
        onClick={() => navigate('/auth')}
        className="absolute top-5 left-5 flex items-center gap-2 text-gray-500 hover:text-gray-300 transition-colors text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="relative w-full max-w-md">
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-linear-to-r from-orange-600 to-amber-600 rounded-3xl blur opacity-20" />

        <div className="relative bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-linear-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/20">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-black text-white">Admin Portal</h1>
            <p className="text-gray-500 text-sm mt-1">Restricted access — authorized personnel only</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-3 bg-red-950/50 border border-red-800/50 rounded-xl flex items-center gap-3 text-red-400 text-sm">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">
                Admin Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@afflosaur.com"
                className="w-full px-4 py-3 bg-gray-800/80 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full px-4 py-3 pr-12 bg-gray-800/80 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-linear-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all"
            >
              {loading ? 'Verifying identity...' : 'Access Admin Panel'}
            </button>
          </form>

          {/* Security notice */}
          <div className="mt-6 p-3 bg-gray-800/50 rounded-xl border border-gray-700/50">
            <p className="text-xs text-gray-600 text-center">
              🔒 All admin login attempts are logged and monitored
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
