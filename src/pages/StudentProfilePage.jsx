import React, { useState, useEffect } from 'react';
import {
  User, BookOpen, Award, CheckCircle2, Clock, Sparkles,
  ArrowRight, Shield, Play, PlusCircle, Check, RefreshCw,
  ExternalLink, Layers, GraduationCap, AlertCircle
} from 'lucide-react';
import { api } from '../api';
import CertificateModal from '../components/CertificateModal';

export default function StudentProfilePage({
  user,
  subjects = [],
  onStartLearning,
  onNavigate
}) {
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'completed' | 'catalog' | 'certificates'
  const [enrollments, setEnrollments] = useState(() => {
    try {
      const cached = localStorage.getItem('skillstack_cached_enrollments');
      return cached ? JSON.parse(cached) : [];
    } catch { return []; }
  });
  const [certificates, setCertificates] = useState(() => {
    try {
      const cached = localStorage.getItem('skillstack_cached_certs');
      return cached ? JSON.parse(cached) : [];
    } catch { return []; }
  });
  const [loading, setLoading] = useState(false);
  const [enrollingSubjectId, setEnrollingSubjectId] = useState(null);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);

  const fetchStudentData = async (silent = true) => {
    if (!silent) setLoading(true);
    try {
      const [enrollData, certData] = await Promise.allSettled([
        api.getMyEnrollments(),
        api.getMyCertificates()
      ]);

      if (enrollData.status === 'fulfilled') {
        const list = Array.isArray(enrollData.value) ? enrollData.value : (enrollData.value?.results || []);
        setEnrollments(list);
      }
      if (certData.status === 'fulfilled') {
        const certList = Array.isArray(certData.value) ? certData.value : (certData.value?.results || []);
        setCertificates(certList);
      }
    } catch (e) {
      console.error('Error fetching student dashboard data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, []);

  const handleEnroll = async (subject) => {
    if (!user || !api.getToken()) {
      setActionMessage({ type: 'error', text: 'Please sign in or create an account to enroll in this course.' });
      return;
    }
    setEnrollingSubjectId(subject.id);
    setActionMessage(null);
    try {
      const res = await api.enrollCourse(subject);
      setActionMessage({ type: 'success', text: `Successfully enrolled in ${subject.name}! You can now start learning.` });
      await fetchStudentData();
      setActiveTab('active');
    } catch (e) {
      console.error('Enroll error:', e);
      setActionMessage({ type: 'error', text: e.message || 'Failed to enroll in this course. Please try again.' });
    } finally {
      setEnrollingSubjectId(null);
    }
  };

  // Classify enrollments
  const activeEnrollments = enrollments.filter(e => e.status === 'ACTIVE' || (e.progress_percentage || 0) < 100);
  const completedEnrollments = enrollments.filter(e => e.status === 'COMPLETED' || (e.progress_percentage || 0) >= 100);
  const enrolledSubjectIds = new Set(enrollments.map(e => String(e.subject || e.subject_id)));
  const enrolledSubjectSlugs = new Set(enrollments.map(e => e.subject_slug).filter(Boolean));
  const availableCatalog = subjects.filter(s =>
    !enrolledSubjectIds.has(String(s.id)) &&
    !enrolledSubjectSlugs.has(s.slug)
  );

  const displayName = user?.first_name || user?.username || 'Fellow Student';
  const email = user?.email || 'Registered Student';

  return (
    <div style={{
      maxWidth: '1240px',
      margin: '0 auto',
      padding: '36px 20px 80px',
      position: 'relative',
      minHeight: '80vh'
    }}>
      {/* Ambient background glows */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '-40px',
        width: '320px',
        height: '320px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(123, 28, 110, 0.12) 0%, transparent 70%)',
        filter: 'blur(40px)',
        pointerEvents: 'none'
      }} />

      {/* HEADER PROFILE HERO CARD */}
      <div style={{
        background: 'linear-gradient(135deg, #1F081C 0%, #3D0C36 50%, #170415 100%)',
        borderRadius: '24px',
        padding: '32px 36px',
        color: '#FFFFFF',
        boxShadow: '0 12px 36px rgba(31, 8, 28, 0.16)',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: '32px'
      }}>
        {/* Subtle decorative grid */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(rgba(253, 192, 41, 0.1) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          opacity: 0.6,
          pointerEvents: 'none'
        }} />

        <div style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px'
        }}>
          {/* Identity info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{
              width: '74px',
              height: '74px',
              borderRadius: '22px',
              background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 50%, #EC4899 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontSize: '30px',
              fontWeight: 800,
              boxShadow: '0 8px 24px rgba(124, 58, 237, 0.35)',
              border: '2px solid rgba(255, 255, 255, 0.2)'
            }}>
              {displayName.charAt(0).toUpperCase()}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 800, letterSpacing: '-0.02em', color: '#FFFFFF' }}>
                  {displayName}
                </h1>
                <span style={{
                  padding: '3px 10px',
                  borderRadius: '999px',
                  fontSize: '11px',
                  fontWeight: 800,
                  background: 'rgba(253, 192, 41, 0.2)',
                  color: '#FDC029',
                  border: '1px solid rgba(253, 192, 41, 0.4)'
                }}>
                  Verified Fellow
                </span>
              </div>
              <div style={{ fontSize: '13.5px', color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>{email}</span>
                <span>&bull;</span>
                <span>Cohort #{user?.batch || '2026-A'}</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            background: 'rgba(255, 255, 255, 0.06)',
            padding: '12px 20px',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ textAlign: 'center', minWidth: '70px' }}>
              <div style={{ fontSize: '22px', fontWeight: 850, color: '#FDC029' }}>{enrollments.length}</div>
              <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>Enrolled</div>
            </div>
            <div style={{ width: '1px', height: '28px', background: 'rgba(255, 255, 255, 0.15)' }} />
            <div style={{ textAlign: 'center', minWidth: '70px' }}>
              <div style={{ fontSize: '22px', fontWeight: 850, color: '#38BDF8' }}>{activeEnrollments.length}</div>
              <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>In Progress</div>
            </div>
            <div style={{ width: '1px', height: '28px', background: 'rgba(255, 255, 255, 0.15)' }} />
            <div style={{ textAlign: 'center', minWidth: '70px' }}>
              <div style={{ fontSize: '22px', fontWeight: 850, color: '#10B981' }}>{completedEnrollments.length}</div>
              <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>Completed</div>
            </div>
            <div style={{ width: '1px', height: '28px', background: 'rgba(255, 255, 255, 0.15)' }} />
            <div style={{ textAlign: 'center', minWidth: '70px' }}>
              <div style={{ fontSize: '22px', fontWeight: 850, color: '#C084FC' }}>{certificates.length}</div>
              <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>Certificates</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Notification Alert */}
      {actionMessage && (
        <div style={{
          marginBottom: '24px',
          padding: '14px 18px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: actionMessage.type === 'success' ? '#ECFDF5' : '#FEF2F2',
          border: `1.5px solid ${actionMessage.type === 'success' ? '#10B981' : '#EF4444'}`,
          color: actionMessage.type === 'success' ? '#065F46' : '#991B1B',
          fontSize: '13.5px',
          fontWeight: 600
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {actionMessage.type === 'success' ? <CheckCircle2 size={18} color="#10B981" /> : <AlertCircle size={18} color="#EF4444" />}
            <span>{actionMessage.text}</span>
          </div>
          <button
            onClick={() => setActionMessage(null)}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'inherit', fontWeight: 700 }}
          >
            &times;
          </button>
        </div>
      )}

      {/* TABS NAVIGATION */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '28px',
        borderBottom: '2px solid rgba(123, 28, 110, 0.1)',
        paddingBottom: '12px'
      }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('active')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: '999px',
              fontSize: '13.5px',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              background: activeTab === 'active' ? 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)' : '#F1F5F9',
              color: activeTab === 'active' ? '#FFFFFF' : '#475569',
              boxShadow: activeTab === 'active' ? '0 4px 14px rgba(124, 58, 237, 0.25)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <BookOpen size={16} />
            <span>Active Courses ({activeEnrollments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('completed')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: '999px',
              fontSize: '13.5px',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              background: activeTab === 'completed' ? 'linear-gradient(135deg, #059669 0%, #10B981 100%)' : '#F1F5F9',
              color: activeTab === 'completed' ? '#FFFFFF' : '#475569',
              boxShadow: activeTab === 'completed' ? '0 4px 14px rgba(16, 185, 129, 0.25)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <CheckCircle2 size={16} />
            <span>Completed Courses ({completedEnrollments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('catalog')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: '999px',
              fontSize: '13.5px',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              background: activeTab === 'catalog' ? 'linear-gradient(135deg, #2563EB 0%, #38BDF8 100%)' : '#F1F5F9',
              color: activeTab === 'catalog' ? '#FFFFFF' : '#475569',
              boxShadow: activeTab === 'catalog' ? '0 4px 14px rgba(37, 99, 235, 0.25)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <PlusCircle size={16} />
            <span>Enroll New Courses ({availableCatalog.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('certificates')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: '999px',
              fontSize: '13.5px',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              background: activeTab === 'certificates' ? 'linear-gradient(135deg, #9333EA 0%, #C084FC 100%)' : '#F1F5F9',
              color: activeTab === 'certificates' ? '#FFFFFF' : '#475569',
              boxShadow: activeTab === 'certificates' ? '0 4px 14px rgba(147, 51, 234, 0.25)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <GraduationCap size={16} />
            <span>My Certificates ({certificates.length})</span>
          </button>
        </div>

        <button
          onClick={fetchStudentData}
          disabled={loading}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            borderRadius: '8px',
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            fontSize: '12.5px',
            fontWeight: 600,
            color: '#64748B',
            cursor: 'pointer'
          }}
          title="Refresh Progress"
        >
          <RefreshCw size={13} className={loading ? 'spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* =========================================================================
          TAB 1: ACTIVE COURSES
          ========================================================================= */}
      {activeTab === 'active' && (
        <div>
          {activeEnrollments.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 24px',
              background: '#FFFFFF',
              borderRadius: '20px',
              border: '2px dashed #E2E8F0'
            }}>
              <BookOpen size={48} color="#94A3B8" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1E293B', marginBottom: '8px' }}>
                No active courses right now
              </h3>
              <p style={{ fontSize: '14px', color: '#64748B', maxWidth: '480px', margin: '0 auto 20px' }}>
                You have not registered for any active course yet. Explore our engineering tracks and enroll to unlock the learning workbench.
              </p>
              <button
                onClick={() => setActiveTab('catalog')}
                style={{
                  padding: '11px 24px',
                  borderRadius: '999px',
                  background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 50%, #EC4899 100%)',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '13.5px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 16px rgba(124, 58, 237, 0.3)'
                }}
              >
                <PlusCircle size={16} /> Browse Course Catalog
              </button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
              gap: '24px'
            }}>
              {activeEnrollments.map(item => {
                const subObj = subjects.find(s => String(s.id) === String(item.subject) || s.slug === item.subject_slug) || {
                  name: item.subject_name || 'Engineering Track',
                  slug: item.subject_slug || 'c-programming',
                  level: item.subject_level || 'Intermediate'
                };
                const pct = Math.min(100, Math.round(item.progress_percentage || 0));

                return (
                  <div
                    key={item.id}
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '20px',
                      border: '1.5px solid #F1F5F9',
                      padding: '24px',
                      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.04)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '11.5px',
                          fontWeight: 800,
                          background: 'rgba(124, 58, 237, 0.08)',
                          color: '#7C3AED'
                        }}>
                          {subObj.level || 'Academic Track'}
                        </span>
                        <span style={{
                          fontSize: '11.5px',
                          fontWeight: 700,
                          color: '#10B981',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}>
                          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10B981' }} />
                          Enrolled Active
                        </span>
                      </div>

                      <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
                        {subObj.name}
                      </h3>
                      <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.5, marginBottom: '20px' }}>
                        {subObj.short_description || subObj.description || 'Interactive programming course with theory, MCQs, and mandatory compiler lab problems.'}
                      </p>

                      {/* Progress Bar */}
                      <div style={{ marginBottom: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                          <span style={{ color: '#475569' }}>Curriculum Completion</span>
                          <span style={{ color: '#7C3AED', fontWeight: 800 }}>{pct}%</span>
                        </div>
                        <div style={{ width: '100%', height: '8px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{
                            width: `${pct}%`,
                            height: '100%',
                            background: 'linear-gradient(90deg, #7C3AED 0%, #A855F7 50%, #EC4899 100%)',
                            borderRadius: '4px',
                            transition: 'width 0.4s ease'
                          }} />
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        onClick={() => onStartLearning(subObj)}
                        style={{
                          flex: 1,
                          padding: '12px',
                          borderRadius: '9999px',
                          background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 50%, #EC4899 100%)',
                          color: '#FFFFFF',
                          fontWeight: 700,
                          fontSize: '13px',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          boxShadow: '0 4px 14px rgba(124, 58, 237, 0.3)'
                        }}
                      >
                        <Play size={14} fill="#FFFFFF" /> Continue Learning
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 2: COMPLETED COURSES
          ========================================================================= */}
      {activeTab === 'completed' && (
        <div>
          {completedEnrollments.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 24px',
              background: '#FFFFFF',
              borderRadius: '20px',
              border: '2px dashed #E2E8F0'
            }}>
              <Award size={48} color="#94A3B8" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1E293B', marginBottom: '8px' }}>
                No completed courses yet
              </h3>
              <p style={{ fontSize: '14px', color: '#64748B', maxWidth: '480px', margin: '0 auto 20px' }}>
                Complete all topics, quizzes, and practical lab tests in an active course to reach 100% and unlock your official SkillStack Certificate!
              </p>
              <button
                onClick={() => setActiveTab('active')}
                style={{
                  padding: '10px 22px',
                  borderRadius: '9999px',
                  background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 50%, #EC4899 100%)',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '13px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(124, 58, 237, 0.3)'
                }}
              >
                Go to Active Courses
              </button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
              gap: '24px'
            }}>
              {completedEnrollments.map(item => {
                const subObj = subjects.find(s => s.id === item.subject) || {
                  name: item.subject_name || 'Engineering Track',
                  slug: item.subject_slug || 'c-programming'
                };
                const cert = item.certificate_details;

                return (
                  <div
                    key={item.id}
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '20px',
                      border: '2px solid #10B981',
                      padding: '24px',
                      boxShadow: '0 8px 24px rgba(16, 185, 129, 0.08)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 800,
                          background: '#ECFDF5',
                          color: '#059669',
                          border: '1px solid #A7F3D0'
                        }}>
                          100% MASTERED
                        </span>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B' }}>
                          {item.completed_at ? new Date(item.completed_at).toLocaleDateString() : 'Completed'}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
                        {subObj.name}
                      </h3>
                      <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.5, marginBottom: '20px' }}>
                        All modules, interactive quizzes, and mandatory automated lab challenges have been successfully verified and passed.
                      </p>

                      <div style={{
                        background: '#F8FAFC',
                        borderRadius: '12px',
                        padding: '12px 14px',
                        marginBottom: '20px',
                        border: '1px solid #E2E8F0',
                        fontSize: '12px'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ color: '#64748B', fontWeight: 600 }}>Grade / Mastery:</span>
                          <span style={{ color: '#059669', fontWeight: 800 }}>100% Passed</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#64748B', fontWeight: 600 }}>Credential Status:</span>
                          <span style={{ color: '#7C3AED', fontWeight: 800 }}>Official Certificate Minted 🎓</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        onClick={() => {
                          const certToView = cert || {
                            certificate_id: `CERT-SKILLSTACK-${(subObj.slug || 'COURSE').toUpperCase()}-${item.id}`,
                            student_name: displayName,
                            course_name: subObj.name,
                            issued_at: item.completed_at || new Date().toISOString(),
                            grade_percentage: 100,
                            batch: item.batch_name || '2026-A'
                          };
                          setSelectedCertificate(certToView);
                        }}
                        style={{
                          flex: 1,
                          padding: '11px',
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
                          color: '#FFFFFF',
                          fontWeight: 700,
                          fontSize: '13px',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
                        }}
                      >
                        <GraduationCap size={15} /> View & Print Certificate 🎓
                      </button>

                      <button
                        onClick={() => onStartLearning(subObj)}
                        style={{
                          padding: '11px 16px',
                          borderRadius: '12px',
                          background: '#F1F5F9',
                          color: '#334155',
                          fontWeight: 700,
                          fontSize: '13px',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                        title="Review Syllabus Material"
                      >
                        Review
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 3: EXPLORE & ENROLL NEW COURSES
          ========================================================================= */}
      {activeTab === 'catalog' && (
        <div>
          {availableCatalog.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 24px',
              background: '#FFFFFF',
              borderRadius: '20px',
              border: '2px dashed #E2E8F0'
            }}>
              <CheckCircle2 size={48} color="#10B981" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1E293B', marginBottom: '8px' }}>
                You are enrolled in all available courses!
              </h3>
              <p style={{ fontSize: '14px', color: '#64748B', maxWidth: '460px', margin: '0 auto 20px' }}>
                You have active access to the entire academic catalog. Check back soon for new advanced tracks.
              </p>
              <button
                onClick={() => setActiveTab('active')}
                style={{
                  padding: '10px 22px',
                  borderRadius: '9999px',
                  background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 50%, #EC4899 100%)',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '13px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(124, 58, 237, 0.3)'
                }}
              >
                Go to My Active Courses
              </button>
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1E293B', marginBottom: '4px' }}>
                  Available Engineering Tracks
                </h3>
                <p style={{ fontSize: '13.5px', color: '#64748B' }}>
                  Choose and register for the curriculum tracks you wish to study. Enrolling unlocks lesson notes, quizzes, and compiler lab environments.
                </p>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
                gap: '24px'
              }}>
                {availableCatalog.map(subject => (
                  <div
                    key={subject.id}
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '20px',
                      border: '1.5px solid #E2E8F0',
                      padding: '24px',
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'border-color 0.2s ease'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 800,
                          background: 'rgba(37, 99, 235, 0.08)',
                          color: '#2563EB'
                        }}>
                          {subject.level || 'Beginner to Advanced'}
                        </span>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748B' }}>
                          {subject.duration || '6-8 Weeks'}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
                        {subject.name}
                      </h3>
                      <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.5, marginBottom: '20px' }}>
                        {subject.short_description || subject.description || 'Structured academic track featuring sequential topic unlocking and live automated assertions.'}
                      </p>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        fontSize: '12px',
                        color: '#475569',
                        marginBottom: '20px'
                      }}>
                        <span>Domain Chair: <strong>{subject.instructor_name || 'Senior Staff Faculty'}</strong></span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleEnroll(subject)}
                      disabled={enrollingSubjectId === subject.id}
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '9999px',
                        background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 50%, #EC4899 100%)',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontSize: '13.5px',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 16px rgba(124, 58, 237, 0.3)',
                        opacity: enrollingSubjectId === subject.id ? 0.7 : 1
                      }}
                    >
                      {enrollingSubjectId === subject.id ? (
                        <>Enrolling...</>
                      ) : (
                        <>
                          <PlusCircle size={15} /> Enroll & Unlock Course
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 4: CERTIFICATES REPOSITORY
          ========================================================================= */}
      {activeTab === 'certificates' && (
        <div>
          {certificates.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 24px',
              background: '#FFFFFF',
              borderRadius: '20px',
              border: '2px dashed #E2E8F0'
            }}>
              <GraduationCap size={48} color="#94A3B8" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1E293B', marginBottom: '8px' }}>
                No Certificates Earned Yet
              </h3>
              <p style={{ fontSize: '14px', color: '#64748B', maxWidth: '480px', margin: '0 auto 20px' }}>
                Complete all topics, quizzes, and compiler lab challenges in an active course to generate your verified certificate credential.
              </p>
              <button
                onClick={() => setActiveTab('active')}
                style={{
                  padding: '10px 22px',
                  borderRadius: '9999px',
                  background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 50%, #EC4899 100%)',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '13px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(124, 58, 237, 0.3)'
                }}
              >
                Go to Active Courses
              </button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
              gap: '24px'
            }}>
              {certificates.map(cert => (
                <div
                  key={cert.id}
                  style={{
                    background: 'linear-gradient(135deg, #FAF5FF 0%, #FFFFFF 100%)',
                    borderRadius: '20px',
                    border: '2px solid #E9D5FF',
                    padding: '24px',
                    boxShadow: '0 8px 24px rgba(147, 51, 234, 0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 800,
                        background: '#F3E8FF',
                        color: '#7E22CE'
                      }}>
                        OFFICIAL CREDENTIAL
                      </span>
                      <span style={{ fontSize: '11.5px', color: '#64748B', fontFamily: 'monospace', fontWeight: 700 }}>
                        {cert.certificate_id}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '18px', fontWeight: 850, color: '#581C87', marginBottom: '8px' }}>
                      {cert.course_name}
                    </h3>
                    <div style={{ fontSize: '13px', color: '#6B21A8', marginBottom: '16px' }}>
                      Conferred to: <strong>{cert.student_name}</strong>
                    </div>

                    <div style={{
                      background: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: '10px',
                      padding: '10px 12px',
                      fontSize: '12px',
                      color: '#4B5563',
                      marginBottom: '18px',
                      border: '1px solid #E9D5FF'
                    }}>
                      <div>Issued: <strong>{new Date(cert.issued_at).toLocaleDateString()}</strong></div>
                      <div>Status: <strong style={{ color: '#059669' }}>Active & Verified</strong></div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedCertificate(cert)}
                    style={{
                      width: '100%',
                      padding: '11px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #7E22CE 0%, #A855F7 100%)',
                      color: '#FFFFFF',
                      fontWeight: 700,
                      fontSize: '13px',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      boxShadow: '0 4px 14px rgba(126, 34, 206, 0.25)'
                    }}
                  >
                    <GraduationCap size={15} /> View & Download Full Certificate
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          HIGH-RESOLUTION PRINTABLE CERTIFICATE MODAL
          ========================================================================= */}
      {selectedCertificate && (
        <CertificateModal
          certificate={selectedCertificate}
          onClose={() => setSelectedCertificate(null)}
        />
      )}
    </div>
  );
}
