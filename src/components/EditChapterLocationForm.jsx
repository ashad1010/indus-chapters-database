// EditChapterLocationForm.jsx
import React, { useState, useEffect } from 'react';

function EditChapterLocationForm({ initialData, onUpdate }) {
  const {
    selectedCountry: initialCountry = '',
    selectedRegion: initialRegion = '',
    city: initialCity = '',
    chapterName: initialName = '',
    chapterDescription: initialDescription = ''
  } = initialData || {};

  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState(initialCountry);
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [selectedRegion, setSelectedRegion] = useState(initialRegion);
  const [chapterName, setChapterName] = useState(initialName);
  const [chapterDescription, setChapterDescription] = useState(initialDescription);

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

  useEffect(() => {
    const fetchCities = async () => {
      if (!selectedCountry) return;
      try {
        const res = await fetch('https://countriesnow.space/api/v0.1/countries/cities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ country: selectedCountry })
        });
        const json = await res.json();
        setCities(json.data);
      } catch (err) {
        console.error('Error fetching cities:', err);
        setCities([]);
      }
    };
    fetchCities();
  }, [selectedCountry]);

  useEffect(() => {
    onUpdate({
      selectedCountry,
      selectedRegion,
      city: selectedCity,
      chapterName,
      chapterDescription
    });
  }, [selectedCountry, selectedRegion, selectedCity, chapterName, chapterDescription]);

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
      <h3 style={{ color: '#0060af', marginBottom: '1rem' }}>Edit Chapter Location</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', alignItems: 'center' }}>
        <label style={labelStyle}>Country:</label>
        <select value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)} style={inputStyle}>
          <option value="">-- Select a country --</option>
          {countries.map((country, idx) => (
            <option key={idx} value={country}>{country}</option>
          ))}
        </select>

        <label style={labelStyle}>City:</label>
        <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} disabled={!cities.length} style={inputStyle}>
          <option value="">-- Select a city --</option>
          {cities.map((city, idx) => (
            <option key={idx} value={city}>{city}</option>
          ))}
        </select>

        <label style={labelStyle}>State / Province:</label>
        <input type="text" value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)} placeholder="Enter region" style={inputStyle} />

        <label style={labelStyle}>Chapter Name:</label>
        <input type="text" value={chapterName} onChange={(e) => setChapterName(e.target.value)} placeholder="Enter chapter name" style={inputStyle} />

        <label style={labelStyle}>Description:</label>
        <textarea rows={4} value={chapterDescription} onChange={(e) => setChapterDescription(e.target.value)} placeholder="Describe the chapter..." style={{ ...inputStyle, resize: 'vertical' }} />
      </div>
    </div>
  );
}

export default EditChapterLocationForm;