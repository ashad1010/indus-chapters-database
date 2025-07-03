// PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function PrivateRoute({ children, adminOnly = false }) {
  const { user, userRole, userCountry, loading } = useAuth(); // ✅ Add userCountry

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;

  // ✅ Allow admin, or editor with assigned country, to access adminOnly routes
  if (adminOnly && !(userRole === 'admin' || (userRole === 'editor' && userCountry))) {
    return <Navigate to="/view" replace />;
  }

  return children;
}

export default PrivateRoute;
