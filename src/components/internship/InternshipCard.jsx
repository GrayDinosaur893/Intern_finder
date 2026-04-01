import { useState, useRef, useEffect, useCallback, memo } from 'react';
import CardBackgroundEffect from './CardBackgroundEffect';
import { checkInternshipMatch } from '../../utils/skillMatcher';

const InternshipCard = memo(function InternshipCard({ internship, category, isBookmarked, onBookmarkToggle, user }) {
  const [isHovered, setIsHovered] = useState(false);
  const [tiltStyle, setTiltStyle] = useState({});
  const [lightPosition, setLightPosition] = useState({ x: 50, y: 50 });
  const cardRef = useRef(null);
  const rafRef = useRef(null);
  const mousePosRef = useRef({ x: 0, y: 0 });

  const { id, provider, link, duration, type, deadline } = internship;

  // Parse provider to extract company name and role
  const parseProvider = useCallback((providerStr) => {
    const parenMatch = providerStr.match(/^(.+?)\s*\(/);
    if (parenMatch) {
      return {
        company: parenMatch[1].trim(),
        role: providerStr.replace(parenMatch[0], '').replace(')', '').trim() || 'Internship'
      };
    }
    return {
      company: providerStr.split(' ')[0],
      role: providerStr.split(' ').slice(1).join(' ') || 'Internship'
    };
  }, []);

  const { company, role } = parseProvider(provider);

  // Extract tags from type field
  const extractTags = useCallback((typeStr) => {
    if (!typeStr) return [];
    return typeStr.split('/').map(tag => tag.trim()).filter(tag => tag.length > 0);
  }, []);

  const tags = extractTags(type);

  // Determine location type
  const getLocationType = useCallback(() => {
    if (!type) return null;
    const typeLower = type.toLowerCase();
    if (typeLower.includes('remote')) return { type: 'Remote', color: 'green' };
    if (typeLower.includes('onsite') || typeLower.includes('pune') || typeLower.includes('mumbai') || typeLower.includes('delhi')) 
      return { type: 'Onsite', color: 'blue' };
    return null;
  }, [type]);

  const locationInfo = getLocationType();

  // Check if paid
  const isPaid = type && type.toLowerCase().includes('paid');

  // Optimized 3D Tilt effect using requestAnimationFrame
  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    
    mousePosRef.current = { x: e.clientX, y: e.clientY };
    
    if (rafRef.current) return;
    
    rafRef.current = requestAnimationFrame(() => {
      const rect = cardRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const mouseX = mousePosRef.current.x - centerX;
      const mouseY = mousePosRef.current.y - centerY;
      
      // Calculate rotation with limits (±10 degrees max)
      const rotateX = Math.max(-10, Math.min(10, (mouseY / rect.height) * -20));
      const rotateY = Math.max(-10, Math.min(10, (mouseX / rect.width) * 20));
      
      // Calculate light position as percentage for gradient
      const lightX = ((e.clientX - rect.left) / rect.width) * 100;
      const lightY = ((e.clientY - rect.top) / rect.height) * 100;
      
      setLightPosition({ x: lightX, y: lightY });
      
      setTiltStyle({
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
      });
      
      rafRef.current = null;
    });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  // Smooth reset on mouse leave with spring-like animation
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    
    // Smooth spring-back animation
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
    });
    
    // Clear transition after animation completes
    setTimeout(() => {
      setTiltStyle(prev => ({ ...prev, transition: 'none' }));
    }, 500);
  }, []);

  // Category to emoji mapping
  const getCategoryEmoji = useCallback((cat) => {
    const emojis = {
      web_development: '🌐',
      cyber_security: '🔒',
      game_development: '🎮',
      app_development: '📱',
      mechanical_core: '⚙️',
      electrical_core: '⚡',
      business_mgmt: '💼'
    };
    return emojis[cat] || '💼';
  }, []);

  // Check skill match with user profile
  const matchResult = useCallback(() => {
    if (!user) return null;
    const userSkills = user['Skills and Expertise'] || '';
    const preferredDomains = user['Preferred Domain(s) for Internship'] || '';
    return checkInternshipMatch(category, userSkills, preferredDomains);
  }, [category, user]);

  const result = matchResult();

  // Determine if card has a match for border styling
  const getMatchClassName = () => {
    if (!result || !result.isMatch) return '';
    return result.priority === 'preferred' ? 'matched-preferred' : 'matched-skill';
  };

  // Button click handler with press effect
  const handleButtonClick = useCallback((e) => {
    const button = e.currentTarget;
    button.style.transform = 'translateZ(5px) scale(0.95)';
    setTimeout(() => {
      button.style.transform = '';
    }, 150);
  }, []);

  return (
    <div
      ref={cardRef}
      className={`internship-card-3d ${isHovered ? 'hovered' : ''} ${isBookmarked ? 'bookmarked' : ''} ${getMatchClassName()}`}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={tiltStyle}
    >
      {/* Dynamic lighting overlay */}
      <div 
        className="card-light-overlay"
        style={{
          background: `radial-gradient(circle at ${lightPosition.x}% ${lightPosition.y}%, rgba(255,255,255,0.12), transparent 60%)`
        }}
      />
      
      {/* Physics background effect (translateZ -30px for parallax) */}
      <div className="card-bg-layer">
        <CardBackgroundEffect isHovered={isHovered} />
      </div>
      
      {/* Glow border effect */}
      <div className="card-glow-border" />
      
      {/* Card Content with depth layers */}
      <div className="card-content-3d">
        {/* Background layer (z: -20px) */}
        <div className="card-bg-layer-content" />
        
        {/* Main content layer (z: 0) */}
        <div className="card-main-content">
          {/* Header: Category badge + Bookmark */}
          <div className="card-header">
            <div className="card-header-left">
              <span className="category-badge">
                {getCategoryEmoji(category)} {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
              {result && result.isMatch && (
                <span className={`preference-badge ${result.priority === 'preferred' ? 'preferred' : 'skill-match'}`}
                    title={`Matches your ${result.priority === 'preferred' ? 'preferred domain' : 'skills'}: ${result.matchedSkills.join(', ')}`}>
                  {result.priority === 'preferred' ? (
                    <>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                      Preferred
                    </>
                  ) : (
                    <>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                      Skill Match
                    </>
                  )}
                </span>
              )}
            </div>
            <button
              className={`bookmark-btn ${isBookmarked ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                onBookmarkToggle(id);
              }}
              aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark internship'}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill={isBookmarked ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            </button>
          </div>

          {/* Company & Role */}
          <div className="card-title-section">
            <h3 className="card-company">{company}</h3>
            <p className="card-role">{role}</p>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="card-tags">
              {tags.map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Details Grid */}
          <div className="card-details">
            {duration && (
              <div className="detail-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span>{duration}</span>
              </div>
            )}
            {locationInfo && (
              <div className="detail-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span className={`location-${locationInfo.color}`}>{locationInfo.type}</span>
              </div>
            )}
            {deadline && (
              <div className="detail-item deadline">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span>{deadline}</span>
              </div>
            )}
            {isPaid && (
              <div className="detail-item paid">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
                <span>Paid</span>
              </div>
            )}
          </div>
        </div>

        {/* Apply Button layer (z: +25px) */}
        <div className="card-button-layer">
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="apply-btn-3d"
            onClick={handleButtonClick}
          >
            <span>Apply Now</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
});

export default InternshipCard;