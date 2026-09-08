import React from 'react';

export default function BrandLogo({ size = 38, showText = true, variant = 'light' }) {
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
      {/* SkillStack PNG Logo */}
      <img
        src="/skillstack.png"
        alt="SkillStack Logo"
        style={{
          height: size,
          width: 'auto',
          objectFit: 'contain',
          borderRadius: '8px',
          filter: 'drop-shadow(0 2px 8px rgba(99, 102, 241, 0.35))',
          flexShrink: 0
        }}
        onError={(e) => {
          // Fallback if image fails to load
          e.target.style.display = 'none';
        }}
      />

      {/* Brand Text Lockup - SkillStack */}
      {showText && (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', lineHeight: 1 }}>
            <span style={{
              fontFamily: "'Sora', sans-serif",
              fontWeight: 800,
              fontSize: size > 32 ? '20px' : '18px',
              letterSpacing: '-0.03em',
              color: variant === 'dark' ? '#FFFFFF' : '#0F172A'
            }}>
              Skill
            </span>
            <span style={{
              fontFamily: "'Sora', sans-serif",
              fontWeight: 800,
              fontSize: size > 32 ? '20px' : '18px',
              letterSpacing: '-0.03em',
              background: 'linear-gradient(135deg, #6366F1 0%, #06B6D4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Stack
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
            background: 'rgba(99, 102, 241, 0.1)',
            color: '#6366F1',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            lineHeight: 1.2
          }}>
            LEARN
          </span>
        </div>
      )}
    </div>
  );
}
