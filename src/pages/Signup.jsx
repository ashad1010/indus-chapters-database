// Signup.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import logoImg from '../assets/IHNlogo.jpeg';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role: 'pending' }
      }
    });

    if (error) {
      setError(error.message);
    } else {
      alert('✅ Account created! Check your email to confirm it. You will be granted access once approved by an admin.');
      navigate('/login');
    }

    setLoading(false);
  };

  return (
    <div style={containerStyle}>
      {/* Left panel — branding */}
      <div style={leftPanelStyle}>
        <div style={brandingInnerStyle}>
        <img src={logoImg} alt="IDF Logo" style={{ width: '56px', height: '56px', borderRadius: '14px', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.3)' }} />
          <h1 style={{ color: 'white', fontSize: '1.7rem', fontWeight: '700', margin: '1.5rem 0 0.5rem', letterSpacing: '-0.02em' }}>
            Join IHN Chapters
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            Request access to the Chapter Management System. Once you sign up, an admin will review and approve your account.
          </p>

          {/* Access steps */}
          <div style={stepsContainerStyle}>
            <Step number="1" text="Create your account below" />
            <Step number="2" text="Confirm your email address" />
            <Step number="3" text="Admin grants your role & country" />
            <Step number="4" text="Access the dashboard" />
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: '-60px', right: '-60px', width: '220px', height: '220px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '-40px', left: '-40px', width: '160px', height: '160px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
      </div>

      {/* Right panel — form */}
      <div style={rightPanelStyle}>
        <div style={cardStyle}>
          <h2 style={headingStyle}>Create an account</h2>
          <p style={{ color: '#666', marginBottom: '2rem', fontSize: '0.93rem' }}>
            Enter your details to request access
          </p>

          <form onSubmit={handleSignup}>
            <div style={fieldGroupStyle}>
              <label style={labelStyle}>Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#0060af'}
                onBlur={e => e.target.style.borderColor = '#dde3ea'}
              />
            </div>

            <div style={fieldGroupStyle}>
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#0060af'}
                onBlur={e => e.target.style.borderColor = '#dde3ea'}
              />
              <p style={{ fontSize: '0.78rem', color: '#888', marginTop: '0.4rem' }}>
                Use at least 6 characters
              </p>
            </div>

            {error && (
              <div style={errorStyle}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                  <circle cx="12" cy="12" r="10" stroke="#c0392b" strokeWidth="2"/>
                  <path d="M12 8v4M12 16h.01" stroke="#c0392b" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                {error}
              </div>
            )}

            {/* Notice banner */}
            <div style={noticeBannerStyle}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: '1px' }}>
                <circle cx="12" cy="12" r="10" stroke="#0060af" strokeWidth="2"/>
                <path d="M12 8v4M12 16h.01" stroke="#0060af" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span>Your account will be <strong>pending approval</strong> until an admin assigns you a role.</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ ...submitButtonStyle, opacity: loading ? 0.75 : 1 }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#004f91'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#0060af'; }}
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.88rem', color: '#666' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#0060af', fontWeight: '600', textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function Step({ number, text }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
      <div style={{
        width: '26px', height: '26px', borderRadius: '50%',
        background: 'rgba(255,255,255,0.2)',
        border: '1.5px solid rgba(255,255,255,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
        color: 'white', fontWeight: '700', fontSize: '0.78rem',
      }}>
        {number}
      </div>
      <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem' }}>{text}</span>
    </div>
  );
}

const containerStyle = {
  display: 'flex',
  minHeight: '100vh',
  margin: '-2.5rem -2rem',
};

const leftPanelStyle = {
  flex: '1',
  background: 'linear-gradient(145deg, #0060af 0%, #003f75 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '3rem',
  position: 'relative',
  overflow: 'hidden',
  minWidth: '340px',
};

const brandingInnerStyle = {
  position: 'relative',
  zIndex: 1,
  maxWidth: '360px',
};

const logoMarkStyle = {
  width: '56px',
  height: '56px',
  background: 'rgba(255,255,255,0.2)',
  borderRadius: '14px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1.5px solid rgba(255,255,255,0.3)',
};

const stepsContainerStyle = {
  padding: '1.25rem 1.5rem',
  background: 'rgba(255,255,255,0.1)',
  borderRadius: '12px',
  border: '1px solid rgba(255,255,255,0.15)',
};

const rightPanelStyle = {
  flex: '1',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '3rem 2rem',
  background: '#f0f4f8',
};

const cardStyle = {
  background: 'white',
  padding: '2.5rem',
  borderRadius: '16px',
  boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
  width: '100%',
  maxWidth: '420px',
};

const headingStyle = {
  color: '#0d1b2a',
  fontSize: '1.6rem',
  fontWeight: '700',
  marginBottom: '0.4rem',
  letterSpacing: '-0.02em',
};

const fieldGroupStyle = {
  marginBottom: '1.25rem',
};

const labelStyle = {
  display: 'block',
  fontWeight: '600',
  fontSize: '0.85rem',
  color: '#374151',
  marginBottom: '0.4rem',
  letterSpacing: '0.01em',
};

const inputStyle = {
  width: '100%',
  padding: '0.7rem 0.9rem',
  borderRadius: '8px',
  border: '1.5px solid #dde3ea',
  fontSize: '0.95rem',
  color: '#1a1a2e',
  outline: 'none',
  transition: 'border-color 0.15s ease',
  boxSizing: 'border-box',
  background: '#fafbfc',
};

const errorStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  background: '#fff5f5',
  border: '1px solid #fed7d7',
  color: '#c0392b',
  padding: '0.7rem 1rem',
  borderRadius: '8px',
  fontSize: '0.87rem',
  marginBottom: '1rem',
};

const noticeBannerStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '0.5rem',
  background: '#eff6ff',
  border: '1px solid #bfdbfe',
  color: '#1e40af',
  padding: '0.7rem 1rem',
  borderRadius: '8px',
  fontSize: '0.85rem',
  marginBottom: '1.25rem',
  lineHeight: 1.5,
};

const submitButtonStyle = {
  width: '100%',
  background: '#0060af',
  color: 'white',
  border: 'none',
  padding: '0.8rem',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '0.97rem',
  letterSpacing: '0.01em',
  transition: 'background 0.15s ease',
};

export default Signup;