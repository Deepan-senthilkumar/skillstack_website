import React, { useState, useEffect } from 'react';
import {
  MessageSquare, Mail, MapPin, Send, CheckCircle2,
  Clock, Shield, Sparkles, HelpCircle, ArrowRight,
  ExternalLink, Globe
} from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { api } from '../api';

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

export default function ContactPage({ subjects = [] }) {
  const { creator } = siteConfig;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subjectCategory: 'feedback',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

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
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '820px' }}>
          <div className="hero-badge">
            <MessageSquare size={14} color="#FDC029" />
            <span>Developer Connect & Community Feedback</span>
          </div>

          <h1 style={{ fontSize: 'clamp(28px, 3.6vw, 42px)', fontWeight: 850, color: '#FFFFFF', marginBottom: '14px', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
            Get in Touch with{' '}
            <span style={{
              background: 'linear-gradient(135deg, #FDC029 0%, #FB7185 50%, #C084FC 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline'
            }}>
              Deepan S
            </span>
          </h1>

          <p style={{ color: '#94A3B8', fontSize: '15.5px', lineHeight: 1.7, marginBottom: '24px' }}>
            Have feedback on the SkillStack learning experience, found a bug in a compiler sandbox, or want to connect with the developer? Reach out directly using the options below.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div className="catalog-hero-pill-feature">
              <Clock size={15} color="#10B981" /> Direct Developer Response
            </div>
            <div className="catalog-hero-pill-feature">
              <Shield size={15} color="#38BDF8" /> Open Source & Learning Focused
            </div>
          </div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '32px'
      }}>
        {/* Contact Info Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{
            background: '#FFFFFF',
            padding: '32px',
            borderRadius: '28px',
            border: '1.5px solid rgba(124, 58, 237, 0.14)',
            boxShadow: '0 10px 30px -5px rgba(10, 25, 60, 0.06)'
          }}>
            <h3 style={{ fontSize: '19px', fontWeight: 800, marginBottom: '18px', color: '#0F172A' }}>
              Direct Contact Details
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Email */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'rgba(124, 58, 237, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Mail size={18} color="#7C3AED" />
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Email Address</div>
                  <a
                    href={`mailto:${creator.email}`}
                    style={{ fontSize: '15px', fontWeight: 700, color: '#7C3AED', textDecoration: 'none' }}
                  >
                    {creator.email}
                  </a>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>Open for queries, feedback, & collaborations</div>
                </div>
              </div>

              {/* Location */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'rgba(124, 58, 237, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <MapPin size={18} color="#7C3AED" />
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Based In</div>
                  <div style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--text-primary)' }}>{creator.location}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>Software developer & creator</div>
                </div>
              </div>

              {/* Portfolio */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'rgba(124, 58, 237, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Globe size={18} color="#7C3AED" />
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Official Portfolio</div>
                  <a
                    href={creator.portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '14px', fontWeight: 700, color: '#7C3AED', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    portfolio-deepan.vercel.app <ExternalLink size={12} />
                  </a>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>Projects, Flutter apps, & experience</div>
                </div>
              </div>

              {/* Jerry Edits */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'rgba(239, 68, 68, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <YouTubeIcon size={18} color="#EF4444" />
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Creative Channel</div>
                  <a
                    href={creator.jerryEditsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '14px', fontWeight: 700, color: '#D97706', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    jerry-edits.vercel.app <ExternalLink size={12} />
                  </a>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>Tamil video edits & visual creations</div>
                </div>
              </div>
            </div>
          </div>

          {/* Social Profiles Pill Card */}
          <div style={{
            background: '#FFFFFF',
            padding: '24px 28px',
            borderRadius: '24px',
            border: '1.5px solid rgba(124, 58, 237, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '14px',
            flexWrap: 'wrap'
          }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)' }}>Find Deepan Online</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>GitHub & LinkedIn profiles</div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <a
                href={creator.github}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '20px',
                  background: '#F1F5F9',
                  color: '#0F172A',
                  fontSize: '12px',
                  fontWeight: 700,
                  textDecoration: 'none'
                }}
              >
                <GitHubIcon size={14} /> GitHub
              </a>
              <a
                href={creator.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '20px',
                  background: 'rgba(10, 102, 194, 0.08)',
                  color: '#0A66C2',
                  fontSize: '12px',
                  fontWeight: 700,
                  textDecoration: 'none'
                }}
              >
                <LinkedInIcon size={14} /> LinkedIn
              </a>
            </div>
          </div>
        </div>

        {/* Feedback / Message Form */}
        <div style={{
          background: '#FFFFFF',
          padding: '36px 32px',
          borderRadius: '28px',
          border: '1.5px solid rgba(124, 58, 237, 0.14)',
          boxShadow: '0 10px 30px -5px rgba(10, 25, 60, 0.06)'
        }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '40px 10px' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: '#DCFCE7',
                color: '#16A34A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <CheckCircle2 size={32} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
                Thank You for Your Feedback!
              </h3>
              <p style={{ color: '#64748B', fontSize: '14px', lineHeight: 1.6, maxWidth: '400px', margin: '0 auto 24px' }}>
                Your message has been received. You can also send an email directly to <strong>{creator.email}</strong> anytime.
              </p>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setSubmitted(false)}
                style={{ borderRadius: 'var(--radius-full)', padding: '9px 24px', fontSize: '13px' }}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
                Send Feedback or Inquiry
              </h3>
              <p style={{ color: '#64748B', fontSize: '13.5px', marginBottom: '24px' }}>
                Have a recommendation for a new course topic or feedback on the interactive compilers? Let us know below.
              </p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Deepan S"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '12px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Your Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '12px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Message Category
                  </label>
                  <select
                    value={formData.subjectCategory}
                    onChange={(e) => setFormData(prev => ({ ...prev, subjectCategory: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '12px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      outline: 'none',
                      background: '#FFF'
                    }}
                  >
                    <option value="feedback">Course Feedback &amp; Suggestions</option>
                    <option value="compiler">Compiler Sandbox / Bug Report</option>
                    <option value="collab">Developer Collaboration / Tech Chat</option>
                    <option value="general">General Question</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Your Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Write your feedback, questions, or comments here..."
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '12px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      outline: 'none',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  style={{
                    padding: '12px',
                    borderRadius: 'var(--radius-full)',
                    background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    fontSize: '14px',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    marginTop: '4px'
                  }}
                >
                  <Send size={15} /> Send Message to Developer
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
