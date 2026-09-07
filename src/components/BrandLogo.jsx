import React from 'react';

export default function BrandLogo({ size = 34, showText = true, variant = 'light' }) {
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
      cursor: 'pointer',
      userSelect: 'none',
      whiteSpace: 'nowrap',
      flexShrink: 0
    }}>
      {/* Geometric Quantum Nexus SVG Emblem */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: 'drop-shadow(0 3px 10px rgba(0, 102, 255, 0.3))', flexShrink: 0 }}
      >
        <defs>
          <linearGradient id="nexuraGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00D2FF" />
            <stop offset="50%" stopColor="#0066FF" />
            <stop offset="100%" stopColor="#1E3A8A" />
          </linearGradient>
          <linearGradient id="nexuraGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#1E40AF" />
          </linearGradient>
        </defs>

        {/* Outer Hexagonal Shield */}
        <polygon
          points="24,4 42,14 42,34 24,44 6,34 6,14"
          stroke="url(#nexuraGrad1)"
          strokeWidth="2.5"
          strokeLinejoin="round"
          fill="rgba(10, 25, 47, 0.9)"
        />

        {/* Inner Interlocking Nexus */}
        <path
          d="M16 20L24 14L32 20L24 26L16 20Z"
          fill="url(#nexuraGrad1)"
          opacity="0.9"
        />
        <path
          d="M16 28L24 34L32 28L24 22L16 28Z"
          fill="url(#nexuraGrad2)"
          opacity="0.85"
        />

        {/* Center Quantum Core Dot */}
        <circle cx="24" cy="24" r="3" fill="#00E5FF" />
        <circle cx="24" cy="24" r="5" stroke="#38BDF8" strokeWidth="1" strokeDasharray="2 2" />
      </svg>

      {/* Brand Text Lockup - Sleek Inline Single Row */}
      {showText && (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', lineHeight: 1 }}>
            <span style={{
              fontFamily: "'Sora', sans-serif",
              fontWeight: 800,
              fontSize: size > 32 ? '19px' : '17px',
              letterSpacing: '-0.03em',
              color: variant === 'dark' ? '#FFFFFF' : '#0F172A'
            }}>
              NEX
            </span>
            <span style={{
              fontFamily: "'Sora', sans-serif",
              fontWeight: 800,
              fontSize: size > 32 ? '19px' : '17px',
              letterSpacing: '-0.03em',
              background: 'linear-gradient(135deg, #0066FF 0%, #0284C7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              URA
            </span>
          </div>

          <span style={{
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: '9.5px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            padding: '2px 7px',
            borderRadius: '4px',
            background: 'rgba(0, 102, 255, 0.08)',
            color: '#0066FF',
            border: '1px solid rgba(0, 102, 255, 0.2)',
            lineHeight: 1.2
          }}>
            TECH
          </span>
        </div>
      )}
    </div>
  );
}
