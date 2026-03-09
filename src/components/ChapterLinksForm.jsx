// ChapterLinksForm.jsx
import React, { useState, useEffect } from 'react';

function ChapterLinksForm({ onUpdate }) {
  const [whatsappLink, setWhatsappLink] = useState('');
  const [socialLinks, setSocialLinks] = useState(['']);

  const addSocialLink = () => {
    if (socialLinks.length < 5) setSocialLinks([...socialLinks, '']);
  };

  const handleSocialLinkChange = (index, value) => {
    const updated = [...socialLinks];
    updated[index] = value;
    setSocialLinks(updated);
  };

  const removeSocialLink = (index) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  };

  useEffect(() => {
    onUpdate({ whatsappLink, socialLinks });
  }, [whatsappLink, socialLinks, onUpdate]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* WhatsApp */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <label style={labelStyle}>
          <span style={labelIconStyle}>💬</span> WhatsApp Group Link
        </label>
        <input
          type="url"
          value={whatsappLink}
          onChange={(e) => setWhatsappLink(e.target.value)}
          placeholder="https://chat.whatsapp.com/..."
          style={inputStyle}
          onFocus={e => e.target.style.borderColor = '#0060af'}
          onBlur={e => e.target.style.borderColor = '#e2e8f0'}
        />
      </div>

      {/* Social links */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <label style={labelStyle}>
            <span style={labelIconStyle}>🔗</span> Social Media Links
            <span style={{ color: '#94a3b8', fontWeight: '400', marginLeft: '0.4rem' }}>(up to 5)</span>
          </label>
          {socialLinks.length < 5 && (
            <button type="button" onClick={addSocialLink} style={addBtnStyle}
              onMouseEnter={e => e.currentTarget.style.background = '#004f91'}
              onMouseLeave={e => e.currentTarget.style.background = '#0060af'}
            >
              + Add Link
            </button>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {socialLinks.map((link, index) => (
            <div key={index} style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '700', color: '#64748b', flexShrink: 0 }}>
                {index + 1}
              </div>
              <input
                type="url"
                value={link}
                onChange={(e) => handleSocialLinkChange(index, e.target.value)}
                placeholder={`https://...`}
                style={{ ...inputStyle, flex: 1 }}
                onFocus={e => e.target.style.borderColor = '#0060af'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
              <button
                type="button"
                onClick={() => removeSocialLink(index)}
                style={removeBtnStyle}
                onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                onMouseLeave={e => e.currentTarget.style.background = 'white'}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

const labelStyle = { fontSize: '0.82rem', fontWeight: '600', color: '#374151', letterSpacing: '0.01em', display: 'flex', alignItems: 'center', gap: '0.3rem' };
const labelIconStyle = { fontSize: '0.95rem' };

const inputStyle = {
  width: '100%', padding: '0.65rem 0.85rem', fontSize: '0.92rem',
  borderRadius: '8px', border: '1.5px solid #e2e8f0',
  color: '#1e293b', background: '#fafbfc', outline: 'none',
  boxSizing: 'border-box', transition: 'border-color 0.15s',
};

const addBtnStyle = {
  padding: '0.4rem 0.9rem', background: '#0060af', color: 'white',
  border: 'none', borderRadius: '7px', fontWeight: '600',
  fontSize: '0.8rem', cursor: 'pointer', transition: 'background 0.15s',
};

const removeBtnStyle = {
  padding: '0.4rem 0.65rem', background: 'white', color: '#dc2626',
  border: '1.5px solid #fecaca', borderRadius: '7px', fontWeight: '600',
  fontSize: '0.85rem', cursor: 'pointer', transition: 'background 0.15s', flexShrink: 0,
};

export default ChapterLinksForm;