// PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function PrivateRoute({ children, adminOnly = false }) {
  const { user, userRole } = useAuth();

  // Not logged in? Redirect to login.
  if (!user) return <Navigate to="/login" replace />;

  // If this route is admin-only but the user is not admin, block it.
  if (adminOnly && userRole !== 'admin') {
    return <Navigate to="/view" replace />;
  }

  // Otherwise, render the protected route.
  return children;
}

export default PrivateRoute;
