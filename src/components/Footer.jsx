import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import BrandLogo from './BrandLogo';
import { siteConfig } from '../config/siteConfig';

export default function Footer({ onNavigate, onOpenStudentAuth, onOpenStaffAuth }) {
  return (
    <footer className="home-footer">
      <div className="watermark-tech-grid" />
      <div className="section-container">
        <div className="footer-grid">
          <div className="footer-col brand-col">
            <div style={{ marginBottom: '16px' }}>
              <BrandLogo size={36} showText={true} variant="light" />
            </div>
            <p style={{ fontSize: '13.5px', color: '#64748B', lineHeight: 1.7, maxWidth: '340px' }}>
              {siteConfig.brand.description}
            </p>
            <div style={{ marginTop: '16px', fontSize: '11.5px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', flexShrink: 0 }} />
              <span>{siteConfig.brand.status}</span>
            </div>
          </div>

          <div className="footer-col">
            <h4>Academic Navigation</h4>
            <ul className="footer-links">
              <li><button onClick={() => onNavigate('home')}>Institute Home</button></li>
              <li><button onClick={() => onNavigate('courses')}>Curriculum & Tracks</button></li>
              <li><button onClick={() => onNavigate('about')}>Governance & Faculty</button></li>
              <li><button onClick={() => onNavigate('contact')}>Admissions & Inquiries</button></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Engineering Portals</h4>
            <ul className="footer-links">
              <li><button onClick={() => onOpenStudentAuth && onOpenStudentAuth(false)}>Fellow Portal Login</button></li>
              <li><button onClick={() => onOpenStudentAuth && onOpenStudentAuth(true)}>New Fellow Enrollment</button></li>
              <li><button onClick={() => onOpenStaffAuth && onOpenStaffAuth()}>Faculty Command Center</button></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Admissions & Operations Desk</h4>
            <div style={{ fontSize: '13px', color: '#64748B', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={14} color="#7B1C6E" style={{ flexShrink: 0 }} />
                <span style={{ wordBreak: 'break-all' }}>{siteConfig.contact.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={14} color="#7B1C6E" style={{ flexShrink: 0 }} />
                <span>{siteConfig.contact.phone}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <MapPin size={14} color="#7B1C6E" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span>{siteConfig.contact.campus}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div>&copy; {new Date().getFullYear()} {siteConfig.brand.fullName}. All institutional rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}
