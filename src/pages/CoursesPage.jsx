import React, { useState, useEffect } from 'react';
import { BookOpen, Search, ArrowRight, Code, Cpu, Award, Users, Filter, Sparkles, Layers, CheckCircle2, Play } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { api } from '../api';

export default function CoursesPage({ subjects, onSelectSubject, onNavigate, user, onStartLearning, onOpenStudentAuth }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('ALL');
  const [enrollments, setEnrollments] = useState([]);
  const [enrollingId, setEnrollingId] = useState(null);
  const [enrollError, setEnrollError] = useState({});

  const fetchEnrollments = async () => {
    if (user || api.getToken()) {
      try {
        const data = await api.getMyEnrollments();
        const list = Array.isArray(data) ? data : (data?.results || []);
        setEnrollments(list);
      } catch (err) {
        console.error('Error fetching enrollments in CoursesPage', err);
        setEnrollments([]);
      }
    } else {
      setEnrollments([]);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, [user]);

  const handleEnroll = async (subject, e) => {
    e.stopPropagation();
    if (!user) {
      if (onOpenStudentAuth) {
        onOpenStudentAuth(false, async () => {
          await fetchEnrollments();
        });
      }
      return;
    }
    setEnrollingId(subject.id);
    setEnrollError(prev => ({ ...prev, [subject.id]: null }));
    try {
      await api.enrollCourse(subject.id || subject.slug);
      await fetchEnrollments();
    } catch (err) {
      setEnrollError(prev => ({ ...prev, [subject.id]: err.message || 'Enrollment failed. Please retry.' }));
    } finally {
      setEnrollingId(null);
    }
  };

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

      {/* MODERN HIGH-TECH HERO BANNER */}
      <div className="catalog-hero-banner">
        {/* Subtle Ambient Mesh Orbs */}
        <div style={{
          position: 'absolute',
          top: '-60px',
          right: '-40px',
          width: '360px',
          height: '360px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.22) 0%, transparent 70%)',
          filter: 'blur(45px)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-60px',
          left: '5%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(253, 192, 41, 0.15) 0%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none'
        }} />

        <div className="watermark-tech-grid" />

        <div style={{
          position: 'relative',
          zIndex: 2,
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) auto',
          gap: '32px',
          alignItems: 'center'
        }}>
          {/* Left Column: Heading & Value Props */}
          <div style={{ maxWidth: '780px' }}>
            <div className="hero-badge">
              <Sparkles size={14} color="#FDC029" />
              <span>Interactive Engineering Curriculum</span>
              <span style={{
                background: 'linear-gradient(135deg, #7B1C6E, #FDC029)',
                color: '#FFFFFF',
                fontSize: '10.5px',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '9999px',
                marginLeft: '4px'
              }}>PRO</span>
            </div>

            <h1 style={{
              fontSize: 'clamp(28px, 3.8vw, 44px)',
              fontWeight: 850,
              color: '#FFFFFF',
              marginBottom: '14px',
              lineHeight: 1.2,
              letterSpacing: '-0.025em'
            }}>
              Master Production Engineering with{' '}
              <span style={{
                background: 'linear-gradient(135deg, #FDC029 0%, #FB7185 50%, #C084FC 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline'
              }}>
                Interactive Labs & Automated Scoring
              </span>
            </h1>

            <p style={{
              color: '#94A3B8',
              fontSize: '15px',
              lineHeight: 1.7,
              marginBottom: '24px',
              maxWidth: '720px'
            }}>
              Explore structured curriculum tracks designed for hands-on mastery. Learn essential theory, test your recall through rapid topic MCQs, and solve mandatory practical challenges verified by automated test assertions.
            </p>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
              <div className="catalog-hero-pill-feature">
                <CheckCircle2 size={15} color="#10B981" />
                <span>100% Automated Code Assertion</span>
              </div>
              <div className="catalog-hero-pill-feature">
                <CheckCircle2 size={15} color="#FDC029" />
                <span>Sequential Topic Gating</span>
              </div>
              <div className="catalog-hero-pill-feature">
                <CheckCircle2 size={15} color="#A855F7" />
                <span>Multi-Factor Proportional Scoring</span>
              </div>
              <div className="catalog-hero-pill-feature">
                <CheckCircle2 size={15} color="#38BDF8" />
                <span>Instant Multi-Language Compiler</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Metrics Panel */}
          <div className="catalog-hero-stats-panel">
            <div className="hero-stat-card">
              <div className="stat-number">{subjects.length}+</div>
              <div className="stat-label">Engineering Tracks</div>
            </div>
            <div className="hero-stat-card">
              <div className="stat-number">100%</div>
              <div className="stat-label">Sandboxed Assertion</div>
            </div>
            <div className="hero-stat-card">
              <div className="stat-number">3-Step</div>
              <div className="stat-label">Gated Mastery (Theory &bull; MCQ &bull; Lab)</div>
            </div>
          </div>
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
          <p style={{ fontSize: '13.5px', color: 'var(--text-tertiary)' }}>Try searching for "C Programming", "Pointers", or reset level filters to "ALL".</p>
        </div>
      ) : (
        <div className="subjects-cards-grid">
          {filtered.map(subject => {
            const enrollment = enrollments.find(e =>
              String(e.subject || e.subject_id) === String(subject.id) ||
              e.subject_slug === subject.slug ||
              (e.subject_name && subject.name && e.subject_name.toLowerCase() === subject.name.toLowerCase())
            );

            const isCompleted = Boolean(
              enrollment && (enrollment.status === 'COMPLETED' || (enrollment.progress_percentage || 0) >= 100)
            );
            const isEnrolled = Boolean(enrollment && !isCompleted);
            const progress = enrollment?.progress_percentage ? Math.round(enrollment.progress_percentage) : 0;

            return (
              <div
                key={subject.id}
                className="subject-card"
                onClick={() => onSelectSubject(subject)}
              >
                <div>
                  <div className="subject-card-header">
                    <div className="subject-icon-box">
                      {subject.icon === 'django' ? (
                        <span style={{ fontWeight: 900, fontSize: '13px', color: '#15803D', fontFamily: 'IBM Plex Mono' }}>&lt;dj&gt;</span>
                      ) : subject.icon === 'python' ? (
                        <span style={{ fontWeight: 900, fontSize: '14px', color: '#16A34A', fontFamily: 'IBM Plex Mono' }}>PY</span>
                      ) : subject.icon === 'c' ? (
                        <span style={{ fontWeight: 900, fontSize: '16px', color: '#2563EB', fontFamily: 'IBM Plex Mono' }}>C</span>
                      ) : subject.icon === 'cpp' ? (
                        <span style={{ fontWeight: 900, fontSize: '14px', color: '#0284C7', fontFamily: 'IBM Plex Mono' }}>C++</span>
                      ) : subject.icon === 'java' ? (
                        <span style={{ fontWeight: 900, fontSize: '13px', color: '#DC2626', fontFamily: 'IBM Plex Mono' }}>JAVA</span>
                      ) : subject.icon === 'dart' ? (
                        <span style={{ fontWeight: 900, fontSize: '13px', color: '#0284C7', fontFamily: 'IBM Plex Mono' }}>DART</span>
                      ) : subject.icon === 'javascript' || subject.icon === 'js' ? (
                        <span style={{ fontWeight: 900, fontSize: '15px', color: '#D97706', fontFamily: 'IBM Plex Mono' }}>JS</span>
                      ) : subject.icon === 'html' ? (
                        <span style={{ fontWeight: 900, fontSize: '13px', color: '#EA580C', fontFamily: 'IBM Plex Mono' }}>HTML</span>
                      ) : subject.icon === 'sql' || subject.icon === 'database' ? (
                        <span style={{ fontWeight: 900, fontSize: '14px', color: '#0284C7', fontFamily: 'IBM Plex Mono' }}>SQL</span>
                      ) : subject.icon === 'dsa' ? (
                        <span style={{ fontWeight: 900, fontSize: '14px', color: '#7C3AED', fontFamily: 'IBM Plex Mono' }}>DSA</span>
                      ) : subject.icon === 'react' ? (
                        <span style={{ fontWeight: 900, fontSize: '13px', color: '#06B6D4', fontFamily: 'IBM Plex Mono' }}>REACT</span>
                      ) : (
                        <Code size={20} color="var(--blue-primary)" />
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {isCompleted ? (
                        <span style={{
                          fontSize: '11px',
                          fontWeight: 800,
                          padding: '3px 10px',
                          borderRadius: '20px',
                          background: '#DCFCE7',
                          color: '#15803D',
                          border: '1px solid #86EFAC',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <CheckCircle2 size={12} color="#16A34A" /> Completed 🎓
                        </span>
                      ) : isEnrolled ? (
                        <span style={{
                          fontSize: '11px',
                          fontWeight: 800,
                          padding: '3px 10px',
                          borderRadius: '20px',
                          background: 'rgba(253, 192, 41, 0.2)',
                          color: '#B45309',
                          border: '1px solid rgba(253, 192, 41, 0.5)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          ⚡ {progress}% Done
                        </span>
                      ) : null}
                      <span className="subject-level-badge">{subject.level}</span>
                    </div>
                  </div>

                  <h3 className="subject-title">{subject.name}</h3>
                  <p className="subject-desc">
                    {subject.short_description || (subject.description && subject.description.trim() !== '...' ? subject.description : 'Comprehensive curriculum track with structured modules, visual architecture models, and automated engineering workbenches.')}
                  </p>
                </div>

                <div>
                  <div className="subject-meta-strip">
                    <div>
                      <span className="meta-label">Track Lead</span>
                      <span className="meta-value" title={subject.instructor_name}>{subject.instructor_name?.split('&')[0]?.trim() || subject.instructor_name || 'Prof. Deepan'}</span>
                    </div>
                    <div>
                      <span className="meta-label">Duration</span>
                      <span className="meta-value">{subject.duration || '6-8 Weeks Track'}</span>
                    </div>
                    <div>
                      <span className="meta-label">Modules</span>
                      <span className="meta-value">{subject.module_count ?? subject.modules?.length ?? 3} Chapters</span>
                    </div>
                    <div>
                      <span className="meta-label">Topics</span>
                      <span className="meta-value">{subject.topic_count ?? 3} Topics</span>
                    </div>
                  </div>

                  {isCompleted ? (
                    <button
                      className="subject-cta-btn"
                      style={{
                        background: 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)',
                        color: '#FFFFFF',
                        boxShadow: '0 4px 14px rgba(22, 163, 74, 0.3)',
                        border: 'none'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onStartLearning) {
                          onStartLearning(subject);
                        } else {
                          onSelectSubject(subject);
                        }
                      }}
                    >
                      <CheckCircle2 size={15} color="#FFFFFF" />
                      <span>Completed 🎓 • View Syllabus</span>
                    </button>
                  ) : isEnrolled ? (
                    <button
                      className="subject-cta-btn"
                      style={{
                        background: 'linear-gradient(135deg, #7B1C6E 0%, #D97706 100%)',
                        color: '#FFFFFF',
                        boxShadow: '0 4px 14px rgba(123, 28, 110, 0.3)',
                        border: 'none'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onStartLearning) {
                          onStartLearning(subject);
                        } else {
                          onSelectSubject(subject);
                        }
                      }}
                    >
                      <Play size={14} fill="currentColor" />
                      <span>View Syllabus 🚀 {progress > 0 ? `(${progress}%)` : ''}</span>
                    </button>
                  ) : user ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <button
                        className="subject-cta-btn"
                        disabled={enrollingId === subject.id}
                        style={{
                          background: 'linear-gradient(135deg, #7B1C6E 0%, #FDC029 100%)',
                          color: '#FFFFFF',
                          opacity: enrollingId === subject.id ? 0.7 : 1,
                          cursor: enrollingId === subject.id ? 'wait' : 'pointer'
                        }}
                        onClick={(e) => handleEnroll(subject, e)}
                      >
                        <span>{enrollingId === subject.id ? 'Enrolling...' : (enrollError[subject.id] ? 'Retry Enrollment' : 'Enroll Now')}</span>
                        <ArrowRight size={15} />
                      </button>
                      {enrollError[subject.id] && (
                        <span style={{ fontSize: '11px', color: '#EF4444', textAlign: 'center' }}>
                          {enrollError[subject.id]}
                        </span>
                      )}
                    </div>
                  ) : (
                    <button
                      className="subject-cta-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onOpenStudentAuth) {
                          onOpenStudentAuth(false, () => handleEnroll(subject, e));
                        } else {
                          onSelectSubject(subject);
                        }
                      }}
                    >
                      <span>Login to Enroll</span>
                      <ArrowRight size={15} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
