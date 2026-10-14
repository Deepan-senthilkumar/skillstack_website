import React from 'react';
import { Mail, MapPin, ExternalLink, Globe, Heart, Shield } from 'lucide-react';
import BrandLogo from './BrandLogo';
import { siteConfig } from '../config/siteConfig';

export default function Footer({ onNavigate, onOpenStudentAuth, onOpenStaffAuth }) {
  return (
    <footer className="home-footer">
      <div className="watermark-tech-grid" />
      <div className="section-container">
        <div className="footer-grid">
          {/* Brand & Creator Bio */}
          <div className="footer-col brand-col">
            <div style={{ marginBottom: '16px' }}>
              <BrandLogo size={36} showText={true} variant="light" />
            </div>
            <p style={{ fontSize: '13.5px', color: '#64748B', lineHeight: 1.7, maxWidth: '340px' }}>
              An interactive learning project engineered by <strong>{siteConfig.creator.name}</strong> to make programming fundamentals, hands-on compilers, and software engineering accessible to everyone.
            </p>
            <div style={{ marginTop: '16px', fontSize: '12px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', flexShrink: 0 }} />
              <span>{siteConfig.brand.status}</span>
            </div>
          </div>

          {/* Platform Navigation */}
          <div className="footer-col">
            <h4>Explore Platform</h4>
            <ul className="footer-links">
              <li><button onClick={() => onNavigate('home')}>Home</button></li>
              <li><button onClick={() => onNavigate('courses')}>Curriculum & Tracks</button></li>
              <li><button onClick={() => onNavigate('about')}>About Creator & Project</button></li>
              <li><button onClick={() => onNavigate('contact')}>Get In Touch</button></li>
              <li><button onClick={() => onNavigate('privacy-policy')}>Privacy Policy</button></li>
              <li><button onClick={() => onNavigate('terms')}>Terms of Service</button></li>
            </ul>
          </div>

          {/* Student & Learning Portals */}
          <div className="footer-col">
            <h4>Learning Access</h4>
            <ul className="footer-links">
              <li><button onClick={() => onOpenStudentAuth && onOpenStudentAuth(false)}>Student Sign In</button></li>
              <li><button onClick={() => onOpenStudentAuth && onOpenStudentAuth(true)}>New Student Registration</button></li>
              <li><button onClick={() => onOpenStaffAuth && onOpenStaffAuth()}>Instructor & Admin Portal</button></li>
            </ul>
          </div>

          {/* Creator & Connect */}
          <div className="footer-col">
            <h4>Creator & Contact</h4>
            <div style={{ fontSize: '13px', color: '#64748B', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={14} color="#7C3AED" style={{ flexShrink: 0 }} />
                <a
                  href={`mailto:${siteConfig.creator.email}`}
                  style={{ color: '#0F172A', fontWeight: 600, textDecoration: 'none' }}
                >
                  {siteConfig.creator.email}
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MapPin size={14} color="#7C3AED" style={{ flexShrink: 0 }} />
                <span>{siteConfig.creator.location}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                <Globe size={14} color="#7C3AED" style={{ flexShrink: 0 }} />
                <a
                  href={siteConfig.creator.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#7C3AED', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  Deepan's Portfolio <ExternalLink size={12} />
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ExternalLink size={14} color="#7C3AED" style={{ flexShrink: 0 }} />
                <a
                  href={siteConfig.creator.jerryEditsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#D97706', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  Jerry Edits Channel <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span>&copy; {new Date().getFullYear()} {siteConfig.brand.name}. Crafted with</span>
            <Heart size={14} color="#EF4444" fill="#EF4444" />
            <span>by <strong>{siteConfig.creator.name}</strong> ({siteConfig.creator.role}).</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', marginTop: '10px', fontSize: '12px', flexWrap: 'wrap' }}>
            <button onClick={() => onNavigate('privacy-policy')} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>
              Privacy Policy &amp; Cookies
            </button>
            <span style={{ color: '#CBD5E1' }}>&bull;</span>
            <button onClick={() => onNavigate('terms')} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>
              Terms of Service
            </button>
            <span style={{ color: '#CBD5E1' }}>&bull;</span>
            <button onClick={() => onNavigate('disclaimer')} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>
              Educational Disclaimer
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
