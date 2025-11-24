// AddChapter.jsx
import React, { useState } from 'react';
import ChapterLocationForm from '../components/ChapterLocationForm';
import ChapterTeamForm from '../components/ChapterTeamForm';
import ChapterLinksForm from '../components/ChapterLinksForm';
import ChapterActivitiesForm from '../components/ChapterActivitiesForm';
import ChapterReviewForm from '../components/ChapterReviewForm';
import { supabase } from '../supabaseClient';

function AddChapter() {
  const [locationData, setLocationData] = useState({});
  const [teamData, setTeamData] = useState([]);
  const [linkData, setLinkData] = useState({ whatsappLink: '', socialLinks: [] });
  const [activityData, setActivityData] = useState([]);
  const [showReview, setShowReview] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const finalChapter = {
    location: {
      chapterName: locationData.chapterName || '',
      selectedCountry: locationData.selectedCountry || '',
      selectedRegion: locationData.selectedRegion || '',
      city: locationData.city || '',
      chapterDescription: locationData.chapterDescription || '',
    },
    team_members: teamData,
    social_links: linkData,
    events: activityData,
    description: locationData.chapterDescription || '',
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const { data, error } = await supabase.from('chapters').insert([finalChapter]);
    if (error) {
      console.error('❌ Supabase insert error:', error);
      alert(`❌ Error saving chapter: ${error.message}`);
    } else {
      alert('✅ Chapter saved to database!');
    }
    setSubmitting(false);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
      <div style={{
        background: 'linear-gradient(90deg, #7e4ca1, #a34e7c)',
        color: 'white',
        padding: '1.5rem 2rem',
        fontSize: '1.75rem',
        fontWeight: 'bold',
        textAlign: 'center'
      }}>
        Add a New Chapter
      </div>

      <div style={{ padding: '2rem', background: 'white' }}>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <ChapterLocationForm onUpdate={setLocationData} />
          <ChapterTeamForm onUpdate={setTeamData} />
          <ChapterLinksForm onUpdate={setLinkData} />
          <ChapterActivitiesForm onUpdate={setActivityData} />
        </form>

        <hr style={{ margin: '2rem 0' }} />

        {!showReview && (
          <button
            onClick={() => setShowReview(true)}
            style={{ background: '#0060af', color: 'white', padding: '0.75rem 1.5rem', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Review & Submit
          </button>
        )}

        {showReview && (
          <ChapterReviewForm
            data={finalChapter}
            onSubmit={handleSubmit}
            isSubmitting={submitting}
          />
        )}
      </div>
    </div>
  );
}

export default AddChapter;
