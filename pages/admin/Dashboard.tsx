import { useEffect } from 'react';
import { useApp } from '../../context/AppContext';

export default function AdminDashboard() {
  const { user, setPage } = useApp();

  useEffect(() => {
    setPage('admin');
  }, [setPage]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p className="mt-2">Welcome, {user?.name || 'Admin'}. Use the left menu to manage content.</p>
    </div>
  );
}
