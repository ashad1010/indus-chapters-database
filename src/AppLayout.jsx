// AppLayout.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { supabase } from './supabaseClient';
import logoImg from './assets/IHNlogo.jpeg'; 


function AppLayout({ children }) {
  const { user, userRole, userCountry } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div style={{ fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif", minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Top utility bar */}
      <div style={{
        background: '#003f75',
        padding: '0.35rem 0',
        fontSize: '0.78rem',
        color: 'rgba(255,255,255,0.75)',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Indus Health Network — Chapter Management System</span>
          {user && (
            <span style={{ color: 'rgba(255,255,255,0.6)' }}>
              {user.email}
              {userRole && (
                <span style={{
                  marginLeft: '0.6rem',
                  background: 'rgba(255,255,255,0.15)',
                  padding: '0.1rem 0.5rem',
                  borderRadius: '20px',
                  fontSize: '0.72rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {userRole}
                </span>
              )}
            </span>
          )}
        </div>
      </div>

      {/* Main navbar */}
      <nav style={{
        background: '#0060af',
        boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px',
        }}>

          {/* Logo / Brand */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Logo mark */}
            <img src={logoImg} alt="IHN Logo" style={{ width: '38px', height: '38px', borderRadius: '8px', objectFit: 'cover' }} />
            <div>
              <div style={{ color: 'white', fontWeight: '700', fontSize: '1.05rem', lineHeight: 1.2, letterSpacing: '-0.01em' }}>
                IHN Chapters
              </div>
              <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.7rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Dashboard
              </div>
            </div>
          </Link>

          {/* Nav links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            {user && (
              <>
                {(userRole === 'admin' || userRole === 'super_admin' || (userRole === 'editor' && userCountry)) && (
                  <NavLink to="/add" active={isActive('/add')}>Add Chapter</NavLink>
                )}
                {(userRole === 'admin' || userRole === 'super_admin') && (
                  <NavLink to="/users" active={isActive('/users')}>Manage Users</NavLink>
                )}
                <NavLink to="/view" active={isActive('/view')}>View Chapters</NavLink>
              </>
            )}
          </div>

          {/* Auth controls */}
          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
            {!user && (
              <>
                <Link to="/login" style={outlineButtonStyle}>Login</Link>
                <Link to="/signup" style={solidWhiteButtonStyle}>Sign Up</Link>
              </>
            )}
            {user && (
              <button onClick={handleLogout} style={logoutButtonStyle}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ marginRight: '0.4rem' }}>
                  <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5-5-5z" fill="currentColor"/>
                  <path d="M4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" fill="currentColor"/>
                </svg>
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Page content */}
      <main style={{
        flex: 1,
        backgroundColor: '#f0f4f8',
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,96,175,0.04) 1px, transparent 0)',
        backgroundSize: '28px 28px',
        position: 'relative',
        overflow: 'hidden',
      }}>

        {/* Decorative background circles — matching IHN website style */}

        {/* Bottom-left large circle */}
        <div style={{ position: 'absolute', bottom: '-180px', left: '-180px', width: '520px', height: '520px', borderRadius: '50%', border: '6px solid rgba(0,96,175,0.09)', pointerEvents: 'none', zIndex: 0 }} />
        {/* Bottom-left inner ring */}
        <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '320px', height: '320px', borderRadius: '50%', border: '4px solid rgba(0,96,175,0.06)', pointerEvents: 'none', zIndex: 0 }} />

        {/* Top-right large circle */}
        <div style={{ position: 'absolute', top: '-160px', right: '-160px', width: '500px', height: '500px', borderRadius: '50%', border: '6px solid rgba(0,96,175,0.09)', pointerEvents: 'none', zIndex: 0 }} />
        {/* Top-right inner ring */}
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '300px', height: '300px', borderRadius: '50%', border: '4px solid rgba(0,96,175,0.06)', pointerEvents: 'none', zIndex: 0 }} />

        {/* Mid-left accent circle */}
        <div style={{ position: 'absolute', top: '40%', left: '-220px', width: '440px', height: '440px', borderRadius: '50%', border: '4px solid rgba(0,96,175,0.05)', pointerEvents: 'none', zIndex: 0 }} />

        {/* Mid-right accent circle */}
        <div style={{ position: 'absolute', top: '45%', right: '-200px', width: '400px', height: '400px', borderRadius: '50%', border: '4px solid rgba(0,96,175,0.05)', pointerEvents: 'none', zIndex: 0 }} />

        {/* Faint medical cross watermark — bottom right */}
        <svg width="220" height="220" viewBox="0 0 220 220" fill="none" style={{ position: 'absolute', bottom: '2rem', right: '2rem', opacity: 0.03, pointerEvents: 'none', zIndex: 0 }}>
          <rect x="90" y="20" width="40" height="180" rx="8" fill="#0060af"/>
          <rect x="20" y="90" width="180" height="40" rx="8" fill="#0060af"/>
        </svg>

        {/* Faint medical cross watermark — top left */}
        <svg width="160" height="160" viewBox="0 0 220 220" fill="none" style={{ position: 'absolute', top: '2rem', left: '2rem', opacity: 0.03, pointerEvents: 'none', zIndex: 0 }}>
          <rect x="90" y="20" width="40" height="180" rx="8" fill="#0060af"/>
          <rect x="20" y="90" width="180" height="40" rx="8" fill="#0060af"/>
        </svg>

        {/* Content sits above all decorations */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 2rem', position: 'relative', zIndex: 1 }}>
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        background: '#003f75',
        color: 'rgba(255,255,255,0.6)',
        fontSize: '0.8rem',
        padding: '1.25rem 2rem',
        textAlign: 'center',
        letterSpacing: '0.01em',
      }}>
        <span>© {new Date().getFullYear()} Indus Health Network</span>
        <span style={{ margin: '0 0.75rem', opacity: 0.4 }}>|</span>
        <span>Chapter Management System</span>
        <span style={{ margin: '0 0.75rem', opacity: 0.4 }}>|</span>
        <a href="https://indushospital.ca" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}>
          indushospital.ca ↗
        </a>
      </footer>

    </div>
  );
}

