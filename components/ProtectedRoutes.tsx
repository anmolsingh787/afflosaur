import React from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export function AdminRoute({ children }: { children: JSX.Element }) {
  const { user } = useApp();
  if (!user || user.role !== 'admin') return <Navigate to="/admin/login" replace />;
  return children;
}

export function UserRoute({ children }: { children: JSX.Element }) {
  const { user } = useApp();
  if (!user || user.role !== 'user') return <Navigate to="/user/login" replace />;
  return children;
}

export default function ProtectedRoutes() {
  return <>{/* helpers only */}</>;
}
