import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { useApp } from '../../context/AppContext';

export default function UserLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, showNotification } = useApp();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      const userId = data.user?.id;
      if (!userId) throw new Error('No user returned');

      const { data: profileData, error: pErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (pErr) throw pErr;

      if (profileData?.role !== 'user') {
        showNotification('Access denied: Use admin login');
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      const userObj = {
        id: profileData.id,
        name: profileData.username || data.user?.email?.split('@')[0] || 'User',
        email: profileData.email || data.user?.email || '',
        avatar: '🙂',
        role: profileData.role,
        joinedAt: profileData.created_at,
        blogCount: 0,
        reviewCount: 0,
      };

      login(userObj as any);
      navigate('/user/dashboard');
    } catch (e: any) {
      showNotification(e?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md p-6 rounded-2xl shadow-lg bg-white">
        <h2 className="text-2xl font-bold mb-4">User Login</h2>
        <input value={email} onChange={e => setEmail(e.target.value)} className="w-full mb-3 p-2 border rounded" placeholder="Email" />
        <input value={password} onChange={e => setPassword(e.target.value)} className="w-full mb-3 p-2 border rounded" placeholder="Password" type="password" />
        <button onClick={handleLogin} disabled={loading} className="w-full py-2 bg-blue-600 text-white rounded">
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </div>
    </div>
  );
}
