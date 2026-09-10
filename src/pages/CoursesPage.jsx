import React, { useState } from 'react';
import { BookOpen, Search, ArrowRight, Code, Cpu, Award, Users, Filter, Sparkles, Layers, CheckCircle2 } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

export default function CoursesPage({ subjects, onSelectSubject, onNavigate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('ALL');

  const filtered = subjects.filter(sub => {
    const matchesSearch = sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sub.description && sub.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (!matchesSearch) return false;
    if (levelFilter === 'ALL') return true;
    return (sub.level || '').toUpperCase().includes(levelFilter);
  });

  return (
    <div style={{ maxWidth: '1240px', width: '100%', margin: '0 auto', padding: '36px 20px 80px', position: 'relative', overflow: 'hidden', boxSizing: 'border-box' }}>
      {/* Decorative Ambient Background Blobs */}
      <div className="curvy-floating-orb orb-blue" style={{ top: '60px', left: '0px', width: 'min(380px, 80vw)', height: 'min(380px, 80vw)' }} />
      <div className="curvy-floating-orb orb-cyan" style={{ top: '240px', right: '0px', width: 'min(340px, 75vw)', height: 'min(340px, 75vw)' }} />

      {/* CURVY & DOTTED HERO BANNER (Light Layered Canvas) */}
      <div className="catalog-hero-banner" style={{
        background: 'linear-gradient(135deg, #FDF5FD 0%, #FDF5FD 50%, #FFFFFF 100%)',
        border: '1.5px solid rgba(123, 28, 110, 0.16)',
        boxShadow: '0 16px 40px rgba(0, 60, 160, 0.08)'
      }}>
        <div className="watermark-tech-grid" />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '820px' }}>
          <div className="hero-badge" style={{ marginBottom: '16px' }}>
            <Sparkles size={14} color="#FDC029" />
            <span>Official Engineering Curriculum Catalog</span>
          </div>

          <h1 style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 800, color: '#0A192F', marginBottom: '14px', lineHeight: 1.2 }}>
            Calibrated Curriculum Tracks in{' '}
            <span className="hero-gradient-text">
              Distributed Cloud Architecture
            </span>
          </h1>

          <p style={{ color: '#334155', fontSize: '15.5px', lineHeight: 1.7, marginBottom: '24px' }}>
            Explore academic tracks curated and supervised by our {siteConfig.metrics.seniorFacultyCount} senior domain faculty chairs. Select any track to inspect the modular syllabus breakdown, visual architectural topology, and launch automated code assertion workbenches.
          </p>

          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#7B1C6E', fontWeight: 700 }}>
              <CheckCircle2 size={16} color="#7B1C6E" /> {siteConfig.metrics.seniorFacultyCount} Faculty Domain Chairs
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#7B1C6E', fontWeight: 700 }}>
              <CheckCircle2 size={16} color="#7B1C6E" /> {siteConfig.metrics.automatedPassRate} Automated Assertion Accuracy
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#7B1C6E', fontWeight: 700 }}>
              <CheckCircle2 size={16} color="#7B1C6E" /> Applied Cognitive Architecture Pedagogy
            </div>
          </div>
        </div>

        {/* Curvy Wave at Bottom of Banner */}
        <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0, lineHeight: 0, opacity: 0.35 }}>
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ width: '100%', height: '40px' }}>
            <path d="M0,20 C320,50 720,0 1100,40 C1280,55 1380,25 1440,20 L1440,60 L0,60 Z" fill="#FFFFFF"/>
          </svg>
        </div>
      </div>

      {/* CURVY SEARCH & FILTER PILL BAR */}
      <div className="catalog-search-pill-bar">
        {/* Search Input with Icon */}
        <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
          <Search size={17} style={{ position: 'absolute', left: '16px', top: '13px', color: 'var(--blue-primary)' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search curricula by keyword, framework or technology..."
            style={{
              width: '100%',
              padding: '11px 18px 11px 44px',
              background: '#F8FAFC',
              border: '1.5px solid var(--border-medium)',
              borderRadius: 'var(--radius-full)',
              color: 'var(--text-primary)',
              fontSize: '13.5px',
              fontWeight: 500,
              outline: 'none',
              transition: 'border-color 0.2s ease'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--blue-vibrant)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border-medium)'}
          />
        </div>

        {/* Curvy Level Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['ALL', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED'].map(lvl => (
            <button
              key={lvl}
              onClick={() => setLevelFilter(lvl)}
              style={{
                padding: '8px 18px',
                borderRadius: 'var(--radius-full)',
                fontSize: '12px',
                fontWeight: 700,
                border: levelFilter === lvl ? 'none' : '1px solid var(--border-medium)',
                cursor: 'pointer',
                background: levelFilter === lvl ? 'var(--blue-gradient)' : '#FFFFFF',
                color: levelFilter === lvl ? '#FFFFFF' : 'var(--text-secondary)',
                boxShadow: levelFilter === lvl ? '0 4px 12px var(--blue-glow)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* SUBJECTS CARDS GRID */}
      {filtered.length === 0 ? (
        <div style={{
          padding: '60px 24px',
          textAlign: 'center',
          background: '#FFFFFF',
          borderRadius: '28px',
          border: '1.5px dashed var(--border-medium)',
          color: 'var(--text-secondary)'
        }}>
          <p style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>No academic tracks matched your query criteria.</p>
          <p style={{ fontSize: '13.5px', color: 'var(--text-tertiary)' }}>Try searching for "Django", "Python", or reset level filters to "ALL".</p>
        </div>
      ) : (
        <div className="subjects-cards-grid">
          {filtered.map(subject => (
            <div
              key={subject.id}
              className="subject-card"
              onClick={() => onSelectSubject(subject)}
            >
              <div>
                <div className="subject-card-header">
                  <div className="subject-icon-box">
                    {subject.icon === 'django' ? (
                      <span style={{ fontWeight: 800, fontSize: '17px', color: 'var(--blue-primary)', fontFamily: 'IBM Plex Mono' }}>&lt;dj&gt;</span>
                    ) : subject.icon === 'python' ? (
                      <Code size={22} color="var(--blue-primary)" />
                    ) : (
                      <Cpu size={22} color="var(--blue-primary)" />
                    )}
                  </div>
                  <span className="subject-level-badge">{subject.level}</span>
                </div>

                <h3 className="subject-title">{subject.name}</h3>
                <p className="subject-desc">
                  {subject.short_description || (subject.description && subject.description.trim() !== '...' ? subject.description : 'Comprehensive curriculum track with structured modules, visual architecture models, and automated engineering workbenches.')}
                </p>
              </div>

              <div>
                <div className="subject-meta-strip">
                  <div>
                    <span className="meta-label">Domain Chair</span>
                    <span className="meta-value">{subject.instructor_name || 'Senior Staff Faculty'}</span>
                  </div>
                  <div>
                    <span className="meta-label">Duration</span>
                    <span className="meta-value">{subject.duration || '6-8 Weeks Track'}</span>
                  </div>
                  <div>
                    <span className="meta-label">Syllabus</span>
                    <span className="meta-value">{subject.total_modules || 8} Modules</span>
                  </div>
                </div>

                <button
                  className="subject-cta-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectSubject(subject);
                  }}
                >
                  Inspect Syllabus & Launch Workbench <ArrowRight size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
