// ChapterLocationForm.jsx
import React, { useState, useEffect } from 'react';

function ChapterLocationForm({ onUpdate }) {
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [region, setRegion] = useState('');
  const [chapterName, setChapterName] = useState('');
  const [chapterDescription, setChapterDescription] = useState('');

  // Fetch countries on mount — same as original
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch('https://countriesnow.space/api/v0.1/countries');
        const json = await res.json();
        const countryList = json.data.map((item) => item.country);
        setCountries(countryList);
      } catch (err) {
        console.error('Error fetching countries:', err);
      }
    };
    fetchCountries();
  }, []);

  // Fetch cities when country changes — same as original
  const handleCountryChange = async (e) => {
    const country = e.target.value;
    setSelectedCountry(country);
    setSelectedCity('');
    try {
      const res = await fetch('https://countriesnow.space/api/v0.1/countries/cities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country })
      });
      const json = await res.json();
      setCities(json.data || []);
    } catch (err) {
      console.error('Error fetching cities:', err);
      setCities([]);
    }
  };

  useEffect(() => {
    onUpdate({ selectedCountry, city: selectedCity, selectedRegion, region, chapterName, chapterDescription });
  }, [selectedCountry, selectedCity, selectedRegion, region, chapterName, chapterDescription]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* Row 1: Country + City */}
      <div style={twoColGrid}>
        <Field label="Country" required>
          <select value={selectedCountry} onChange={handleCountryChange} style={inputStyle}>
            <option value="">— Select a country —</option>
            {countries.map((country, idx) => (
              <option key={idx} value={country}>{country}</option>
            ))}
          </select>
        </Field>

        <Field label="City">
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            disabled={!cities.length}
            style={{ ...inputStyle, opacity: !cities.length ? 0.5 : 1 }}
          >
            <option value="">— Select a city —</option>
            {cities.map((city, idx) => (
              <option key={idx} value={city}>{city}</option>
            ))}
          </select>
        </Field>
      </div>

      {/* Row 2: State/Province + Division/Area */}
      <div style={twoColGrid}>
        <Field label="State / Province">
          <input
            type="text"
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            placeholder="e.g. Ontario"
            style={inputStyle}
          />
        </Field>

        <Field label="Region / Division">
          <input
            type="text"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            placeholder="e.g. Northwest Division"
            style={inputStyle}
          />
        </Field>
      </div>

      {/* Row 3: Chapter Name (full width) */}
      <Field label="Chapter Name" required>
        <input
          type="text"
          value={chapterName}
          onChange={(e) => setChapterName(e.target.value)}
          placeholder="e.g. Toronto Chapter"
          style={inputStyle}
        />
      </Field>

      {/* Row 4: Description (full width) */}
      <Field label="Chapter Description">
        <textarea
          value={chapterDescription}
          onChange={(e) => setChapterDescription(e.target.value)}
          placeholder="Briefly describe this chapter's focus, area, or goals..."
          rows={4}
          style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
        />
      </Field>

    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
      <label style={labelStyle}>
        {label}
        {required && <span style={{ color: '#dc2626', marginLeft: '0.2rem' }}>*</span>}
      </label>
      {children}
    </div>
  );
}

const twoColGrid = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '1rem',
};

const labelStyle = {
  fontSize: '0.82rem',
  fontWeight: '600',
  color: '#374151',
  letterSpacing: '0.01em',
};

const inputStyle = {
  width: '100%',
  padding: '0.65rem 0.85rem',
  fontSize: '0.92rem',
  borderRadius: '8px',
  border: '1.5px solid #e2e8f0',
  color: '#1e293b',
  background: '#fafbfc',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s',
};

export default ChapterLocationForm;