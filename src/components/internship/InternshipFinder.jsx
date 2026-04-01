import { useState, useEffect, useMemo } from 'react';
import SearchBar from './SearchBar';
import ThreeInternshipGrid from './ThreeInternshipGrid';
import internData from '../../data/intern-data.json';
import './InternshipFinder.css';

function InternshipFinder({ user, onLogout, onGoToAdmin }) {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'saved', 'profile'
  const [filters, setFilters] = useState({
    location: 'all',
    duration: 'all',
    type: 'all',
  });
  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem('internshipBookmarks');
    return saved ? JSON.parse(saved) : [];
  });
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);

  // Extract categories from data
  const categories = useMemo(() => {
    return Object.keys(internData.ug_internships_2026);
  }, []);

  // Flatten all internships with their category
  const allInternships = useMemo(() => {
    const internships = [];
    Object.entries(internData.ug_internships_2026).forEach(([category, items]) => {
      items.forEach((item) => {
        internships.push({
          ...item,
          category,
        });
      });
    });
    return internships;
  }, []);

  // Filter and search internships
  const filteredInternships = useMemo(() => {
    let result = allInternships;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((internship) => {
        const providerLower = internship.provider?.toLowerCase() || '';
        const typeLower = internship.type?.toLowerCase() || '';
        const idLower = internship.id?.toLowerCase() || '';
        return (
          providerLower.includes(query) ||
          typeLower.includes(query) ||
          idLower.includes(query)
        );
      });
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter((internship) => internship.category === selectedCategory);
    }

    // Location/Type filter
    if (filters.location !== 'all') {
      result = result.filter((internship) => {
        const typeLower = internship.type?.toLowerCase() || '';
        switch (filters.location) {
          case 'remote':
            return typeLower.includes('remote');
          case 'onsite':
            return typeLower.includes('onsite') || typeLower.includes('pune') || typeLower.includes('mumbai') || typeLower.includes('delhi');
          case 'mnc':
            return typeLower.includes('mnc') || typeLower.includes('global');
          case 'govt':
            return typeLower.includes('govt') || typeLower.includes('government');
          default:
            return true;
        }
      });
    }

    // Duration filter
    if (filters.duration !== 'all') {
      result = result.filter((internship) => {
        const duration = internship.duration?.toLowerCase() || '';
        switch (filters.duration) {
          case '1':
            return duration.includes('1') || duration.includes('one') || duration.includes('month');
          case '3':
            return duration.includes('3') || duration.includes('12 weeks');
          case '6':
            return duration.includes('6') || duration.includes('six');
          default:
            return true;
        }
      });
    }

    // Stipend/Paid filter
    if (filters.type !== 'all') {
      result = result.filter((internship) => {
        const typeLower = internship.type?.toLowerCase() || '';
        switch (filters.type) {
          case 'paid':
            return typeLower.includes('paid');
          case 'corporate':
            return typeLower.includes('corporate');
          default:
            return true;
        }
      });
    }

    return result;
  }, [allInternships, searchQuery, selectedCategory, filters]);

  // Paginated internships
  const visibleInternships = filteredInternships.slice(0, visibleCount);

  // Save bookmarks to localStorage
  useEffect(() => {
    localStorage.setItem('internshipBookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Handle card click (open link)
  const handleCardClick = (link) => {
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  };

  // Handle bookmark toggle
  const handleBookmarkToggle = (id) => {
    setBookmarks((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  };

  // Handle filter change
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setVisibleCount(12); // Reset pagination on filter change
  };

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    setVisibleCount(12);
  };

  // Load more
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 8);
  };

  // Get user initials for avatar
  const initials = user?.['Full Name']
    ?.split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Get saved internships data
  const savedInternships = useMemo(() => {
    return allInternships.filter((internship) => bookmarks.includes(internship.id));
  }, [allInternships, bookmarks]);

  // Remove from bookmarks
  const removeBookmark = (id) => {
    setBookmarks((prev) => prev.filter((b) => b !== id));
  };

  // Tab content styles
  const tabStyles = {
    container: {
      display: 'flex',
      gap: '8px',
      marginBottom: '20px',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      paddingBottom: '12px',
    },
    tab: {
      padding: '10px 20px',
      background: 'transparent',
      border: 'none',
      color: 'rgba(255,255,255,0.5)',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      borderRadius: '8px',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    activeTab: {
      background: 'rgba(99, 102, 241, 0.2)',
      color: '#6366f1',
    },
  };

  // Modal overlay styles
  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  };

  const modalContentStyle = {
    background: 'rgba(15, 15, 26, 0.95)',
    borderRadius: '20px',
    padding: '32px',
    maxWidth: '800px',
    width: '100%',
    maxHeight: '80vh',
    overflowY: 'auto',
    border: '1px solid rgba(99, 102, 241, 0.3)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
  };

  const savedCardStyle = {
    background: 'rgba(30, 30, 50, 0.8)',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '12px',
    border: '1px solid rgba(99, 102, 241, 0.2)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
  };

  return (
    <div className="internship-finder-page">
      {/* Background blobs for depth */}
      <div className="bg-blob blob-1" />
      <div className="bg-blob blob-2" />
      <div className="bg-blob blob-3" />

      {/* Saved Internships Modal */}
      {showSavedModal && (
        <div style={modalOverlayStyle} onClick={() => setShowSavedModal(false)}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: 0, color: '#f3f4f6', fontSize: '24px' }}>
                <span style={{ marginRight: '12px' }}>📚</span>
                Saved Internships
              </h2>
              <button
                onClick={() => setShowSavedModal(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(255,255,255,0.5)',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.1)';
                  e.target.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = 'rgba(255,255,255,0.5)';
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {savedInternships.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.4)' }}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '16px', color: 'rgba(99, 102, 241, 0.5)' }}>
                  <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
                <p style={{ fontSize: '16px' }}>No saved internships yet</p>
                <p style={{ fontSize: '14px', marginTop: '8px' }}>Click the bookmark icon on any internship to save it here</p>
              </div>
            ) : (
              <div>
                <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '16px', fontSize: '14px' }}>
                  {savedInternships.length} internship{savedInternships.length !== 1 ? 's' : ''} saved
                </p>
                {savedInternships.map((internship) => (
                  <div key={internship.id} style={savedCardStyle}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 4px', color: '#f3f4f6', fontSize: '15px' }}>
                        {internship.provider}
                      </h4>
                      <p style={{ margin: 0, color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>
                        {internship.category.replace('_', ' ')}
                        {internship.duration && ` • ${internship.duration}`}
                        {internship.type && ` • ${internship.type}`}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {internship.link && (
                        <a
                          href={internship.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            padding: '8px 16px',
                            background: 'rgba(99, 102, 241, 0.2)',
                            color: '#6366f1',
                            borderRadius: '8px',
                            textDecoration: 'none',
                            fontSize: '13px',
                            fontWeight: '500',
                            transition: 'all 0.2s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = 'rgba(99, 102, 241, 0.3)';
                          }}
                        >
                          Apply
                        </a>
                      )}
                      <button
                        onClick={() => removeBookmark(internship.id)}
                        style={{
                          padding: '8px 16px',
                          background: 'rgba(239, 68, 68, 0.1)',
                          color: '#ef4444',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: '500',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'rgba(239, 68, 68, 0.2)';
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfileModal && (
        <div style={modalOverlayStyle} onClick={() => setShowProfileModal(false)}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            {/* Header with Back Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <button
                onClick={() => setShowProfileModal(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  background: 'rgba(99, 102, 241, 0.1)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  borderRadius: '12px',
                  color: '#6366f1',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(99, 102, 241, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(99, 102, 241, 0.1)';
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m12 19-7-7 7-7" />
                  <path d="M19 12H5" />
                </svg>
                <span>Back</span>
              </button>
              <h2 style={{ margin: 0, color: '#f3f4f6', fontSize: '24px' }}>
                <span style={{ marginRight: '12px' }}>👤</span>
                Profile
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Profile Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '24px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '16px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  fontWeight: '700',
                  color: 'white',
                }}>
                  {initials || 'U'}
                </div>
                <div>
                  <h3 style={{ margin: '0 0 4px', color: '#f3f4f6', fontSize: '20px' }}>
                    {user?.['Full Name'] || 'User'}
                  </h3>
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
                    {user?.['Email Address'] || 'user@example.com'}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                <div style={{ padding: '20px', background: 'rgba(30, 30, 50, 0.8)', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                  <div style={{ fontSize: '28px', fontWeight: '700', color: '#6366f1' }}>{savedInternships.length}</div>
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>Saved</div>
                </div>
                <div style={{ padding: '20px', background: 'rgba(30, 30, 50, 0.8)', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                  <div style={{ fontSize: '28px', fontWeight: '700', color: '#10b981' }}>{allInternships.length}</div>
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>Total Internships</div>
                </div>
                <div style={{ padding: '20px', background: 'rgba(30, 30, 50, 0.8)', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                  <div style={{ fontSize: '28px', fontWeight: '700', color: '#f59e0b' }}>{categories.length}</div>
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>Categories</div>
                </div>
              </div>

              {/* Candidate Opportunities */}
              <div style={{ padding: '20px', background: 'rgba(30, 30, 50, 0.8)', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                <h4 style={{ margin: '0 0 16px', color: '#f3f4f6', fontSize: '16px' }}>
                  <span style={{ marginRight: '8px' }}>🎯</span>
                  Your Opportunities
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ padding: '12px', background: 'rgba(15, 15, 26, 0.5)', borderRadius: '8px', borderLeft: '4px solid #6366f1' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h5 style={{ margin: '0 0 4px', color: '#f3f4f6', fontSize: '14px' }}>Web Development</h5>
                        <p style={{ margin: 0, color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>10 internships available</p>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <span style={{ background: '#6366f1', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '11px' }}>High Demand</span>
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ padding: '12px', background: 'rgba(15, 15, 26, 0.5)', borderRadius: '8px', borderLeft: '4px solid #ef4444' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h5 style={{ margin: '0 0 4px', color: '#f3f4f6', fontSize: '14px' }}>Cyber Security</h5>
                        <p style={{ margin: 0, color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>10 internships available</p>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <span style={{ background: '#ef4444', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '11px' }}>Growing Field</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: '12px', background: 'rgba(15, 15, 26, 0.5)', borderRadius: '8px', borderLeft: '4px solid #8b5cf6' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h5 style={{ margin: '0 0 4px', color: '#f3f4f6', fontSize: '14px' }}>Game Development</h5>
                        <p style={{ margin: 0, color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>10 internships available</p>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <span style={{ background: '#8b5cf6', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '11px' }}>Creative</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: '12px', background: 'rgba(15, 15, 26, 0.5)', borderRadius: '8px', borderLeft: '4px solid #10b981' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h5 style={{ margin: '0 0 4px', color: '#f3f4f6', fontSize: '14px' }}>App Development</h5>
                        <p style={{ margin: 0, color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>10 internships available</p>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <span style={{ background: '#10b981', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '11px' }}>Mobile Focus</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: '12px', background: 'rgba(15, 15, 26, 0.5)', borderRadius: '8px', borderLeft: '4px solid #f59e0b' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h5 style={{ margin: '0 0 4px', color: '#f3f4f6', fontSize: '14px' }}>Business & Management</h5>
                        <p style={{ margin: 0, color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>10 internships available</p>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <span style={{ background: '#f59e0b', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '11px' }}>Leadership</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div style={{ padding: '20px', background: 'rgba(30, 30, 50, 0.8)', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                <h4 style={{ margin: '0 0 16px', color: '#f3f4f6', fontSize: '16px' }}>
                  <span style={{ marginRight: '8px' }}>⚡</span>
                  Quick Actions
                </h4>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => {
                      setShowProfileModal(false);
                      setShowSavedModal(true);
                    }}
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      background: 'rgba(99, 102, 241, 0.2)',
                      color: '#6366f1',
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '600',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(99, 102, 241, 0.3)';
                    }}
                  >
                    View Saved Internships
                  </button>
                  <button
                    onClick={onLogout}
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      background: 'rgba(239, 68, 68, 0.1)',
                      color: '#ef4444',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '600',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(239, 68, 68, 0.2)';
                    }}
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <SearchBar
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        filters={filters}
        categories={['all', ...categories]}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* Results Count */}
      <div className="results-info">
        <span className="results-count">
          {loading ? (
            'Loading internships...'
          ) : (
            <><strong>{filteredInternships.length}</strong> internships found{searchQuery && ` for "${searchQuery}"`}</>
          )}
        </span>
        {bookmarks.length > 0 && (
          <span className="bookmark-info">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
            {bookmarks.length} saved
          </span>
        )}
      </div>

      {/* Internship Grid */}
      <div className="internship-grid-container">
        {loading ? (
          <div className="loading-3d-grid">
            <div className="loading-spinner-3d">
              <div className="spinner-ring"></div>
              <p>Loading internships...</p>
            </div>
          </div>
        ) : filteredInternships.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
                <path d="M8 8l6 6" />
                <path d="M14 8l-6 6" />
              </svg>
            </div>
            <h2>No internships found</h2>
            <p>Try adjusting your search or filters to find what you're looking for.</p>
            <button className="clear-all-btn" onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setFilters({ location: 'all', duration: 'all', type: 'all' });
            }}>
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            {/* Three.js Internship Grid */}
            <ThreeInternshipGrid 
              internships={visibleInternships}
              user={user}
            />

            {/* Load More Button */}
            {visibleCount < filteredInternships.length && (
              <div className="load-more-container">
                <button className="load-more-btn" onClick={handleLoadMore}>
                  <span>Load More</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14" />
                    <path d="m19 12-7 7-7-7" />
                  </svg>
                  <span className="load-more-count">
                    ({Math.min(8, filteredInternships.length - visibleCount)} more)
                  </span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default InternshipFinder;