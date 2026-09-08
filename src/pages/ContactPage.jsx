import React, { useState } from 'react';
import {
  MessageSquare, Mail, Phone, MapPin, Send, CheckCircle2,
  Clock, Shield, Sparkles, HelpCircle, ArrowRight
} from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subjectTrack: 'django-fullstack',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

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
            <MessageSquare size={14} color="#0066FF" />
            <span>Admissions & Academic Support Desk</span>
          </div>

          <h1 style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 800, color: '#0A192F', marginBottom: '14px', lineHeight: 1.2 }}>
            Direct Communications with the{' '}
            <span className="hero-gradient-text">
              Academic Operations Senate
            </span>
          </h1>

          <p style={{ color: '#334155', fontSize: '15.5px', lineHeight: 1.7, marginBottom: '24px' }}>
            Have questions regarding admissions, domain faculty office hours, automated assertion evaluation criteria, or enterprise team sponsorships? Submit an inquiry to our operations team below.
          </p>

          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#0066FF', fontWeight: 700 }}>
              <Clock size={16} color="#0066FF" /> 24-Hour SLA Response Time
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#0066FF', fontWeight: 700 }}>
              <Shield size={16} color="#0066FF" /> Dedicated Faculty Admissions Chair
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
            border: '1.5px solid rgba(0, 102, 255, 0.14)',
            boxShadow: '0 10px 30px -5px rgba(10, 25, 60, 0.06)'
          }}>
            <h3 style={{ fontSize: '19px', fontWeight: 800, marginBottom: '18px', color: '#0F172A' }}>
              Institutional Contact Channels
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'rgba(0, 102, 255, 0.08)',
                  color: 'var(--blue-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Mail size={18} color="#0066FF" />
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Official Admissions Email</div>
                  <div style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--text-primary)' }}>{siteConfig.contact.email}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Faculty queries: {siteConfig.contact.facultyDesk}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'rgba(0, 102, 255, 0.08)',
                  color: 'var(--blue-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Phone size={18} color="#0066FF" />
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Admissions Direct Line</div>
                  <div style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--text-primary)' }}>{siteConfig.contact.phone}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Toll-Free Assistance: {siteConfig.contact.tollFree}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'rgba(0, 102, 255, 0.08)',
                  color: 'var(--blue-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <MapPin size={18} color="#0066FF" />
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Academic Campus</div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.5 }}>
                    {siteConfig.contact.campus}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Operational Hours */}
          <div style={{
            background: '#FFFFFF',
            padding: '24px 28px',
            borderRadius: '24px',
            border: '1.5px solid rgba(0, 102, 255, 0.12)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px'
          }}>
            <Clock size={22} color="#0066FF" />
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary)' }}>Operational Timings</div>
              <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>{siteConfig.contact.workingHours}</div>
            </div>
          </div>
        </div>

        {/* Inquiry Form */}
        <div style={{
          background: '#FFFFFF',
          padding: '36px',
          borderRadius: '28px',
          border: '1.5px solid rgba(0, 102, 255, 0.14)',
          boxShadow: '0 10px 30px -5px rgba(10, 25, 60, 0.06)'
        }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'rgba(22, 163, 74, 0.12)',
                color: '#16A34A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <CheckCircle2 size={32} />
              </div>
              <h3 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '8px', color: '#0F172A' }}>Inquiry Registered</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
                Thank you for contacting SkillStack. An academic advisor has been assigned and will reach out via email or phone within 24 hours.
              </p>
              <button
                className="btn-secondary"
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', email: '', phone: '', subjectTrack: 'django-fullstack', message: '' });
                }}
                style={{ borderRadius: 'var(--radius-full)' }}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>
                Submit Academic Inquiry
              </h3>
              <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                Complete the form below to receive syllabus breakdowns and admissions consultation.
              </p>

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anand Kumar"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '12px',
                    border: '1.5px solid var(--border-medium)',
                    fontSize: '13.5px',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '12px',
                      border: '1.5px solid var(--border-medium)',
                      fontSize: '13.5px',
                      outline: 'none'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '12px',
                      border: '1.5px solid var(--border-medium)',
                      fontSize: '13.5px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Target Curriculum Track
                </label>
                <select
                  value={formData.subjectTrack}
                  onChange={(e) => setFormData({ ...formData, subjectTrack: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '12px',
                    border: '1.5px solid var(--border-medium)',
                    fontSize: '13.5px',
                    outline: 'none',
                    background: '#FFFFFF'
                  }}
                >
                  <option value="django-fullstack">Distributed Python & Django Systems</option>
                  <option value="python-core">Core Python & Algorithmic Foundations</option>
                  <option value="drf-microservices">REST APIs & Distributed Microservices</option>
                  <option value="general">General Admissions & Fellowship Inquiries</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Inquiry Message or Career Background *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your current technical background and academic objectives..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '12px',
                    border: '1.5px solid var(--border-medium)',
                    fontSize: '13.5px',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{
                  padding: '13px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '14px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  border: 'none',
                  background: 'linear-gradient(135deg, #00E5FF 0%, #0066FF 100%)',
                  color: '#FFFFFF',
                  boxShadow: '0 4px 14px var(--blue-glow)',
                  marginTop: '8px'
                }}
              >
                <Send size={16} /> Submit Inquiry to Admissions Desk
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
