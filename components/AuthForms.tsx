// ==========================================
// Afflosaur - Authentication Components
// Role-based login system
// ==========================================

import { useState } from 'react';
import { Eye, EyeOff, Shield, User, Crown, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface AuthFormProps {
  onSuccess: (user: any, role: 'admin' | 'user') => void;
  onError: (error: string) => void;
  isAdminLogin?: boolean;
  onSwitchToAdmin?: () => void;
}

// Admin Login Component
export function AdminLoginForm({ onSuccess, onError }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [requires2FA, setRequires2FA] = useState(false);
  const [_sessionId, setSessionId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // First, authenticate with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        onError(error.message);
        return;
      }

      if (!data.user) {
        onError('Authentication failed');
        return;
      }

      // Check if user is admin
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profileError || profile?.role !== 'admin') {
        onError('Access denied. Admin privileges required.');
        await supabase.auth.signOut();
        return;
      }

      // Check if 2FA is required for admin
      const { data: twoFactorData } = await supabase
        .from('two_factor_auth')
        .select('is_enabled')
        .eq('user_id', data.user.id)
        .single();

      if (twoFactorData?.is_enabled) {
        setRequires2FA(true);
        setSessionId(data.session?.access_token || null);
        return;
      }

      // Log admin login
      await supabase.rpc('log_admin_action', {
        p_action: 'admin_login',
        p_details: { email, ip_address: window.location.hostname }
      });

      onSuccess(data.user, 'admin');

    } catch (err) {
      onError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Verify 2FA code (implement actual verification logic)
      if (twoFactorCode !== '123456') { // Demo code
        onError('Invalid 2FA code');
        return;
      }

      // Get user data again
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Log admin login with 2FA
        await supabase.rpc('log_admin_action', {
          p_action: 'admin_login_2fa',
          p_details: { email, two_factor_used: true }
        });

        onSuccess(user, 'admin');
      }

    } catch (err) {
      onError('2FA verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (requires2FA) {
    return (
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <div className="text-center mb-6">
          <Shield className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Two-Factor Authentication</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Enter the 6-digit code from your authenticator app
          </p>
        </div>

        <form onSubmit={handle2FASubmit} className="space-y-6">
          <div>
            <input
              type="text"
              value={twoFactorCode}
              onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              className="w-full text-center text-2xl font-mono tracking-widest px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              maxLength={6}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || twoFactorCode.length !== 6}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-xl transition-colors"
          >
            {isLoading ? 'Verifying...' : 'Verify Code'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
      <div className="text-center mb-6">
        <Crown className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Login</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Secure access to Afflosaur admin panel
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Admin Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@afflosaur.com"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-linear-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 px-4 rounded-xl transition-all transform hover:scale-105"
        >
          {isLoading ? 'Signing In...' : 'Access Admin Panel'}
        </button>
      </form>

      <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-3 shrink-0" />
          <div>
            <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">Admin Access Only</p>
            <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
              This login is restricted to authorized administrators only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// User Login Component
export function UserLoginForm({ onSuccess, onError, onSwitchToAdmin }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let result;
      if (isSignUp) {
        result = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: email.split('@')[0]
            }
          }
        });
      } else {
        result = await supabase.auth.signInWithPassword({
          email,
          password
        });
      }

      const { data, error } = result;

      if (error) {
        onError(error.message);
        return;
      }

      if (!data.user) {
        onError(isSignUp ? 'Sign up failed' : 'Login failed');
        return;
      }

      // Check user role (should be 'user' for normal users)
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profile?.role === 'admin') {
        onError('This login is for regular users only. Please use admin login.');
        await supabase.auth.signOut();
        return;
      }

      onSuccess(data.user, 'user');

    } catch (err) {
      onError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
      <div className="text-center mb-6">
        <User className="w-12 h-12 text-green-500 mx-auto mb-4 cursor-pointer" onDoubleClick={onSwitchToAdmin} />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {isSignUp ? 'Join Afflosaur' : 'Welcome Back'}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {isSignUp
            ? 'Create your account to start earning coins and discovering deals'
            : 'Sign in to your account to continue your journey'
          }
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-linear-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 px-4 rounded-xl transition-all transform hover:scale-105"
        >
          {isLoading
            ? (isSignUp ? 'Creating Account...' : 'Signing In...')
            : (isSignUp ? 'Create Account' : 'Sign In')
          }
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium"
        >
          {isSignUp
            ? 'Already have an account? Sign in'
            : "Don't have an account? Sign up"
          }
        </button>
      </div>

      <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
        <div className="flex items-start">
          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 mr-3 shrink-0" />
          <div>
            <p className="text-sm text-green-800 dark:text-green-200 font-medium">Earn Coins Daily</p>
            <p className="text-xs text-green-700 dark:text-green-300 mt-1">
              Login daily, write reviews, and complete missions to earn coins and unlock rewards!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Role Selection Component
export function RoleSelector({ onSelectRole }: { onSelectRole: (role: 'admin' | 'user') => void }) {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to Afflosaur 🦖
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Choose how you'd like to access the platform
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Admin Access */}
          <div
            onClick={() => onSelectRole('admin')}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 cursor-pointer hover:shadow-2xl transition-all transform hover:scale-105 border-2 border-transparent hover:border-yellow-300"
          >
            <Crown className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Admin Access</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Full platform management with analytics, user management, and content moderation.
            </p>
            <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-2 mb-6">
              <li>• Manage products and blogs</li>
              <li>• User administration</li>
              <li>• Analytics and reporting</li>
              <li>• Security & audit logs</li>
            </ul>
            <div className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 px-4 py-2 rounded-xl text-sm font-medium">
              Requires admin privileges
            </div>
          </div>

          {/* User Access */}
          <div
            onClick={() => onSelectRole('user')}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 cursor-pointer hover:shadow-2xl transition-all transform hover:scale-105 border-2 border-transparent hover:border-green-300"
          >
            <User className="w-16 h-16 text-green-500 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">User Access</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Discover deals, earn coins, write reviews, and enjoy personalized recommendations.
            </p>
            <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-2 mb-6">
              <li>• Browse deals and products</li>
              <li>• Earn coins daily</li>
              <li>• Write reviews and blogs</li>
              <li>• Track your progress</li>
            </ul>
            <div className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 px-4 py-2 rounded-xl text-sm font-medium">
              Free for everyone
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            New to Afflosaur? Choose "User Access" to create your account and start earning coins! 🪙
          </p>
        </div>
      </div>
    </div>
  );
}