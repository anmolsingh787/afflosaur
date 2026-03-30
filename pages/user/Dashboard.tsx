import { useEffect } from 'react';
import { useApp } from '../../context/AppContext';

export default function UserDashboard() {
  const { user, setPage } = useApp();

  useEffect(() => {
    setPage('profile');
  }, [setPage]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">User Dashboard</h1>
      <p className="mt-2">Welcome back, {user?.name || 'User'}.</p>
    </div>
  );
}
