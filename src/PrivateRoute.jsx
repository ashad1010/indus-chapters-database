import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function PrivateRoute({ children, adminOnly = false }) {
  const { user, userRole, loading } = useAuth();

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && userRole !== 'admin') return <Navigate to="/view" replace />;

  return children;
}

export default PrivateRoute;
