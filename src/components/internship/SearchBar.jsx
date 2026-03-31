import { useState } from 'react';

function SearchBar({ onSearch, onFilterChange, filters, categories, selectedCategory, onCategoryChange }) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleLocationChange = (e) => {
    onFilterChange('location', e.target.value);
  };

  const handleDurationChange = (e) => {
    onFilterChange('duration', e.target.value);
  };

  const handleTypeChange = (e) => {
    onFilterChange('type', e.target.value);
  };

  const clearFilters = () => {
    setSearchQuery('');
    onFilterChange('location', 'all');
    onFilterChange('duration', 'all');
    onFilterChange('type', 'all');
    onCategoryChange('all');
    onSearch('');
  };

  const categoryLabels = {
    all: 'All Categories',
    web_development: 'Web Development',
    cyber_security: 'Cyber Security',
    game_development: 'Game Development',
    app_development: 'App Development',
    mechanical_core: 'Mechanical Core',
    electrical_core: 'Electrical Core',
    business_mgmt: 'Business & Management',
  };

  return (
    <div className="internship-search-container">
      <div className="search-glass-panel">
        {/* Search Input */}
        <form onSubmit={handleSearch} className="search-input-wrapper">
          <div className="search-icon">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search by company, role, or tech..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="clear-search-btn"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          )}
        </form>

        {/* Filters Row */}
        <div className="filters-row">
          {/* Category Filter */}
          <div className="filter-group">
            <label className="filter-label">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="7" height="7" x="3" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="14" rx="1" />
                <rect width="7" height="7" x="3" y="14" rx="1" />
              </svg>
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="filter-select"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {categoryLabels[cat] || cat}
                </option>
              ))}
            </select>
          </div>

          {/* Location Filter */}
          <div className="filter-group">
            <label className="filter-label">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              Type
            </label>
            <select
              value={filters.location}
              onChange={handleLocationChange}
              className="filter-select"
            >
              <option value="all">All Types</option>
              <option value="remote">Remote</option>
              <option value="onsite">Onsite</option>
              <option value="mnc">MNC</option>
              <option value="govt">Government</option>
            </select>
          </div>

          {/* Duration Filter */}
          <div className="filter-group">
            <label className="filter-label">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              Duration
            </label>
            <select
              value={filters.duration}
              onChange={handleDurationChange}
              className="filter-select"
            >
              <option value="all">Any Duration</option>
              <option value="1">1 Month</option>
              <option value="3">3 Months</option>
              <option value="6">6 Months</option>
            </select>
          </div>

          {/* Stipend/Type Filter */}
          <div className="filter-group">
            <label className="filter-label">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
              Stipend
            </label>
            <select
              value={filters.type}
              onChange={handleTypeChange}
              className="filter-select"
            >
              <option value="all">Any Stipend</option>
              <option value="paid">Paid Only</option>
              <option value="corporate">Corporate</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          <button onClick={clearFilters} className="clear-filters-btn">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;