// Nav link component with active state
function NavLink({ to, active, children }) {
  return (
    <Link
      to={to}
      style={{
        color: active ? 'white' : 'rgba(255,255,255,0.8)',
        textDecoration: 'none',
        padding: '0.45rem 0.9rem',
        borderRadius: '6px',
        fontSize: '0.9rem',
        fontWeight: active ? '600' : '400',
        background: active ? 'rgba(255,255,255,0.18)' : 'transparent',
        borderBottom: active ? '2px solid white' : '2px solid transparent',
        transition: 'all 0.15s ease',
        letterSpacing: '0.01em',
      }}
      onMouseEnter={e => {
        if (!active) {
          e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
          e.currentTarget.style.color = 'white';
        }
      }}
      onMouseLeave={e => {
        if (!active) {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
        }
      }}
    >
      {children}
    </Link>
  );
}

const outlineButtonStyle = {
  padding: '0.45rem 1.1rem',
  background: 'transparent',
  color: 'white',
  border: '1.5px solid rgba(255,255,255,0.6)',
  borderRadius: '6px',
  fontWeight: '500',
  fontSize: '0.88rem',
  textDecoration: 'none',
  cursor: 'pointer',
  letterSpacing: '0.01em',
};

const solidWhiteButtonStyle = {
  padding: '0.45rem 1.1rem',
  background: 'white',
  color: '#0060af',
  border: '1.5px solid white',
  borderRadius: '6px',
  fontWeight: '600',
  fontSize: '0.88rem',
  textDecoration: 'none',
  cursor: 'pointer',
  letterSpacing: '0.01em',
};

const logoutButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '0.45rem 1.1rem',
  background: 'rgba(255,255,255,0.1)',
  color: 'white',
  border: '1.5px solid rgba(255,255,255,0.3)',
  borderRadius: '6px',
  fontWeight: '500',
  fontSize: '0.88rem',
  cursor: 'pointer',
  letterSpacing: '0.01em',
  transition: 'all 0.15s ease',
};

export default AppLayout;