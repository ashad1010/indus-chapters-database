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
      setCities(json.data);
    } catch (err) {
      console.error('Error fetching cities:', err);
      setCities([]);
    }
  };

  useEffect(() => {
    onUpdate({
      selectedCountry,
      selectedRegion,
      city: selectedCity,
      region,
      chapterName,
      chapterDescription
    });
  }, [selectedCountry, selectedRegion, selectedCity, region, chapterName, chapterDescription]);

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

  const fieldRowStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginBottom: '1rem'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={fieldRowStyle}>
        <label style={labelStyle}>Country:</label>
        <select value={selectedCountry} onChange={handleCountryChange} style={inputStyle}>
          <option value="">-- Select a country --</option>
          {countries.map((country, idx) => (
            <option key={idx} value={country}>{country}</option>
          ))}
        </select>
      </div>

      <div style={fieldRowStyle}>
        <label style={labelStyle}>City:</label>
        <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} disabled={!cities.length} style={inputStyle}>
          <option value="">-- Select a city --</option>
          {cities.map((city, idx) => (
            <option key={idx} value={city}>{city}</option>
          ))}
        </select>
      </div>

      <div style={fieldRowStyle}>
        <label style={labelStyle}>State / Province:</label>
        <input type="text" value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)} placeholder="Enter region" style={inputStyle} />
      </div>

      <div style={fieldRowStyle}>
        <label style={labelStyle}>Region (Division/Area):</label>
        <input type="text" value={region} onChange={(e) => setRegion(e.target.value)} placeholder="e.g. Northwest Division" style={inputStyle} />
      </div>

      <div style={fieldRowStyle}>
        <label style={labelStyle}>Chapter Name:</label>
        <input type="text" value={chapterName} onChange={(e) => setChapterName(e.target.value)} placeholder="e.g. Seattle Chapter" style={inputStyle} />
      </div>

      <div style={fieldRowStyle}>
        <label style={labelStyle}>Chapter Description:</label>
        <textarea value={chapterDescription} onChange={(e) => setChapterDescription(e.target.value)} placeholder="Describe this chapter briefly..." rows={4} style={{ ...inputStyle, resize: 'vertical' }} />
      </div>
    </div>
  );
}

export default ChapterLocationForm;
