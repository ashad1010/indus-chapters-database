// PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function PrivateRoute({ children, adminOnly = false }) {
  const { user, userRole, userCountry, loading } = useAuth();

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;

  if (!userRole || userRole === 'pending') {
    return <div style={{ padding: '2rem', textAlign: 'center', color: 'black',  fontWeight: '500', fontSize: '1.2rem' }}>🔒 Access pending approval. Please wait for admin access.</div>;
  }

  if (adminOnly && !(userRole === 'admin' || userRole === 'super_admin' || (userRole === 'editor' && userCountry))) {
    return <Navigate to="/view" replace />;
  }

  return children;
}

export default PrivateRoute;
