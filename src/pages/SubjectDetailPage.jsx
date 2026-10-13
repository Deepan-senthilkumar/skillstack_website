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
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    if (user || api.getToken()) {
      api.getMyEnrollments()
        .then(data => {
          const list = Array.isArray(data) ? data : (data?.results || []);
          setEnrollments(list);
        })
        .catch(() => setEnrollments([]));
    } else {
      setEnrollments([]);
    }
  }, [user]);

  const currentEnrollment = enrollments.find(e =>
    String(e.subject || e.subject_id) === String(subject?.id) ||
    e.subject_slug === subject?.slug ||
    (e.subject_name && subject?.name && e.subject_name.toLowerCase() === subject.name.toLowerCase())
  );
  const isCompleted = Boolean(currentEnrollment && (currentEnrollment.status === 'COMPLETED' || (currentEnrollment.progress_percentage || 0) >= 100));
  const isEnrolled = Boolean(currentEnrollment && !isCompleted);
  const progress = currentEnrollment?.progress_percentage ? Math.round(currentEnrollment.progress_percentage) : 0;

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
    <div style={{ maxWidth: '1140px', width: '100%', margin: '0 auto', padding: '24px 16px 80px', position: 'relative', overflow: 'hidden', boxSizing: 'border-box' }}>
      {/* Decorative Ambient Background Blobs */}
      <div className="curvy-floating-orb orb-blue" style={{ top: '40px', left: '0px', width: 'min(280px, 70vw)', height: 'min(280px, 70vw)', opacity: 0.6 }} />
      <div className="curvy-floating-orb orb-cyan" style={{ top: '220px', right: '0px', width: 'min(260px, 65vw)', height: 'min(260px, 65vw)', opacity: 0.6 }} />

      {/* Back Button */}
      <button
        className="btn-secondary"
        onClick={onBack}
        style={{
          marginBottom: '20px',
          display: 'inline-flex',
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

      {/* MODERN HIGH-TECH SUBJECT HEADER CARD */}
      <div className="catalog-hero-banner" style={{
        padding: '42px 38px',
        borderRadius: '28px',
        marginBottom: '32px'
      }}>
        {/* Subtle Ambient Glow */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-40px',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.22) 0%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-50px',
          left: '10%',
          width: '260px',
          height: '260px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(253, 192, 41, 0.14) 0%, transparent 70%)',
          filter: 'blur(35px)',
          pointerEvents: 'none'
        }} />

        <div className="watermark-tech-grid" />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '16px',
            flexWrap: 'wrap'
          }}>
            <span style={{
              display: 'inline-block',
              padding: '5px 14px',
              borderRadius: 'var(--radius-full)',
              background: 'linear-gradient(135deg, rgba(123, 28, 110, 0.4), rgba(253, 192, 41, 0.3))',
              border: '1px solid rgba(253, 192, 41, 0.35)',
              color: '#FDC029',
              fontSize: '11.5px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.06em'
            }}>
              {subject.level}
            </span>
            <span style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.25)' }}>&bull;</span>
            <span style={{ fontSize: '13px', color: '#CBD5E1', fontWeight: 600 }}>
              ⏱ {subject.duration || '8 Weeks Track'}
            </span>
            <span style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.25)' }}>&bull;</span>
            <span style={{ fontSize: '13px', color: '#38BDF8', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              ⚡ 100% Automated Output Assertion
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(28px, 3.6vw, 42px)', fontWeight: 850, marginBottom: '14px', color: '#FFFFFF', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
            {subject.name}
          </h1>

          <p style={{ fontSize: '15.5px', color: '#94A3B8', lineHeight: 1.75, maxWidth: '850px', marginBottom: '28px' }}>
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
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', fontSize: '13.5px', color: '#94A3B8', flexWrap: 'wrap' }}>
              <div>
                <span style={{ color: '#64748B', fontSize: '11px', textTransform: 'uppercase', display: 'block', fontWeight: 700, letterSpacing: '0.04em' }}>Track Lead</span>
                <strong style={{ color: '#F8FAFC' }}>{subject.instructor_name || 'Deepan S (Lead)'}</strong>
              </div>
              <div style={{ width: '1px', height: '24px', background: 'rgba(255, 255, 255, 0.15)' }} />
              <div>
                <span style={{ color: '#64748B', fontSize: '11px', textTransform: 'uppercase', display: 'block', fontWeight: 700, letterSpacing: '0.04em' }}>Curriculum Scope</span>
                <strong style={{ color: '#F8FAFC' }}>{curriculumData.length || subject.total_modules || 8} Gated Modules</strong>
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
                background: isCompleted
                  ? 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)'
                  : 'linear-gradient(135deg, #7B1C6E 0%, #FDC029 100%)',
                boxShadow: isCompleted
                  ? '0 8px 24px rgba(22, 163, 74, 0.35)'
                  : '0 8px 24px rgba(123, 28, 110, 0.35)'
              }}
            >
              {isCompleted ? (
                <>
                  <CheckCircle2 size={18} color="#FFFFFF" /> Completed 🎓 &bull; Enter Workbench
                </>
              ) : isEnrolled ? (
                <>
                  <Play size={16} fill="currentColor" /> Resume Learning 🚀 {progress > 0 ? `(${progress}%)` : ''}
                </>
              ) : (
                <>
                  <Play size={16} fill="currentColor" /> Start Learning & Enter Lab
                </>
              )}
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
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                      cursor: 'pointer',
                      padding: '16px 18px',
                      background: isOpen ? 'var(--blue-gradient-subtle)' : '#FFFFFF'
                    }}
                    onClick={() => setExpandedModule(isOpen ? null : module.id)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          background: 'var(--blue-soft)',
                          color: 'var(--blue-primary)',
                          border: '1px solid var(--blue-border)',
                          whiteSpace: 'nowrap',
                          flexShrink: 0
                        }}>
                          Module {mIdx + 1}
                        </span>
                        <strong style={{ fontSize: '15px', color: 'var(--text-primary)', wordBreak: 'break-word', lineHeight: 1.3 }}>
                          {module.name}
                        </strong>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                          {module.topics?.length || 0} Topics
                        </span>
                        {isOpen ? <ChevronUp size={16} color="#7B1C6E" /> : <ChevronDown size={16} color="#94A3B8" />}
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
