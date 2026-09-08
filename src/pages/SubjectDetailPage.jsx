import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, Play, BookOpen, Clock, Award, Users, CheckCircle2,
  ChevronDown, ChevronUp, Sparkles, Terminal, FileCode, Shield
} from 'lucide-react';
import { api } from '../api';

export default function SubjectDetailPage({
  subject,
  onBack,
  onStartLearning,
  user,
  onOpenStudentAuth
}) {
  const [curriculumData, setCurriculumData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedModule, setExpandedModule] = useState(null);

  useEffect(() => {
    if (subject) {
      setLoading(true);
      api.getCurriculum(subject.slug)
        .then(data => {
          setCurriculumData(data);
          if (data.length > 0) setExpandedModule(data[0].id);
        })
        .catch(err => console.error('Error fetching subject curriculum', err))
        .finally(() => setLoading(false));
    }
  }, [subject]);

  if (!subject) {
    return (
      <div style={{ padding: '60px', textAlign: 'center' }}>
        <p>No subject selected.</p>
        <button className="btn-secondary" onClick={onBack}>Back to Courses</button>
      </div>
    );
  }

  const handleStart = () => {
    if (user) {
      onStartLearning(subject);
    } else {
      // Prompt user to register or login with PIN
      onOpenStudentAuth(false, () => {
        onStartLearning(subject);
      });
    }
  };

  return (
    <div style={{ maxWidth: '1140px', margin: '0 auto', padding: '36px 24px 80px', position: 'relative' }}>
      {/* Decorative Ambient Background Blobs */}
      <div className="curvy-floating-orb orb-blue" style={{ top: '40px', left: '-60px', width: '360px', height: '360px' }} />
      <div className="curvy-floating-orb orb-cyan" style={{ top: '220px', right: '-50px', width: '320px', height: '320px' }} />

      {/* Back Button */}
      <button
        className="btn-secondary"
        onClick={onBack}
        style={{
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '13px',
          borderRadius: 'var(--radius-full)',
          padding: '8px 18px',
          background: '#FFFFFF',
          border: '1.5px solid var(--border-medium)',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <ArrowLeft size={14} /> Back to Courses Catalog
      </button>

      {/* CURVY & DOTTED HERO HEADER CARD (Light Layered Theme) */}
      <div className="catalog-hero-banner" style={{
        background: 'linear-gradient(135deg, #FDF5FD 0%, #FDF5FD 50%, #FFFFFF 100%)',
        border: '1.5px solid rgba(123, 28, 110, 0.16)',
        padding: '44px 38px',
        borderRadius: '32px',
        marginBottom: '32px',
        position: 'relative',
        boxShadow: '0 16px 40px rgba(0, 60, 160, 0.08)'
      }}>
        <div className="watermark-tech-grid" />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '14px',
            flexWrap: 'wrap'
          }}>
            <span style={{
              display: 'inline-block',
              padding: '4px 14px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(123, 28, 110, 0.08)',
              border: '1px solid rgba(123, 28, 110, 0.2)',
              color: '#7B1C6E',
              fontSize: '11px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.06em'
            }}>
              {subject.level}
            </span>
            <span style={{ fontSize: '13px', color: '#CBD5E1' }}>&bull;</span>
            <span style={{ fontSize: '13px', color: '#475569', fontWeight: 600 }}>
              ⏱ {subject.duration || '8 Weeks Track'}
            </span>
            <span style={{ fontSize: '13px', color: '#CBD5E1' }}>&bull;</span>
            <span style={{ fontSize: '13px', color: '#7B1C6E', fontWeight: 700 }}>
              ⚡ 100% Automated Output Evaluation
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 800, marginBottom: '14px', color: '#0A192F', lineHeight: 1.2 }}>
            {subject.name}
          </h1>

          <p style={{ fontSize: '15.5px', color: '#334155', lineHeight: 1.75, maxWidth: '850px', marginBottom: '28px' }}>
            {subject.description}
          </p>

          {/* Action Button Strip */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px',
            paddingTop: '24px',
            borderTop: '1px solid #E2E8F0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', fontSize: '13.5px', color: '#475569', flexWrap: 'wrap' }}>
              <div>
                <span style={{ color: '#64748B', fontSize: '11px', textTransform: 'uppercase', display: 'block', fontWeight: 700 }}>Domain Faculty</span>
                <strong style={{ color: '#0F172A' }}>{subject.instructor_name || 'Prof. Deepan & Faculty Staff'}</strong>
              </div>
              <div style={{ width: '1px', height: '24px', background: '#CBD5E1' }} />
              <div>
                <span style={{ color: '#64748B', fontSize: '11px', textTransform: 'uppercase', display: 'block', fontWeight: 700 }}>Curriculum Scope</span>
                <strong style={{ color: '#0F172A' }}>{curriculumData.length || subject.total_modules || 8} Comprehensive Modules</strong>
              </div>
            </div>

            <button
              className="btn-primary"
              onClick={handleStart}
              style={{
                padding: '13px 30px',
                fontSize: '15px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                borderRadius: 'var(--radius-full)',
                background: 'linear-gradient(135deg, #7B1C6E 0%, #FDC029 100%)',
                boxShadow: '0 8px 24px rgba(123, 28, 110, 0.35)'
              }}
            >
              <Play size={16} fill="currentColor" /> Start Learning & Enter Lab
            </button>
          </div>
        </div>
      </div>

      {/* Course Highlights */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '16px',
        marginBottom: '36px'
      }}>
        <div className="pillar-mini-card">
          <div className="pillar-icon"><Sparkles size={20} color="var(--blue-vibrant)" /></div>
          <h4>Visual Architecture</h4>
          <p>Request-response diagrams and ORM models explained intuitively.</p>
        </div>

        <div className="pillar-mini-card">
          <div className="pillar-icon"><Terminal size={20} color="#16A34A" /></div>
          <h4>Automated Code Runner</h4>
          <p>Instant syntax & terminal output verification in milliseconds.</p>
        </div>

        <div className="pillar-mini-card">
          <div className="pillar-icon"><Award size={20} color="var(--blue-primary)" /></div>
          <h4>Automatic Marks</h4>
          <p>Pass criteria assertions without waiting days for manual review.</p>
        </div>
      </div>

      {/* Syllabus Modules Accordion */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '22px', color: 'var(--text-primary)' }}>Syllabus Breakdown</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px' }}>
              Preview all modules and topics taught in this course track.
            </p>
          </div>
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--blue-primary)' }}>
            {curriculumData.length} Modules Total
          </span>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            Loading course syllabus...
          </div>
        ) : curriculumData.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', background: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
            Syllabus is being prepared for this track. Click "Start Learning" to begin.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {curriculumData.map((module, mIdx) => {
              const isOpen = expandedModule === module.id;
              return (
                <div
                  key={module.id}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <div
                    onClick={() => setExpandedModule(isOpen ? null : module.id)}
                    style={{
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      background: isOpen ? 'var(--blue-gradient-subtle)' : '#FFFFFF'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: 'var(--blue-soft)',
                        color: 'var(--blue-primary)',
                        border: '1px solid var(--blue-border)'
                      }}>
                        Module {mIdx + 1}
                      </span>
                      <strong style={{ fontSize: '15.5px', color: 'var(--text-primary)' }}>
                        {module.name}
                      </strong>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                        {module.topics?.length || 0} Topics
                      </span>
                      {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>

                  {isOpen && (
                    <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border-subtle)', background: '#FAFAFA' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {(module.topics || []).map((topic, tIdx) => (
                          <div
                            key={topic.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '10px 14px',
                              background: '#FFFFFF',
                              border: '1px solid var(--border-subtle)',
                              borderRadius: 'var(--radius-md)'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <CheckCircle2 size={15} color="var(--blue-vibrant)" />
                              <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
                                {topic.title}
                              </span>
                            </div>

                            <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontFamily: 'IBM Plex Mono' }}>
                              {topic.problems?.length || 0} Labs
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Bottom CTA */}
      <div style={{
        marginTop: '50px',
        padding: '30px',
        background: 'var(--blue-gradient-subtle)',
        border: '1px solid var(--blue-border)',
        borderRadius: 'var(--radius-xl)',
        textAlign: 'center'
      }}>
        <h3 style={{ fontSize: '22px', marginBottom: '8px', color: 'var(--text-primary)' }}>
          Ready to Master {subject.name}?
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '20px' }}>
          Open the student workbench, view visual architecture diagrams, and solve practice problems with automated grading.
        </p>
        <button
          className="btn-primary"
          onClick={handleStart}
          style={{ padding: '12px 30px', fontSize: '15px' }}
        >
          <Play size={16} fill="currentColor" /> Start Learning Now
        </button>
      </div>
    </div>
  );
}
