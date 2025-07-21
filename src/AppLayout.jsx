// AppLayout.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { supabase } from './supabaseClient';

function AppLayout({ children }) {
  // 🔐 Pull in user info, role, and country from context
  const { user, userRole, userCountry } = useAuth();
  const navigate = useNavigate();

  // 🔓 Logout logic
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) navigate('/login');
  };

  return (
    <div>
      <nav style={{ background: '#0060af', padding: '1rem 0' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Link to="/" style={{ color: 'white', fontWeight: 'bold', textDecoration: 'none', fontSize: '1.1rem' }}>Indus Dashboard</Link>

            {/* 👤 Show navigation links only if logged in */}
            {user && (
              <>
                {/* ✅ Show 'Add Chapter' for admins or editors with valid country */}
                {(userRole === 'admin' || userRole === 'super_admin' || (userRole === 'editor' && userCountry)) && (
                  <Link to="/add" style={buttonStyle}>Add Chapter</Link>
                )}

                {(userRole === 'admin' || userRole === 'super_admin') && (
                  <Link to="/users" style={buttonStyle}>Manage Users</Link>
                )}


                {/* ✅ All logged-in users can view chapters */}
                <Link to="/view" style={buttonStyle}>View Chapters</Link>
              </>
            )}
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {/* 🔐 Show login/signup when logged out */}
            {!user && (
              <>
                <Link to="/login" style={buttonStyle}>Login</Link>
                <Link to="/signup" style={buttonStyle}>Sign Up</Link>
              </>
            )}

            {/* 🔓 Show logout button when logged in */}
            {user && (
              <button onClick={handleLogout} style={{ ...buttonStyle, background: '#e01b24' }}>Logout</button>
            )}
          </div>
        </div>
      </nav>

      <main style={{ padding: '2rem 1rem', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          {children}
        </div>
      </main>
    </div>
  );
}

// Shared button style for nav links
const buttonStyle = {
  padding: '0.5rem 1rem',
  background: '#ffffff',
  color: '#0060af',
  border: 'none',
  borderRadius: '5px',
  fontWeight: 'bold',
  textDecoration: 'none',
  cursor: 'pointer'
};

export default AppLayout;
