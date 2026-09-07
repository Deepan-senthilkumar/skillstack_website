import React from 'react';
import {
  Sparkles, Award, Users, BookOpen, Shield, Code, Cpu, Target,
  CheckCircle2, ArrowRight, Compass, HeartHandshake, Layers,
  ExternalLink, GraduationCap, Building, Briefcase
} from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

export default function AboutPage({ onNavigate }) {
  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '36px 24px 80px', position: 'relative' }}>
      {/* Decorative Ambient Background Blobs */}
      <div className="curvy-floating-orb orb-blue" style={{ top: '60px', left: '-50px', width: '380px', height: '380px' }} />
      <div className="curvy-floating-orb orb-cyan" style={{ top: '240px', right: '-60px', width: '340px', height: '340px' }} />

      {/* CURVY & DOTTED HERO BANNER (Pure Light Theme) */}
      <div className="catalog-hero-banner" style={{
        background: 'linear-gradient(135deg, #F0F7FF 0%, #E0EFFF 50%, #FFFFFF 100%)',
        border: '1.5px solid rgba(0, 102, 255, 0.16)',
        boxShadow: '0 16px 40px rgba(0, 60, 160, 0.08)'
      }}>
        <div className="watermark-tech-grid" />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '820px' }}>
          <div className="hero-badge" style={{ marginBottom: '16px' }}>
            <Sparkles size={14} color="#0066FF" />
            <span>Institutional Governance & Faculty</span>
          </div>

          <h1 style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 800, color: '#0A192F', marginBottom: '16px', lineHeight: 1.2 }}>
            Pioneering the Future of{' '}
            <span className="hero-gradient-text">
              Production Systems Engineering
            </span>
          </h1>

          <p style={{ color: '#334155', fontSize: '15.5px', lineHeight: 1.75, marginBottom: '24px' }}>
            {siteConfig.brand.fullName} was founded to establish a rigorous, production-grade standard for full-stack software architects through dual-language cognitive mental models, visual systems topology, and instant automated code verification.
          </p>

          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#0066FF', fontWeight: 700 }}>
              <CheckCircle2 size={16} color="#0066FF" /> {siteConfig.metrics.seniorFacultyCount} Senior Domain Chairs
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#0066FF', fontWeight: 700 }}>
              <CheckCircle2 size={16} color="#0066FF" /> Industry Architectural Standards
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#0066FF', fontWeight: 700 }}>
              <CheckCircle2 size={16} color="#0066FF" /> Automated Code Harness Benchmarking
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Vision Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '28px',
        marginBottom: '64px'
      }}>
        <div style={{
          background: '#FFFFFF',
          padding: '38px 32px',
          borderRadius: '28px',
          border: '1.5px solid rgba(0, 102, 255, 0.14)',
          boxShadow: '0 10px 30px -5px rgba(10, 25, 60, 0.06)'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '16px',
            background: 'rgba(0, 102, 255, 0.08)',
            color: 'var(--blue-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px'
          }}>
            <Target size={24} color="#0066FF" />
          </div>
          <h2 style={{ fontSize: '22px', marginBottom: '12px', color: '#0F172A', fontWeight: 800 }}>Institutional Mission</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14.5px', lineHeight: 1.75 }}>
            To bridge the divide between theoretical computer science curricula and high-throughput production engineering by providing a zero-fluff, hands-on apprenticeship model with sub-second automated verification and structured faculty supervision.
          </p>
        </div>

        <div style={{
          background: '#FFFFFF',
          padding: '38px 32px',
          borderRadius: '28px',
          border: '1.5px solid rgba(0, 102, 255, 0.14)',
          boxShadow: '0 10px 30px -5px rgba(10, 25, 60, 0.06)'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '16px',
            background: 'rgba(0, 229, 255, 0.1)',
            color: '#0284C7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px'
          }}>
            <Compass size={24} color="#0284C7" />
          </div>
          <h2 style={{ fontSize: '22px', marginBottom: '12px', color: '#0F172A', fontWeight: 800 }}>Architectural Vision</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14.5px', lineHeight: 1.75 }}>
            To empower thousands of aspiring software engineers across India and globally with world-class intuition for distributed microservices, clean architectural paradigms, relational database internals, and enterprise cloud operations.
          </p>
        </div>
      </div>

      {/* Strategic Pedagogical Capabilities */}
      <div style={{ marginBottom: '64px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div className="section-tag" style={{ margin: '0 auto 12px' }}>
            <Award size={14} /> Academic Philosophy
          </div>
          <h2 style={{ fontSize: '30px', color: '#0F172A', fontWeight: 800 }}>Core Pillars of the Nexura Curriculum</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', maxWidth: '640px', margin: '0 auto' }}>
            Built around four interlocking principles designed to develop complete computational fluency.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '24px'
        }}>
          {siteConfig.capabilities.map(cap => (
            <div key={cap.id} className="pillar-mini-card" style={{ padding: '28px' }}>
              <div className="pillar-icon">
                <Code size={20} color="#0066FF" />
              </div>
              <h4 style={{ fontSize: '17px' }}>{cap.title}</h4>
              <p>{cap.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* DYNAMIC FACULTY ROSTER (All 10 Domain Specialists) */}
      <div style={{ marginBottom: '64px' }}>
        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
          <div className="section-tag" style={{ margin: '0 auto 12px' }}>
            <Users size={14} /> Faculty Senate & Chairs
          </div>
          <h2 style={{ fontSize: '32px', color: '#0F172A', fontWeight: 800, marginBottom: '10px' }}>
            Meet the 10 Senior Engineering Domain Chairs
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', maxWidth: '680px', margin: '0 auto' }}>
            Each curriculum track is led by a domain specialist. Faculty members actively design practical problem workbenches, review automated evaluation assertions, and host weekly office hours.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          {siteConfig.faculty.map(fac => (
            <div
              key={fac.id}
              style={{
                background: '#FFFFFF',
                borderRadius: '24px',
                border: '1.5px solid rgba(0, 102, 255, 0.12)',
                padding: '28px 24px',
                boxShadow: '0 8px 24px rgba(10, 25, 60, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.25s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = '#0066FF';
                e.currentTarget.style.boxShadow = '0 16px 36px rgba(0, 102, 255, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(0, 102, 255, 0.12)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(10, 25, 60, 0.05)';
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, rgba(0, 102, 255, 0.1) 0%, rgba(0, 229, 255, 0.15) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0066FF',
                    fontWeight: 800,
                    fontSize: '15px'
                  }}>
                    {fac.name.split(' ')[1]?.[0] || 'F'}
                  </div>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(0, 102, 255, 0.08)',
                    color: '#0066FF',
                    border: '1px solid rgba(0, 102, 255, 0.2)'
                  }}>
                    {fac.tag}
                  </span>
                </div>

                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
                  {fac.name}
                </h3>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0066FF', marginBottom: '8px' }}>
                  {fac.role}
                </div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
                  {fac.domain}
                </div>
              </div>

              <div style={{
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '12px',
                fontSize: '11.5px',
                color: 'var(--text-tertiary)',
                fontWeight: 600
              }}>
                🎓 {fac.credentials}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action Bar */}
      <div style={{
        background: 'linear-gradient(135deg, #060D24 0%, #0B193C 60%, #0052CC 100%)',
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
            Ready to Begin Your Engineering Apprenticeship?
          </h2>
          <p style={{ color: '#CBD5E1', fontSize: '15px', lineHeight: 1.7, marginBottom: '24px' }}>
            Enroll with a simple mobile number and 4-digit security PIN. Immediately access our interactive problem workbenches and curriculum tracks.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              className="hero-btn btn-primary"
              onClick={() => onNavigate('courses')}
              style={{ background: 'linear-gradient(135deg, #00E5FF 0%, #0066FF 100%)', color: '#FFFFFF' }}
            >
              Explore Curriculum Tracks <ArrowRight size={15} />
            </button>
            <button
              className="hero-btn btn-secondary"
              onClick={() => onNavigate('contact')}
            >
              Contact Admissions Desk
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
