import { useState, useEffect } from 'react';

// Category to color mapping
const CATEGORY_COLORS = {
  web_development: '#6366f1',
  cyber_security: '#ef4444',
  game_development: '#8b5cf6',
  app_development: '#06b6d4',
  mechanical_core: '#f59e0b',
  electrical_core: '#10b981',
  business_mgmt: '#ec4899',
};

// Parse provider for display
const parseProvider = (str) => {
  const parenMatch = str.match(/^(.+?)\s*\(/);
  if (parenMatch) {
    return {
      company: parenMatch[1].trim(),
      role: str.replace(parenMatch[0], '').replace(')', '').trim() || 'Internship'
    };
  }
  return {
    company: str.split(' ')[0],
    role: str.split(' ').slice(1).join(' ') || 'Internship'
  };
};

// Individual Card Component
function InternshipCard({ internship }) {
  const { company, role } = parseProvider(internship.provider);
  const color = CATEGORY_COLORS[internship.category] || '#6366f1';

  const handleClick = () => {
    if (internship.link) {
      window.open(internship.link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      onClick={handleClick}
      style={{
        background: 'rgba(15, 15, 26, 0.9)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        border: `1px solid ${color}40`,
        padding: '20px',
        cursor: internship.link ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        minHeight: '180px',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = `0 8px 25px ${color}30`;
        e.currentTarget.style.borderColor = color;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = `${color}40`;
      }}
    >
      {/* Header with company and category indicator */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
        <div style={{ flex: 1 }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#f3f4f6',
            margin: 0,
            lineHeight: '1.4',
            wordBreak: 'break-word',
          }}>
            {company}
          </h3>
        </div>
        {/* Category indicator dot */}
        <div style={{
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          background: color,
          flexShrink: 0,
          marginTop: '4px',
        }} />
      </div>

      {/* Role */}
      <p style={{
        fontSize: '14px',
        color: 'rgba(255,255,255,0.6)',
        margin: 0,
        lineHeight: '1.5',
        flex: 1,
      }}>
        {role}
      </p>

      {/* Footer with category and additional info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <span style={{
          fontSize: '11px',
          padding: '4px 10px',
          background: `${color}20`,
          color: color,
          borderRadius: '20px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          fontWeight: '500',
        }}>
          {internship.category.replace('_', ' ')}
        </span>
        {/* Show duration if available, otherwise show type */}
        {internship.duration ? (
          <span style={{
            fontSize: '12px',
            color: 'rgba(255,255,255,0.5)',
          }}>
            {internship.duration}
          </span>
        ) : internship.type ? (
          <span style={{
            fontSize: '12px',
            color: 'rgba(255,255,255,0.4)',
            fontStyle: 'italic',
          }}>
            {internship.type}
          </span>
        ) : internship.deadline ? (
          <span style={{
            fontSize: '12px',
            color: '#f59e0b',
            fontWeight: '500',
          }}>
            Deadline: {internship.deadline}
          </span>
        ) : null}
      </div>
    </div>
  );
}

// Main export component
export default function ThreeInternshipGrid({ internships }) {
  const [isSupported, setIsSupported] = useState(true);

  // Check for basic browser support
  useEffect(() => {
    try {
      setIsSupported(typeof document !== 'undefined');
    } catch (e) {
      setIsSupported(false);
    }
  }, []);

  if (!isSupported || internships.length === 0) {
    return (
      <div style={{
        padding: '40px',
        textAlign: 'center',
        color: 'rgba(255,255,255,0.5)',
        borderRadius: '20px',
        background: 'rgba(15, 15, 26, 0.5)',
      }}>
        {internships.length === 0
          ? 'No internships found'
          : 'Browser not supported'}
      </div>
    );
  }

  return (
    <div style={{
      width: '100%',
      maxWidth: '900px',
      margin: '0 auto',
      position: 'relative',
      borderRadius: '20px',
      overflow: 'hidden',
      background: 'rgba(15, 15, 26, 0.5)',
      padding: '24px',
    }}>
      {/* Card Container with grid layout and scrollbar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px',
        maxHeight: '500px',
        overflowY: 'auto',
        paddingRight: '12px',
        scrollbarWidth: 'thin',
        scrollbarColor: '#6366f1 rgba(15, 15, 26, 0.5)',
      }}>
        {internships.map((internship) => (
          <InternshipCard
            key={internship.id}
            internship={internship}
          />
        ))}
      </div>

      {/* Count display */}
      <div style={{
        textAlign: 'center',
        marginTop: '24px',
        padding: '12px',
        color: 'rgba(255,255,255,0.4)',
        fontSize: '14px',
      }}>
        Showing {internships.length} internship{internships.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}