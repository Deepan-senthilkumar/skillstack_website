import React, { useState, useEffect } from 'react';
import {
  Sparkles, ArrowRight, BookOpen, Shield, Code, Cpu, Award,
  CheckCircle2, Users, Star, Play, Terminal, Layers,
  Search, Check, Zap, Laptop, Heart, GraduationCap, Video
} from 'lucide-react';
import RealAdSlot from '../components/RealAdSlot';
import { api } from '../api';

export default function HomePage({
  subjects = [],
  capabilities = [],
  onSelectSubject,
  onNavigate,
  onOpenStudentAuth,
  user
}) {
  const [enrollments, setEnrollments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredSubjects = subjects.filter(s =>
    !searchQuery ||
    s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.level?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* =========================================================================
          SECTION 1: HERO (Etech Style with Purple Sweater Student & Floating Badges)
          ========================================================================= */}
      <section className="etech-hero-section">
        <div className="etech-hero-container">
          {/* Left Column: Heading, Subtitle & Action Buttons */}
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: '#F5F3FF',
              border: '1px solid #DDD6FE',
              color: '#7C3AED',
              fontSize: '12px',
              fontWeight: 800,
              padding: '6px 16px',
              borderRadius: '9999px',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '20px'
            }}>
              <Sparkles size={14} color="#7C3AED" />
              <span>SkillStack • Next-Gen Software Engineering Platform</span>
            </div>

            <h1 className="etech-hero-title">
              SkillStack — Develop your skills in a{' '}
              <span className="highlight-purple">
                new &amp; unique way
              </span>
            </h1>

            <p className="etech-hero-desc">
              Explore a transformative approach to skill development on our online learning platform.
              Master production software engineering with sub-second compiler assertions, visual architectural models,
              and interactive coding sandboxes.
            </p>

            <div className="etech-hero-actions">
              <button
                className="etech-btn-pink"
                onClick={() => onNavigate('courses')}
              >
                <span>Enroll Now</span>
                <ArrowRight size={16} />
              </button>

              <button
                className="etech-btn-ghost"
                onClick={() => onNavigate('courses')}
              >
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: '#F3E8FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Play size={12} fill="#7C3AED" color="#7C3AED" style={{ marginLeft: '2px' }} />
                </div>
                <span>What's SkillStack?</span>
              </button>
            </div>
          </div>

          {/* Right Column: Layered Hero Image with Organic Blob & Floating Badges */}
          <div className="etech-hero-visual-box">
            <div className="etech-hero-blob-bg" />

            <div className="etech-hero-img-wrap">
              <img
                src="/images/hero_student.jpg"
                alt="SkillStack Student Learning"
                loading="eager"
              />
            </div>

            {/* Floating Badge 1: 50+ Online Courses */}
            <div className="etech-float-badge badge-top-left">
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                background: '#F3E8FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <GraduationCap size={20} color="#7C3AED" />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>50+</div>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Curated Modules</div>
              </div>
            </div>

            {/* Floating Badge 2: 10k+ Online Students */}
            <div className="etech-float-badge badge-top-right">
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                background: '#ECFDF5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Users size={18} color="#059669" />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>Active Cohorts</div>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Peer Learning</div>
              </div>
            </div>

            {/* Floating Badge 3: Automated Sandbox */}
            <div className="etech-float-badge badge-bottom-left">
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                background: '#FEF3C7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Zap size={18} color="#D97706" />
              </div>
              <div>
                <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#0F172A' }}>Sub-Second Runner</div>
                <div style={{ fontSize: '10.5px', color: '#059669', fontWeight: 700 }}>&ge;70% Automated Pass</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: BRAND & TECH RIBBON (Vibrant Purple Ribbon)
          ========================================================================= */}
      <section className="etech-brand-ribbon">
        <div className="etech-ribbon-item">
          <Terminal size={18} />
          <span>PYTHON 3.12</span>
        </div>
        <div className="etech-ribbon-item">
          <Layers size={18} />
          <span>DJANGO REST</span>
        </div>
        <div className="etech-ribbon-item">
          <Cpu size={18} />
          <span>C &amp; SYSTEMS ARCHITECTURE</span>
        </div>
        <div className="etech-ribbon-item">
          <Code size={18} />
          <span>REACT 18</span>
        </div>
        <div className="etech-ribbon-item">
          <Shield size={18} />
          <span>DOCKER SANDBOX</span>
        </div>
        <div className="etech-ribbon-item">
          <Award size={18} />
          <span>POSTGRESQL</span>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: SEARCH COURSES (Pill Search Bar)
          ========================================================================= */}
      <section className="etech-search-section">
        <h2 className="etech-search-title">Search Courses</h2>
        <div className="etech-search-pill-box">
          <Search size={18} color="#94A3B8" style={{ marginRight: '10px' }} />
          <input
            type="text"
            className="etech-search-input"
            placeholder="Search for Python, C Programming, Algorithms, System Design..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            className="etech-search-btn"
            onClick={() => onNavigate('courses')}
          >
            Search
          </button>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: BENEFITS FROM OUR ONLINE LEARNING (Layered Two-Column)
          ========================================================================= */}
      <section className="etech-benefits-section">
        {/* Left: 4-Student Collage Cover Photo */}
        <div>
          <div className="etech-benefits-collage-wrap">
            <img
              src="/images/benefits_collage.jpg"
              alt="Diverse Students Collaborating"
              loading="lazy"
            />
          </div>
        </div>

        {/* Right: Benefits Content List */}
        <div>
          <div style={{
            fontSize: '12px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: '#7C3AED',
            marginBottom: '8px'
          }}>
            Why Choose SkillStack
          </div>

          <h2 style={{
            fontFamily: 'Sora',
            fontSize: 'clamp(26px, 3.2vw, 38px)',
            fontWeight: 800,
            color: '#0F172A',
            lineHeight: 1.25,
            marginBottom: '28px'
          }}>
            <span style={{ color: '#7C3AED' }}>Benefits</span> From Our Online Learning
          </h2>

          {/* Benefit 1: Online Degrees & Certifications */}
          <div className="etech-benefits-item">
            <div className="etech-benefit-icon-round" style={{ background: '#F3E8FF', color: '#7C3AED' }}>
              <GraduationCap size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>
                Industry-Grade Verifiable Credentials
              </h4>
              <p style={{ fontSize: '13.5px', color: '#64748B', lineHeight: 1.55 }}>
                Earn verified digital certificates upon completing modular curriculum tracks with &ge;70% marks.
              </p>
            </div>
          </div>

          {/* Benefit 2: Short & Structured Courses */}
          <div className="etech-benefits-item">
            <div className="etech-benefit-icon-round" style={{ background: '#FCE7F3', color: '#DB2777' }}>
              <BookOpen size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>
                Modular Curriculum Tracks
              </h4>
              <p style={{ fontSize: '13.5px', color: '#64748B', lineHeight: 1.55 }}>
                Concise and focused chapters engineered for high retention and quick practical implementation.
              </p>
            </div>
          </div>

          {/* Benefit 3: Training From Experts */}
          <div className="etech-benefits-item">
            <div className="etech-benefit-icon-round" style={{ background: '#E0E7FF', color: '#4F46E5' }}>
              <Users size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>
                Training From Senior Engineers
              </h4>
              <p style={{ fontSize: '13.5px', color: '#64748B', lineHeight: 1.55 }}>
                Immerse yourself in knowledge designed by lead architects with hands-on systems architecture.
              </p>
            </div>
          </div>

          {/* Benefit 4: 1.5k+ Coding Challenges */}
          <div className="etech-benefits-item">
            <div className="etech-benefit-icon-round" style={{ background: '#FEF3C7', color: '#D97706' }}>
              <Terminal size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>
                1,500+ Automated Sandbox Assertions
              </h4>
              <p style={{ fontSize: '13.5px', color: '#64748B', lineHeight: 1.55 }}>
                In-browser compiler verifying code execution output against strict test cases in sub-seconds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: OUR POPULAR COURSES (Layered Purple/Pink Gradient Section)
          ========================================================================= */}
      <section className="etech-courses-purple-layer">
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div className="etech-layer-header">
            <h2 className="etech-layer-title">Our Popular Courses</h2>
            <p className="etech-layer-desc">
              Discover our most sought-after tracks, carefully curated to meet the demands of modern technology.
              Dive into hands-on problem sets designed for success at every step of your engineering journey.
            </p>
          </div>

          {/* Course Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '28px'
          }}>
            {filteredSubjects.slice(0, 6).map(subject => {
              const enrollment = enrollments.find(e =>
                String(e.subject || e.subject_id) === String(subject.id) ||
                e.subject_slug === subject.slug
              );
              const isCompleted = Boolean(
                enrollment && (enrollment.status === 'COMPLETED' || (enrollment.progress_percentage || 0) >= 100)
              );
              const isEnrolled = Boolean(enrollment && !isCompleted);
              const progress = enrollment?.progress_percentage ? Math.round(enrollment.progress_percentage) : 0;

              return (
                <div
                  key={subject.id}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '24px',
                    padding: '24px',
                    boxShadow: '0 20px 35px -8px rgba(0, 0, 0, 0.15)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all 0.25s ease',
                    cursor: 'pointer'
                  }}
                  onClick={() => onSelectSubject(subject)}
                >
                  <div>
                    {/* Course Category Tag & Rating */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        background: '#F3E8FF',
                        color: '#7C3AED',
                        letterSpacing: '0.04em'
                      }}>
                        {subject.level || 'Engineering Track'}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 700, color: '#F59E0B' }}>
                        <Star size={13} fill="#F59E0B" color="#F59E0B" />
                        <span>4.9</span>
                      </div>
                    </div>

                    <h3 style={{
                      fontSize: '19px',
                      fontWeight: 800,
                      color: '#0F172A',
                      lineHeight: 1.3,
                      marginBottom: '8px'
                    }}>
                      {subject.name}
                    </h3>

                    <p style={{
                      fontSize: '13.5px',
                      color: '#64748B',
                      lineHeight: 1.6,
                      marginBottom: '20px',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {subject.short_description || subject.description || 'Comprehensive curriculum with hands-on coding modules and automated problem evaluations.'}
                    </p>

                    {/* Metadata Strip - All Real DB Metrics */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      fontSize: '12.5px',
                      color: '#94A3B8',
                      marginBottom: '20px',
                      paddingBottom: '16px',
                      borderBottom: '1px solid #F1F5F9'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <BookOpen size={14} color="#7C3AED" />
                        <span style={{ color: '#475569', fontWeight: 600 }}>{subject.module_count ?? 3} Chapters</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Terminal size={14} color="#059669" />
                        <span style={{ color: '#475569', fontWeight: 600 }}>{subject.duration || 'Structured Track'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom: View Syllabus CTA Button */}
                  <div>
                    <button
                      style={{
                        width: '100%',
                        padding: '12px 18px',
                        borderRadius: '9999px',
                        background: isCompleted
                          ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                          : 'linear-gradient(135deg, #7C3AED 0%, #A855F7 50%, #EC4899 100%)',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontSize: '14px',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 14px rgba(124, 58, 237, 0.25)',
                        transition: 'transform 0.2s ease'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectSubject(subject);
                      }}
                    >
                      <BookOpen size={15} />
                      <span>{isCompleted ? 'Completed 🎓 • View Syllabus' : (isEnrolled ? `View Syllabus 🚀 (${progress}%)` : 'View Syllabus')}</span>
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: BECOME AN INSTRUCTOR (Two-Column with Photo & Perks List)
          ========================================================================= */}
      <section className="etech-instructor-section">
        {/* Left: Perks & CTA */}
        <div>
          <div style={{
            fontSize: '13px',
            fontWeight: 800,
            color: '#64748B',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            marginBottom: '6px'
          }}>
            If You Are A Certified Lead or Senior Engineer
          </div>

          <h2 style={{
            fontFamily: 'Sora',
            fontSize: 'clamp(28px, 3.5vw, 42px)',
            fontWeight: 800,
            color: '#0F172A',
            lineHeight: 1.2,
            marginBottom: '18px'
          }}>
            Then <span style={{ color: '#7C3AED' }}>Become An Instructor</span>
          </h2>

          <p style={{ fontSize: '15px', color: '#64748B', lineHeight: 1.65, marginBottom: '28px' }}>
            Unlock the opportunity to inspire and educate by joining our team of mentors.
            If you're an experienced engineer, elevate your impact and share your expertise with learners worldwide.
          </p>

          <h4 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', marginBottom: '16px' }}>
            Enjoy Many Perks
          </h4>

          {/* Perks Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
            marginBottom: '32px'
          }}>
            {[
              'Global Impact',
              'Creative Freedom',
              'Flexible Schedule',
              'Monetize Your Expertise',
              'Automated Testing Tools',
              'Professional Development',
              'Community Recognition',
              'Networking Opportunities'
            ].map((perk, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#334155' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#A855F7', flexShrink: 0 }} />
                <span>{perk}</span>
              </div>
            ))}
          </div>

          <button
            className="etech-btn-pink"
            onClick={() => onNavigate('contact')}
          >
            <span>Become an Instructor</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Right: Instructor Photo Card */}
        <div>
          <div className="etech-instructor-img-card">
            <img
              src="/images/instructor_portrait.jpg"
              alt="Professional SkillStack Instructor"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: STUDENT'S TESTIMONIALS (Layered Violet Backdrop)
          ========================================================================= */}
      <section className="etech-testimonials-layer">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ maxWidth: '640px', margin: '0 auto 48px' }}>
            <h2 style={{ fontFamily: 'Sora', fontSize: 'clamp(26px, 3.2vw, 38px)', fontWeight: 800, color: '#FFFFFF', marginBottom: '10px' }}>
              Student's Testimonials
            </h2>
            <p style={{ fontSize: '14.5px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}>
              Here's what our students have to say about their hands-on learning experience.
              Real stories and tangible career growth from mastering engineering fundamentals.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
            textAlign: 'left'
          }}>
            {[
              {
                name: 'Ananya Sharma',
                role: 'Backend Intern @ CloudScale',
                avatar: 'AS',
                review: 'Enrolling in SkillStack’s C and Python tracks was transformative. The immediate compiler output assertions and memory topology diagrams made complex systems intuitive!'
              },
              {
                name: 'Rahul Varma',
                role: 'Software Engineer @ DataMesh',
                avatar: 'RV',
                review: 'The randomized topic knowledge gates and cooldown timer are fantastic. It stopped me from skimming and forced genuine retention of algorithms and HTTP cycles.'
              },
              {
                name: 'Divya Krishnan',
                role: 'Full-Stack Developer',
                avatar: 'DK',
                review: 'Highly recommend! The verified credentials helped me stand out in technical interviews because the coursework is backed by actual coding problem submissions.'
              }
            ].map((t, i) => (
              <div
                key={i}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '20px',
                  padding: '24px',
                  boxShadow: '0 12px 30px -6px rgba(0,0,0,0.15)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '14px'
                  }}>
                    {t.avatar}
                  </div>
                  <div>
                    <h5 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0 }}>{t.name}</h5>
                    <span style={{ fontSize: '12px', color: '#64748B' }}>{t.role}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '3px', marginBottom: '12px' }}>
                  {[...Array(5)].map((_, s) => (
                    <Star key={s} size={14} fill="#F59E0B" color="#F59E0B" />
                  ))}
                </div>

                <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                  "{t.review}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
