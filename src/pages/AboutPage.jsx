import React from 'react';
import {
  Sparkles, Award, Code, Cpu, Target, CheckCircle2, ArrowRight,
  ExternalLink, GraduationCap, Briefcase, Heart, Laptop, Terminal,
  Globe, Mail, Layers, ShieldCheck
} from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

const GitHubIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const LinkedInIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const YouTubeIcon = ({ size = 15, color = "#EF4444" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <polygon points="10 15 15 12 10 9 10 15" fill={color} />
  </svg>
);

export default function AboutPage({ onNavigate }) {
  const { creator } = siteConfig;

  return (
    <div style={{ maxWidth: '1240px', width: '100%', margin: '0 auto', padding: '36px 20px 80px', position: 'relative', overflow: 'hidden', boxSizing: 'border-box' }}>
      {/* Decorative Ambient Background Blobs */}
      <div className="curvy-floating-orb orb-blue" style={{ top: '60px', left: '0px', width: 'min(380px, 80vw)', height: 'min(380px, 80vw)' }} />
      <div className="curvy-floating-orb orb-cyan" style={{ top: '240px', right: '0px', width: 'min(340px, 75vw)', height: 'min(340px, 75vw)' }} />

      {/* HERO BANNER */}
      <div className="catalog-hero-banner">
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

        <div className="watermark-tech-grid" />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '860px' }}>
          <div className="hero-badge">
            <Sparkles size={14} color="#FDC029" />
            <span>Developer Learning Platform &bull; Project Story</span>
          </div>

          <h1 style={{ fontSize: 'clamp(28px, 3.6vw, 44px)', fontWeight: 850, color: '#FFFFFF', marginBottom: '16px', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
            Built by Developers, for Developers:{' '}
            <span style={{
              background: 'linear-gradient(135deg, #FDC029 0%, #FB7185 50%, #C084FC 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline'
            }}>
              The SkillStack Story
            </span>
          </h1>

          <p style={{ color: '#94A3B8', fontSize: '15.5px', lineHeight: 1.75, marginBottom: '24px' }}>
            SkillStack was designed and engineered by <strong>{creator.name}</strong> as an interactive software engineering learning playground. It bridges the gap between passive video watching and active hands-on coding through in-browser compilers, structured notes, and automated output verification.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div className="catalog-hero-pill-feature">
              <CheckCircle2 size={15} color="#10B981" /> 100% Hands-On Practical Sandboxes
            </div>
            <div className="catalog-hero-pill-feature">
              <CheckCircle2 size={15} color="#FDC029" /> Structured Step-by-Step Curriculum
            </div>
            <div className="catalog-hero-pill-feature">
              <CheckCircle2 size={15} color="#A855F7" /> Automated Output Verification
            </div>
          </div>
        </div>
      </div>

      {/* MEET THE CREATOR SECTION */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '32px',
        border: '1.5px solid rgba(123, 28, 110, 0.14)',
        boxShadow: '0 12px 36px rgba(10, 25, 60, 0.05)',
        padding: '42px 36px',
        marginBottom: '64px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div className="section-tag" style={{ margin: 0 }}>
            <Code size={14} /> The Engineer Behind SkillStack
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '36px',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ fontSize: '30px', fontWeight: 850, color: '#0F172A', marginBottom: '8px', letterSpacing: '-0.02em' }}>
              {creator.name} <span style={{ fontSize: '18px', fontWeight: 600, color: '#64748B' }}>({creator.fullName})</span>
            </h2>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '20px',
              background: 'rgba(123, 28, 110, 0.08)',
              color: '#7B1C6E',
              fontSize: '13px',
              fontWeight: 800,
              marginBottom: '20px'
            }}>
              <Laptop size={15} /> {creator.role} &bull; {creator.location}
            </div>

            <p style={{ color: '#475569', fontSize: '15px', lineHeight: 1.8, marginBottom: '20px' }}>
              Deepan is a passionate Flutter and Full Stack Developer with hands-on experience shipping production-grade mobile applications to the <strong>Google Play Store</strong>, creating dynamic web applications with <strong>React.js & Python</strong>, and architecting developer tools.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#334155' }}>
                <Briefcase size={16} color="#7B1C6E" />
                <span>Currently working at: <strong>{creator.company}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#334155' }}>
                <GraduationCap size={16} color="#7B1C6E" />
                <span>Education: <strong>{creator.education}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#334155' }}>
                <YouTubeIcon size={16} color="#EF4444" />
                <span>Creative Media & Editing: <strong>Jerry Edits (@jerryedits4)</strong></span>
              </div>
            </div>

            {/* Quick Action External Links */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <a
                href={creator.portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  textDecoration: 'none',
                  padding: '10px 20px',
                  borderRadius: 'var(--radius-full)',
                  background: 'linear-gradient(135deg, #7B1C6E 0%, #A82596 100%)',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '13.5px'
                }}
              >
                <Globe size={15} /> Visit Deepan's Portfolio <ExternalLink size={13} />
              </a>

              <a
                href={creator.jerryEditsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  textDecoration: 'none',
                  padding: '10px 20px',
                  borderRadius: 'var(--radius-full)',
                  background: '#FFFFFF',
                  color: '#0F172A',
                  border: '1.5px solid #CBD5E1',
                  fontWeight: 700,
                  fontSize: '13.5px'
                }}
              >
                <YouTubeIcon size={15} color="#EF4444" /> Jerry Edits <ExternalLink size={13} />
              </a>

              <a
                href={creator.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  textDecoration: 'none',
                  padding: '10px 20px',
                  borderRadius: 'var(--radius-full)',
                  background: '#FFFFFF',
                  color: '#0F172A',
                  border: '1.5px solid #CBD5E1',
                  fontWeight: 700,
                  fontSize: '13.5px'
                }}
              >
                <GitHubIcon size={15} /> GitHub
              </a>

              <a
                href={creator.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  textDecoration: 'none',
                  padding: '10px 20px',
                  borderRadius: 'var(--radius-full)',
                  background: '#FFFFFF',
                  color: '#0A66C2',
                  border: '1.5px solid #CBD5E1',
                  fontWeight: 700,
                  fontSize: '13.5px'
                }}
              >
                <LinkedInIcon size={15} /> LinkedIn
              </a>
            </div>
          </div>

          {/* Highlights Mini Card Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(123, 28, 110, 0.05) 0%, rgba(253, 192, 41, 0.08) 100%)',
              border: '1.5px solid rgba(123, 28, 110, 0.15)',
              borderRadius: '20px',
              padding: '22px 20px'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>📱</div>
              <div style={{ fontWeight: 800, fontSize: '15px', color: '#0F172A', marginBottom: '4px' }}>Mobile Engineering</div>
              <div style={{ fontSize: '12.5px', color: '#64748B', lineHeight: 1.6 }}>Flutter, Dart, GetX, Google Play Store publishing & payment integration.</div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(56, 189, 248, 0.08) 100%)',
              border: '1.5px solid rgba(37, 99, 235, 0.15)',
              borderRadius: '20px',
              padding: '22px 20px'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>💻</div>
              <div style={{ fontWeight: 800, fontSize: '15px', color: '#0F172A', marginBottom: '4px' }}>Full Stack Web</div>
              <div style={{ fontSize: '12.5px', color: '#64748B', lineHeight: 1.6 }}>React.js, Node.js, Python, Django REST Framework & clean API architecture.</div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, rgba(22, 163, 74, 0.05) 0%, rgba(134, 239, 172, 0.08) 100%)',
              border: '1.5px solid rgba(22, 163, 74, 0.15)',
              borderRadius: '20px',
              padding: '22px 20px'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>⚡</div>
              <div style={{ fontWeight: 800, fontSize: '15px', color: '#0F172A', marginBottom: '4px' }}>Automated Testing</div>
              <div style={{ fontSize: '12.5px', color: '#64748B', lineHeight: 1.6 }}>Terminal sandbox code execution, assertion validation, and test harness scoring.</div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(253, 230, 138, 0.08) 100%)',
              border: '1.5px solid rgba(245, 158, 11, 0.15)',
              borderRadius: '20px',
              padding: '22px 20px'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>🎬</div>
              <div style={{ fontWeight: 800, fontSize: '15px', color: '#0F172A', marginBottom: '4px' }}>Creative Media</div>
              <div style={{ fontSize: '12.5px', color: '#64748B', lineHeight: 1.6 }}>Founder of Jerry Edits with 30k+ audience, audio-visual editing & social impact.</div>
            </div>
          </div>
        </div>
      </div>

      {/* WHY SKILLSTACK? (EDUCATIONAL PURPOSE) */}
      <div style={{ marginBottom: '64px' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div className="section-tag" style={{ margin: '0 auto 12px' }}>
            <Target size={14} /> Project Mission & Architecture
          </div>
          <h2 style={{ fontSize: '32px', color: '#0F172A', fontWeight: 850 }}>
            Why SkillStack Was Built
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15.5px', maxWidth: '680px', margin: '0 auto', lineHeight: 1.7 }}>
            Learning to code should be active, structured, and friction-free. SkillStack brings theory, practice MCQs, and real code execution into a single unified space.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          {siteConfig.capabilities.map(cap => (
            <div key={cap.id} className="pillar-mini-card" style={{ padding: '28px', background: '#FFFFFF' }}>
              <div className="pillar-icon">
                <Code size={20} color="#7B1C6E" />
              </div>
              <h4 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>{cap.title}</h4>
              <p style={{ fontSize: '13.5px', color: '#64748B', lineHeight: 1.65 }}>{cap.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* TECH STACK & SYSTEM ARCHITECTURE */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '32px',
        border: '1.5px solid rgba(123, 28, 110, 0.14)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04)',
        padding: '38px 32px',
        marginBottom: '64px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div className="section-tag" style={{ margin: '0 auto 12px' }}>
            <Cpu size={14} /> Technology Under The Hood
          </div>
          <h2 style={{ fontSize: '26px', color: '#0F172A', fontWeight: 800 }}>
            How SkillStack is Built
          </h2>
          <p style={{ color: '#64748B', fontSize: '14.5px', maxWidth: '600px', margin: '0 auto' }}>
            Built using modern, battle-tested technologies for speed, reliability, and security.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px'
        }}>
          <div style={{ padding: '20px', borderRadius: '16px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#7B1C6E', textTransform: 'uppercase', marginBottom: '6px' }}>Frontend Layer</div>
            <div style={{ fontWeight: 800, fontSize: '16px', color: '#0F172A', marginBottom: '6px' }}>React.js & Vite</div>
            <div style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.6 }}>Component architecture, responsive vanilla CSS design system, and state management.</div>
          </div>

          <div style={{ padding: '20px', borderRadius: '16px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#16A34A', textTransform: 'uppercase', marginBottom: '6px' }}>Backend API</div>
            <div style={{ fontWeight: 800, fontSize: '16px', color: '#0F172A', marginBottom: '6px' }}>Django REST Framework</div>
            <div style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.6 }}>Python 3 endpoints for curriculum, student topic tracking, submission logs, and auth.</div>
          </div>

          <div style={{ padding: '20px', borderRadius: '16px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#2563EB', textTransform: 'uppercase', marginBottom: '6px' }}>Database Engine</div>
            <div style={{ fontWeight: 800, fontSize: '16px', color: '#0F172A', marginBottom: '6px' }}>PostgreSQL on Supabase</div>
            <div style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.6 }}>Cloud relational database with strict foreign keys, indexing, and image storage.</div>
          </div>

          <div style={{ padding: '20px', borderRadius: '16px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#D97706', textTransform: 'uppercase', marginBottom: '6px' }}>Code Execution</div>
            <div style={{ fontWeight: 800, fontSize: '16px', color: '#0F172A', marginBottom: '6px' }}>Sandboxed Runners</div>
            <div style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.6 }}>Automated stdout and keyword assertions for C & Python practical challenges.</div>
          </div>
        </div>
      </div>

      {/* Call to Action Bar */}
      <div style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 60%, #7B1C6E 100%)',
        borderRadius: '32px',
        padding: '48px 40px',
        color: '#FFFFFF',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="dotted-layer-navy" />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '640px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '14px' }}>
            Start Learning on SkillStack Today
          </h2>
          <p style={{ color: '#CBD5E1', fontSize: '15px', lineHeight: 1.7, marginBottom: '24px' }}>
            Sign in with your phone number and 4-digit PIN to access interactive lessons, quizzes, and compiler lab challenges.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              className="hero-btn btn-primary"
              onClick={() => onNavigate('courses')}
              style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)', color: '#FFFFFF', borderRadius: '9999px', border: 'none' }}
            >
              Explore Course Tracks <ArrowRight size={15} />
            </button>
            <button
              className="hero-btn btn-secondary"
              onClick={() => onNavigate('contact')}
            >
              Connect with Deepan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
