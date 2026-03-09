// Home.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import bgImage from '../assets/IHNglobal.jpg';

function Home() {
  const { session, userRole, userCountry } = useAuth();
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      const email = data?.session?.user?.email;
      if (email) setUserEmail(email);
    };
    if (!session?.user?.email) {
      fetchSession();
    } else {
      setUserEmail(session.user.email);
    }
  }, [session]);

  const isLoggedIn = !!userEmail;
  const canAdd = userRole === 'admin' || userRole === 'super_admin' || (userRole === 'editor' && userCountry);
  const canManageUsers = userRole === 'admin' || userRole === 'super_admin';

  return (
    <div>
      {/* Hero banner */}
      <div style={heroStyle}>
        {/* Background image */}
        <div style={{
          ...heroBgStyle,
          backgroundImage: `url(${bgImage})`,
        }} />
        {/* Gradient overlay */}
        <div style={heroOverlayStyle} />

        {/* Hero content */}
        <div style={heroContentStyle}>
          <div style={heroBadgeStyle}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: isLoggedIn ? '#4ade80' : '#fbbf24', display: 'inline-block', marginRight: '0.5rem' }} />
            {isLoggedIn ? 'Authenticated Session' : 'Not Signed In'}
          </div>

          <h1 style={heroHeadingStyle}>
            Indus Health Network <br />Chapter Management System
          </h1>
          <p style={heroSubtextStyle}>
            Internal dashboard for Indus Health Network — manage global chapters, teams, and events across all regions.
          </p>

          {isLoggedIn && (
            <div style={heroUserBadgeStyle}>
              <div style={avatarStyle}>
                {userEmail.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ color: 'white', fontWeight: '600', fontSize: '0.92rem' }}>{userEmail}</div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.78rem', marginTop: '0.1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {userRole || 'Pending'}
                  {userCountry ? ` · ${userCountry}` : ''}
                </div>
              </div>
            </div>
          )}

          {!isLoggedIn && (
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              <Link to="/login" style={heroPrimaryBtnStyle}>Sign In</Link>
              <Link to="/signup" style={heroSecondaryBtnStyle}>Request Access</Link>
            </div>
          )}
        </div>
      </div>

      {/* Quick action cards — only if logged in */}
      {isLoggedIn && (
        <div style={{ marginTop: '2rem' }}>
          <h2 style={sectionHeadingStyle}>Quick Actions</h2>
          <div style={cardsGridStyle}>

            <ActionCard
              to="/view"
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="currentColor"/>
                </svg>
              }
              title="View Chapters"
              description="Browse all global IHN chapters, filter by country or region, and export reports."
              color="#0060af"
            />

            {canAdd && (
              <ActionCard
                to="/add"
                icon={
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" fill="currentColor"/>
                  </svg>
                }
                title="Add Chapter"
                description="Create a new chapter with location, team members, links, and activities."
                color="#0f7a4a"
              />
            )}

            {canManageUsers && (
              <ActionCard
                to="/users"
                icon={
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" fill="currentColor"/>
                  </svg>
                }
                title="Manage Users"
                description="Assign roles and country access to team members and chapter editors."
                color="#7c3aed"
              />
            )}

          </div>
        </div>
      )}

      {/* Info strip */}
      <div style={infoStripStyle}>
        <InfoStat icon="🌍" value="Global" label="Chapter Network" />
        <div style={infoDividerStyle} />
        <InfoStat icon="🏥" value="Free" label="Healthcare Mission" />
        <div style={infoDividerStyle} />
        <InfoStat icon="🔒" value="Secure" label="Role-Based Access" />
        <div style={infoDividerStyle} />
        <InfoStat icon="📊" value="XLSX" label="Data Export" />
      </div>
    </div>
  );
}

