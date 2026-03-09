// AddChapter.jsx
import React, { useState } from 'react';
import ChapterLocationForm from '../components/ChapterLocationForm';
import ChapterTeamForm from '../components/ChapterTeamForm';
import ChapterLinksForm from '../components/ChapterLinksForm';
import ChapterActivitiesForm from '../components/ChapterActivitiesForm';
import ChapterReviewForm from '../components/ChapterReviewForm';
import { supabase } from '../supabaseClient';

const STEPS = [
  { number: 1, label: 'Location', icon: '📍' },
  { number: 2, label: 'Team', icon: '👥' },
  { number: 3, label: 'Links', icon: '🔗' },
  { number: 4, label: 'Events', icon: '📅' },
  { number: 5, label: 'Review', icon: '✅' },
];

function AddChapter() {
  const [locationData, setLocationData] = useState({});
  const [teamData, setTeamData] = useState([]);
  const [linkData, setLinkData] = useState({ whatsappLink: '', socialLinks: [] });
  const [activityData, setActivityData] = useState([]);
  const [showReview, setShowReview] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const currentStep = showReview ? 5 : null; // steps are all visible, this just controls review

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
    const { error } = await supabase.from('chapters').insert([finalChapter]);
    if (error) {
      console.error('❌ Supabase insert error:', error);
      alert(`❌ Error saving chapter: ${error.message}`);
    } else {
      alert('✅ Chapter saved to database!');
    }
    setSubmitting(false);
  };

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto' }}>

      {/* Page header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h2 style={{ color: '#0d1b2a', fontSize: '1.5rem', fontWeight: '700', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
          Add a New Chapter
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
          Fill in all sections below, then review and submit.
        </p>
      </div>

      {/* Step progress bar */}
      <div style={stepBarStyle}>
        {STEPS.map((step, i) => {
          const isComplete = showReview || false;
          const isActive = step.number === 5 ? showReview : !showReview;
          return (
            <React.Fragment key={step.number}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: step.number === 5 && showReview ? '#0060af'
                    : step.number === 5 ? '#e2e8f0'
                    : '#0060af',
                  color: step.number === 5 && !showReview ? '#94a3b8' : 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: '700', fontSize: '0.85rem',
                  border: step.number === 5 && !showReview ? '2px solid #e2e8f0' : 'none',
                  transition: 'all 0.2s',
                }}>
                  {step.number === 5 && showReview ? '✓' : step.number}
                </div>
                <span style={{
                  fontSize: '0.72rem', fontWeight: '600',
                  color: step.number === 5 && !showReview ? '#94a3b8' : '#374151',
                  letterSpacing: '0.03em',
                }}>
                  {step.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ flex: 1, height: '2px', background: '#e2e8f0', marginBottom: '1.1rem', borderRadius: '2px' }} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Form sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        <FormSection number={1} icon="📍" title="Chapter Location" subtitle="Set the geographic details and name for this chapter">
          <ChapterLocationForm onUpdate={setLocationData} />
        </FormSection>

        <FormSection number={2} icon="👥" title="Team Members" subtitle="Add the people who make up this chapter's leadership and team" optional>
          <ChapterTeamForm onUpdate={setTeamData} />
        </FormSection>

        <FormSection number={3} icon="🔗" title="Group & Social Links" subtitle="WhatsApp group link and social media pages" optional>
          <ChapterLinksForm onUpdate={setLinkData} />
        </FormSection>

        <FormSection number={4} icon="📅" title="Events & Activities" subtitle="Log past or upcoming events organized by this chapter" optional>
          <ChapterActivitiesForm onUpdate={setActivityData} />
        </FormSection>

      </div>

      {/* Review & Submit */}
      <div style={{ marginTop: '1.5rem', background: 'white', borderRadius: '12px', border: '1px solid #e8edf2', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e8edf2', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={sectionIconStyle('#0f7a4a')}>✅</div>
            <div>
              <div style={{ fontWeight: '700', color: '#0d1b2a', fontSize: '1rem' }}>Review & Submit</div>
              <div style={{ color: '#64748b', fontSize: '0.8rem' }}>Check your data before saving to the database</div>
            </div>
          </div>
          {!showReview && (
            <button
              onClick={() => setShowReview(true)}
              style={reviewButtonStyle}
              onMouseEnter={e => e.currentTarget.style.background = '#004f91'}
              onMouseLeave={e => e.currentTarget.style.background = '#0060af'}
            >
              Review Entry
            </button>
          )}
        </div>

        {showReview && (
          <div style={{ padding: '1.5rem' }}>
            <ChapterReviewForm
              data={finalChapter}
              onSubmit={handleSubmit}
              isSubmitting={submitting}
            />
          </div>
        )}
      </div>

    </div>
  );
}

// Reusable section wrapper
function FormSection({ number, icon, title, subtitle, optional, children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e8edf2', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      {/* Section header */}
      <div
        style={{ padding: '1.25rem 1.5rem', borderBottom: collapsed ? 'none' : '1px solid #e8edf2', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', userSelect: 'none' }}
        onClick={() => setCollapsed(!collapsed)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={sectionIconStyle('#0060af')}>{icon}</div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontWeight: '700', color: '#0d1b2a', fontSize: '1rem' }}>{title}</span>
              {optional && (
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', background: '#f1f5f9', padding: '0.1rem 0.5rem', borderRadius: '20px', fontWeight: '500' }}>
                  Optional
                </span>
              )}
            </div>
            <div style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '0.1rem' }}>{subtitle}</div>
          </div>
        </div>
        <div style={{ color: '#94a3b8', transition: 'transform 0.2s', transform: collapsed ? 'rotate(-90deg)' : 'rotate(0deg)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Section body */}
      {!collapsed && (
        <div style={{ padding: '1.5rem' }}>
          {children}
        </div>
      )}
    </div>
  );
}

const sectionIconStyle = (bg) => ({
  width: '38px', height: '38px', borderRadius: '9px',
  background: `${bg}15`,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontSize: '1.1rem', flexShrink: 0,
});

const stepBarStyle = {
  display: 'flex',
  alignItems: 'center',
  background: 'white',
  padding: '1.25rem 1.75rem',
  borderRadius: '12px',
  border: '1px solid #e8edf2',
  marginBottom: '1.5rem',
  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
};

const reviewButtonStyle = {
  padding: '0.55rem 1.25rem',
  background: '#0060af',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  fontWeight: '600',
  fontSize: '0.88rem',
  cursor: 'pointer',
  transition: 'background 0.15s',
};

export default AddChapter;