// ChapterLinksForm.jsx
import React, { useState, useEffect } from 'react';

function ChapterLinksForm({ onUpdate }) {
  const [whatsappLink, setWhatsappLink] = useState('');
  const [socialLinks, setSocialLinks] = useState(['']);

  const addSocialLink = () => {
    if (socialLinks.length < 5) {
      setSocialLinks([...socialLinks, '']);
    }
  };

  const handleSocialLinkChange = (index, value) => {
    const updated = [...socialLinks];
    updated[index] = value;
    setSocialLinks(updated);
  };

  const removeSocialLink = (index) => {
    const updated = socialLinks.filter((_, i) => i !== index);
    setSocialLinks(updated);
  };

  useEffect(() => {
    onUpdate({ whatsappLink, socialLinks });
  }, [whatsappLink, socialLinks, onUpdate]);

  const inputStyle = {
    width: '100%',
    padding: '0.5rem',
    fontSize: '1rem',
    borderRadius: '5px',
    border: '1px solid #ccc'
  };

  const labelStyle = {
    marginBottom: '0.3rem',
    fontWeight: 'bold',
    color: '#222'
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ color: '#0060af', margin: 0 }}>Group & Social Media Links - Optional</h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
        <label style={labelStyle}>Group Link:</label>
        <input
          type="text"
          value={whatsappLink}
          onChange={(e) => setWhatsappLink(e.target.value)}
          placeholder="https://chat.whatsapp.com/..."
          style={inputStyle}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <label style={{ ...labelStyle, margin: 0 }}>Social Media Links (up to 5):</label>
        {socialLinks.length < 5 && (
          <button type="button" onClick={addSocialLink} style={{ background: '#0060af', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            + Add Social Link
          </button>
        )}
      </div>

      {socialLinks.map((link, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <input
            type="text"
            value={link}
            onChange={(e) => handleSocialLinkChange(index, e.target.value)}
            placeholder={`Link ${index + 1}`}
            style={inputStyle}
          />
          <button type="button" onClick={() => removeSocialLink(index)} style={{ background: '#e01b24', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer' }}>✕</button>
        </div>
      ))}
    </div>
  );
}

export default ChapterLinksForm;