// ViewChapters.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import * as XLSX from 'xlsx';
import { useAuth } from '../AuthContext';
import EditChapterLocationForm from '../components/EditChapterLocationForm';
import EditChapterLinksForm from '../components/EditChapterLinksForm';
import EditChapterTeamForm from '../components/EditChapterTeamForm';
import EditChapterActivitiesForm from '../components/EditChapterActivitiesForm';

function ViewChapters() {
  const { userRole, userCountry } = useAuth();

  const [chapters, setChapters] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [filterCountry, setFilterCountry] = useState('');
  const [filterRegion, setFilterRegion] = useState('');

  useEffect(() => {
    const fetchChapters = async () => {
      const { data, error } = await supabase
        .from('chapters')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Fetch error:', error.message);
      } else {
        setChapters(data);
      }
      setLoading(false);
    };
    fetchChapters();
  }, [userRole, userCountry]);

  const filteredChapters = chapters.filter((chapter) => {
    const loc = chapter.location || {};
    const query = searchQuery.toLowerCase();
    const countryMatch = !filterCountry || loc.selectedCountry === filterCountry;
    const regionMatch = !filterRegion || loc.selectedRegion === filterRegion;
    return (
      (loc.chapterName?.toLowerCase().includes(query) ||
        loc.selectedCountry?.toLowerCase().includes(query) ||
        loc.selectedRegion?.toLowerCase().includes(query) ||
        loc.city?.toLowerCase().includes(query) ||
        chapter.description?.toLowerCase().includes(query)) &&
      countryMatch &&
      regionMatch
    );
  });

  const generateXLSXData = () => {
    const teamRows = [];
    const eventRows = [];
    filteredChapters.forEach((chapter) => {
      const loc = chapter.location || {};
      chapter.team_members?.forEach((member) => {
        teamRows.push({
          Chapter: loc.chapterName,
          Country: loc.selectedCountry,
          City: loc.city,
          Region: loc.selectedRegion,
          Name: member.name,
          Role: member.role,
          Phone: member.phone,
          Email: member.email,
          Title: member.title,
          Note: member.note,
          Status: member.status
        });
      });
      chapter.events?.forEach((event) => {
        eventRows.push({
          Chapter: loc.chapterName,
          Country: loc.selectedCountry,
          City: loc.city,
          Region: loc.selectedRegion,
          Name: event.name,
          Date: event.date,
          Venue: event.venue,
          TicketPrice: event.ticketPrice,
          CelebrityGuests: event.celebrityGuests,
          Capacity: event.capacity,
          Attendance: event.attendanceCount,
          Sponsors: event.sponsors,
          FundsCollected: event.fundsCollected
        });
      });
    });
    return { teamRows, eventRows };
  };

  const handleDownloadXLSX = () => {
    const { teamRows, eventRows } = generateXLSXData();
    if (teamRows.length === 0 && eventRows.length === 0) return alert('No data to export.');

    const wb = XLSX.utils.book_new();
    if (teamRows.length) {
      const ws1 = XLSX.utils.json_to_sheet(teamRows);
      XLSX.utils.book_append_sheet(wb, ws1, 'Team Members');
    }
    if (eventRows.length) {
      const ws2 = XLSX.utils.json_to_sheet(eventRows);
      XLSX.utils.book_append_sheet(wb, ws2, 'Events');
    }

    const now = new Date();
    const timestamp = now.toISOString().slice(0, 16).replace(/[:T]/g, '-');
    XLSX.writeFile(wb, `indus_report_${timestamp}.xlsx`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this chapter?')) return;
    const { error } = await supabase.from('chapters').delete().eq('id', id);
    if (error) {
      console.error('❌ Delete failed:', error.message);
      alert('Error deleting chapter');
    } else {
      setChapters((prev) => prev.filter((ch) => ch.id !== id));
    }
  };

  const handleEdit = (chapter) => {
    setEditingId(chapter.id);
    setEditedData({
      ...chapter.location,
      description: chapter.description || '',
      social_links: chapter.social_links || {},
      team_members: chapter.team_members || [],
      events: chapter.events || []
    });
  };

  const handleUpdate = async (id) => {
    const { error } = await supabase
      .from('chapters')
      .update({
        location: {
          chapterName: editedData.chapterName,
          selectedCountry: editedData.selectedCountry,
          selectedRegion: editedData.selectedRegion,
          city: editedData.city,
          chapterDescription: editedData.chapterDescription || ''
        },
        description: editedData.description,
        social_links: editedData.social_links,
        team_members: editedData.team_members,
        events: editedData.events
      })
      .eq('id', id);

    if (error) {
      console.error('❌ Update failed:', error.message);
      alert('Error updating chapter');
    } else {
      const updatedChapters = chapters.map((ch) =>
        ch.id === id
          ? {
              ...ch,
              location: {
                chapterName: editedData.chapterName,
                selectedCountry: editedData.selectedCountry,
                selectedRegion: editedData.selectedRegion,
                city: editedData.city,
                chapterDescription: editedData.chapterDescription || ''
              },
              description: editedData.description,
              social_links: editedData.social_links,
              team_members: editedData.team_members,
              events: editedData.events
            }
          : ch
      );
      setChapters(updatedChapters);
      setEditingId(null);
      setEditedData({});
    }
  };

  if (loading) return <p style={{ color: 'black' }}>Loading chapters...</p>;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
      <h2 style={{ color: '#0060af', marginBottom: '1rem' }}>All Chapters</h2>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <select value={filterCountry} onChange={(e) => setFilterCountry(e.target.value)} style={{ padding: '0.5rem', borderRadius: '5px' }}>
          <option value="">All Countries</option>
          {[...new Set(chapters.map(c => c.location?.selectedCountry).filter(Boolean))].map((c, i) => (
            <option key={i} value={c}>{c}</option>
          ))}
        </select>

        <select value={filterRegion} onChange={(e) => setFilterRegion(e.target.value)} style={{ padding: '0.5rem', borderRadius: '5px' }}>
          <option value="">All Regions</option>
          {[...new Set(chapters.map(c => c.location?.selectedRegion).filter(Boolean))].map((r, i) => (
            <option key={i} value={r}>{r}</option>
          ))}
        </select>

        {['admin', 'super_admin', 'editor'].includes(userRole) && (
          <button
            onClick={handleDownloadXLSX}
            style={{ background: '#0060af', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}
          >
            📄 Download Report (XLSX)
          </button>
        )}
      </div>

      <input
        type="text"
        placeholder="Search by name, country, region or city..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ padding: '0.5rem', marginBottom: '1.5rem', width: '100%', borderRadius: '5px', border: '1px solid #ccc' }}
      />

      {filteredChapters.length === 0 && <p style={{ color: 'black' }}>No matching chapters found.</p>}

      {filteredChapters.map((chapter, index) => {
        const loc = chapter.location || {};
        const team = chapter.team_members || [];
        const isEditing = editingId === chapter.id;

        // ✅ Allow admins and super_admins always
        // ✅ Allow editors only if the chapter's country matches theirs
        const canEditDelete =
          userRole === 'admin' ||
          userRole === 'super_admin' ||
          (userRole === 'editor' && loc.selectedCountry === userCountry);

        return (
          <div key={chapter.id || index} style={{ border: '1px solid #ccc', background: 'white', borderRadius: '8px', marginBottom: '2rem', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
            <div style={{ background: 'linear-gradient(90deg, #7e4ca1, #a34e7c)', color: 'white', padding: '1rem 1.5rem', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}>
              <h3 style={{ margin: 0 }}>{loc.chapterName || `Chapter ${index + 1}`}</h3>
            </div>

            <div style={{ padding: '1.5rem', color: '#222' }}>
              {isEditing ? (
                <>
                  <EditChapterLocationForm initialData={chapter.location} onUpdate={(updated) => setEditedData((prev) => ({ ...prev, ...updated }))} />
                  <hr style={{ margin: '2rem 0' }} />
                  <EditChapterLinksForm initialData={chapter.social_links} onUpdate={(updated) => setEditedData((prev) => ({ ...prev, ...updated }))} />
                  <hr style={{ margin: '2rem 0' }} />
                  <EditChapterTeamForm initialData={chapter.team_members} onUpdate={(updated) => setEditedData((prev) => ({ ...prev, ...updated }))} />
                  <hr style={{ margin: '2rem 0' }} />
                  <EditChapterActivitiesForm initialData={chapter.events} onUpdate={(updated) => setEditedData((prev) => ({ ...prev, ...updated }))} />
                </>
              ) : (
                <div style={{ marginTop: '0.75rem' }}>
                  <p><strong>Country:</strong> {loc.selectedCountry}</p>
                  <p><strong>Region:</strong> {loc.selectedRegion}</p>
                  <p><strong>City:</strong> {loc.city}</p>
                  <p><strong>Description:</strong> {chapter.description}</p>

                  {chapter.social_links?.whatsappLink && (
                    <p><strong>WhatsApp:</strong> <a href={chapter.social_links.whatsappLink} target="_blank" rel="noreferrer">{chapter.social_links.whatsappLink}</a></p>
                  )}

                  {chapter.social_links?.socialLinks?.length > 0 && (
                    <>
                      <strong>Social Media Links:</strong>
                      <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
                        {chapter.social_links.socialLinks.map((link, i) => (
                          <li key={i}><a href={link} target="_blank" rel="noreferrer">{link}</a></li>
                        ))}
                      </ul>
                    </>
                  )}

                  {team.length > 0 && (
                    <>
                      <strong>Team Members:</strong>
                      <ul style={{ marginLeft: '1.5rem' }}>
                        {team.map((member, i) => (
                          <li key={i} style={{ marginBottom: '1rem' }}>
                            <div><strong>Name:</strong> {member.name}</div>
                            <div><strong>Role:</strong> {member.role}</div>
                            <div><strong>Phone:</strong> {member.phone}</div>
                            <div><strong>Email:</strong> {member.email}</div>
                            <div><strong>Title:</strong> {member.title}</div>
                            <div><strong>Note:</strong> {member.note}</div>
                            <div><strong>Status:</strong> {member.status}</div>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              )}

              {canEditDelete && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.5rem' }}>
                  <button onClick={() => handleDelete(chapter.id)} style={{ backgroundColor: '#e01b24', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                  {!isEditing ? (
                    <button onClick={() => handleEdit(chapter)} style={{ backgroundColor: '#0060af', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer' }}>Edit</button>
                  ) : (
                    <>
                      <button onClick={() => handleUpdate(chapter.id)} style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer' }}>Save</button>
                      <button onClick={() => setEditingId(null)} style={{ padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ViewChapters;
