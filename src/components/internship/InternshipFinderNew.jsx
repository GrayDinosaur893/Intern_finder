import React, { useState, useEffect } from 'react';
import InternshipCard from './InternshipCard';
import ThreeInternshipGrid from './ThreeInternshipGrid';
import './InternshipFinder.css';

// Import static internship data
import internshipsData from '../../data/internships.json';

function InternshipFinder({ user, onLogout }) {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [sortBy, setSortBy] = useState('title');
  const [viewMode, setViewMode] = useState('3d'); // '3d' or 'grid'

  useEffect(() => {
    // Load static data instantly
    setTimeout(() => {
      setInternships(internshipsData);
      setLoading(false);
    }, 500); // Small delay for UX feel
  }, []);

  const filteredInternships = internships.filter(internship => {
    // Defensive coding: ensure string properties exist before calling methods
    const title = (internship.title || '').toLowerCase();
    const company = (internship.company || '').toLowerCase();
    const location = (internship.location || '').toLowerCase();
    
    const matchesSearch = title.includes(searchTerm.toLowerCase()) ||
                         company.includes(searchTerm.toLowerCase()) ||
                         location.includes(searchTerm.toLowerCase());
    
    // Filter by skills if selected
    const matchesSkills = selectedSkills.length === 0 || 
                         selectedSkills.some(skill => 
                           internship.skills && internship.skills.some(s => (s || '').toLowerCase().includes(skill.toLowerCase()))
                         );
    
    return matchesSearch && matchesSkills;
  });

  const sortedInternships = [...filteredInternships].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return (a.title || '').localeCompare(b.title || '');
      case 'company':
        return (a.company || '').localeCompare(b.company || '');
      case 'location':
        return (a.location || '').localeCompare(b.location || '');
      case 'stipend':
        return (b.stipend || '').localeCompare(a.stipend || '');
      default:
        return 0;
    }
  });

  const allSkills = [...new Set(internships.flatMap(i => i.skills || []))];

  return (
    <div className="internship-finder">
      <div className="finder-header">
        <h1>🚀 Internship Finder</h1>
        <div className="header-actions">
          <button className="btn-logout" onClick={onLogout}>Logout</button>
          <div className="view-toggle">
            <button 
              className={`view-btn ${viewMode === '3d' ? 'active' : ''}`}
              onClick={() => setViewMode('3d')}
            >
              3D View
            </button>
            <button 
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              Grid View
            </button>
          </div>
        </div>
      </div>

      <div className="finder-controls">
        <div className="search-section">
          <input
            type="text"
            placeholder="Search by title, company, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-section">
          <div className="skill-filters">
            <label>Filter by Skills:</label>
            <div className="skill-chips-container">
              {allSkills.length > 0 ? (
                allSkills.map(skill => (
                  <button
                    key={skill}
                    className={`skill-chip ${selectedSkills.includes(skill) ? 'active' : ''}`}
                    onClick={() => {
                      if (selectedSkills.includes(skill)) {
                        setSelectedSkills(selectedSkills.filter(s => s !== skill));
                      } else {
                        setSelectedSkills([...selectedSkills, skill]);
                      }
                    }}
                  >
                    {skill}
                  </button>
                ))
              ) : (
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>No skills available</span>
              )}
            </div>
          </div>
          
          <div className="sort-section">
            <label>Sort by:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="title">Title</option>
              <option value="company">Company</option>
              <option value="location">Location</option>
              <option value="stipend">Stipend</option>
            </select>
          </div>
        </div>
      </div>

      {loading && (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading internships...</p>
        </div>
      )}

      {error && (
        <div className="error-state">
          <p>Failed to load internships: {error}</p>
          <button onClick={() => setLoading(false)}>Retry</button>
        </div>
      )}

      {!loading && !error && (
        <div className="results-section">
          <div className="results-header">
            <h3>Found {sortedInternships.length} internships</h3>
          </div>
          
          {viewMode === '3d' ? (
            <ThreeInternshipGrid internships={sortedInternships} />
          ) : (
            <div className="internship-grid">
              {sortedInternships.map(internship => (
                <InternshipCard key={internship.id} internship={internship} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default InternshipFinder;