function ActionCard({ to, icon, title, description, color }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <Link
      to={to}
      style={{
        display: 'block',
        background: 'white',
        borderRadius: '12px',
        padding: '1.75rem',
        boxShadow: hovered ? '0 8px 28px rgba(0,0,0,0.12)' : '0 2px 12px rgba(0,0,0,0.06)',
        border: `1.5px solid ${hovered ? color : '#e8edf2'}`,
        textDecoration: 'none',
        transition: 'all 0.2s ease',
        transform: hovered ? 'translateY(-2px)' : 'none',
        cursor: 'pointer',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        width: '48px', height: '48px', borderRadius: '10px',
        background: `${color}18`,
        color: color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '1rem',
      }}>
        {icon}
      </div>
      <h3 style={{ color: '#0d1b2a', fontSize: '1.05rem', fontWeight: '700', marginBottom: '0.4rem' }}>{title}</h3>
      <p style={{ color: '#64748b', fontSize: '0.88rem', lineHeight: 1.55 }}>{description}</p>
      <div style={{ marginTop: '1rem', color: color, fontSize: '0.85rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
        Open <span style={{ fontSize: '1rem' }}>→</span>
      </div>
    </Link>
  );
}

function InfoStat({ icon, value, label }) {
  return (
    <div style={{ textAlign: 'center', flex: 1 }}>
      <div style={{ fontSize: '1.3rem', marginBottom: '0.3rem' }}>{icon}</div>
      <div style={{ color: '#0060af', fontWeight: '700', fontSize: '1rem' }}>{value}</div>
      <div style={{ color: '#64748b', fontSize: '0.78rem', marginTop: '0.1rem' }}>{label}</div>
    </div>
  );
}

// ── Styles ──────────────────────────────────────────────

const heroStyle = {
  position: 'relative',
  borderRadius: '16px',
  overflow: 'hidden',
  minHeight: '340px',
  display: 'flex',
  alignItems: 'flex-end',
  padding: '2.5rem',
};

const heroBgStyle = {
  position: 'absolute',
  inset: 0,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
};

const heroOverlayStyle = {
  position: 'absolute',
  inset: 0,
  background: 'linear-gradient(to top, rgba(0,20,50,0.92) 0%, rgba(0,40,90,0.65) 50%, rgba(0,60,130,0.3) 100%)',
};

const heroContentStyle = {
  position: 'relative',
  zIndex: 1,
  maxWidth: '600px',
};

const heroBadgeStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  background: 'rgba(255,255,255,0.12)',
  border: '1px solid rgba(255,255,255,0.2)',
  color: 'rgba(255,255,255,0.9)',
  padding: '0.3rem 0.75rem',
  borderRadius: '20px',
  fontSize: '0.75rem',
  fontWeight: '500',
  marginBottom: '1rem',
  letterSpacing: '0.03em',
};

const heroHeadingStyle = {
  color: 'white',
  fontSize: '2.2rem',
  fontWeight: '800',
  lineHeight: 1.15,
  marginBottom: '0.75rem',
  letterSpacing: '-0.03em',
};

const heroSubtextStyle = {
  color: 'rgba(255,255,255,0.72)',
  fontSize: '0.97rem',
  lineHeight: 1.65,
  maxWidth: '480px',
};

const heroUserBadgeStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.75rem',
  marginTop: '1.5rem',
  background: 'rgba(255,255,255,0.1)',
  border: '1px solid rgba(255,255,255,0.2)',
  borderRadius: '10px',
  padding: '0.6rem 1rem',
};

const avatarStyle = {
  width: '34px', height: '34px',
  borderRadius: '50%',
  background: '#0060af',
  border: '2px solid rgba(255,255,255,0.4)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  color: 'white', fontWeight: '700', fontSize: '0.9rem',
  flexShrink: 0,
};

const heroPrimaryBtnStyle = {
  padding: '0.65rem 1.4rem',
  background: 'white',
  color: '#0060af',
  borderRadius: '8px',
  fontWeight: '700',
  fontSize: '0.93rem',
  textDecoration: 'none',
};

const heroSecondaryBtnStyle = {
  padding: '0.65rem 1.4rem',
  background: 'rgba(255,255,255,0.12)',
  color: 'white',
  borderRadius: '8px',
  fontWeight: '600',
  fontSize: '0.93rem',
  textDecoration: 'none',
  border: '1.5px solid rgba(255,255,255,0.3)',
};

const sectionHeadingStyle = {
  color: '#0d1b2a',
  fontSize: '1.1rem',
  fontWeight: '700',
  marginBottom: '1rem',
  letterSpacing: '-0.01em',
};

const cardsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
  gap: '1rem',
};

const infoStripStyle = {
  display: 'flex',
  alignItems: 'center',
  background: 'white',
  borderRadius: '12px',
  padding: '1.25rem 2rem',
  marginTop: '1.5rem',
  boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  border: '1px solid #e8edf2',
};

const infoDividerStyle = {
  width: '1px',
  height: '36px',
  background: '#e8edf2',
  margin: '0 1rem',
};

export default Home;