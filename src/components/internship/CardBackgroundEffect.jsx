import { memo } from 'react';

// Physics-based animated background effect for 3D cards
const CardBackgroundEffect = memo(function CardBackgroundEffect({ isHovered }) {
  return (
    <div className="card-physics-bg" aria-hidden="true">
      {/* Electric pulse lines */}
      <svg className="physics-lines" viewBox="0 0 200 300">
        <defs>
          <linearGradient id="pulseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(170, 59, 255, 0.3)" />
            <stop offset="50%" stopColor="rgba(124, 58, 237, 0.1)" />
            <stop offset="100%" stopColor="rgba(170, 59, 255, 0.3)" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* Animated electric arcs */}
        <path
          className="electric-arc arc-1"
          d="M 20 150 Q 50 100, 80 150 Q 110 200, 140 150 Q 170 100, 180 150"
          fill="none"
          stroke="url(#pulseGradient)"
          strokeWidth="1"
          filter="url(#glow)"
        />
        <path
          className="electric-arc arc-2"
          d="M 10 100 Q 60 80, 100 120 Q 140 160, 190 130"
          fill="none"
          stroke="rgba(170, 59, 255, 0.15)"
          strokeWidth="0.5"
        />
        <path
          className="electric-arc arc-3"
          d="M 30 200 Q 70 180, 100 210 Q 130 240, 170 220"
          fill="none"
          stroke="rgba(124, 58, 237, 0.2)"
          strokeWidth="0.8"
        />
        
        {/* Floating particles */}
        <circle className="particle p1" cx="40" cy="60" r="1.5" fill="rgba(170, 59, 255, 0.4)" />
        <circle className="particle p2" cx="160" cy="80" r="1" fill="rgba(124, 58, 237, 0.3)" />
        <circle className="particle p3" cx="100" cy="250" r="1.2" fill="rgba(170, 59, 255, 0.35)" />
        <circle className="particle p4" cx="30" cy="180" r="0.8" fill="rgba(124, 58, 237, 0.25)" />
        <circle className="particle p5" cx="170" cy="220" r="1" fill="rgba(170, 59, 255, 0.3)" />
      </svg>
      
      {/* Magnetic field lines */}
      <div className={`magnetic-field ${isHovered ? 'active' : ''}`} />
      
      {/* Energy core */}
      <div className={`energy-core ${isHovered ? 'pulsing' : ''}`} />
    </div>
  );
});

export default CardBackgroundEffect;