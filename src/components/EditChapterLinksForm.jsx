// EditChapterLinksForm.jsx
import React, { useState, useEffect } from 'react';

function EditChapterLinksForm({ initialData, onUpdate }) {
  const {
    whatsappLink = '',
    socialLinks = []
  } = initialData || {};

  const [whatsapp, setWhatsapp] = useState(whatsappLink);
  const [links, setLinks] = useState(socialLinks);

  useEffect(() => {
    onUpdate({
      social_links: {
        whatsappLink: whatsapp,
        socialLinks: links
      }
    });
  }, [whatsapp, links]);

  const handleLinkChange = (index, value) => {
    const newLinks = [...links];
    newLinks[index] = value;
    setLinks(newLinks);
  };

  const addLink = () => {
    if (links.length < 5) {
      setLinks([...links, '']);
    }
  };

  const removeLink = (index) => {
    const newLinks = links.filter((_, i) => i !== index);
    setLinks(newLinks);
  };

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
      <h3 style={{ color: '#0060af', marginBottom: '1rem' }}>Edit Chapter Social Links</h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
        <label style={labelStyle}>WhatsApp Group Link:</label>
        <input
          type="url"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          placeholder="https://chat.whatsapp.com/..."
          style={inputStyle}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <label style={{ ...labelStyle, margin: 0 }}>Social Media Links (up to 5):</label>
        {links.length < 5 && (
          <button type="button" onClick={addLink} style={{ background: '#0060af', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            + Add Social Link
          </button>
        )}
      </div>

      {links.map((link, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <input
            type="url"
            value={link}
            onChange={(e) => handleLinkChange(index, e.target.value)}
            placeholder={`Link ${index + 1}`}
            style={inputStyle}
          />
          <button
            type="button"
            onClick={() => removeLink(index)}
            style={{ background: '#e01b24', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

export default EditChapterLinksForm;