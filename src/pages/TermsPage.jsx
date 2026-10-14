import React, { useEffect } from 'react';
import { FileText, ArrowLeft, ShieldCheck, AlertCircle, BookOpen, UserCheck } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

export default function TermsPage({ onNavigate }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div style={{
      background: 'linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)',
      minHeight: '100vh',
      padding: '40px 20px 80px',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{ maxWidth: '880px', margin: '0 auto' }}>
        {/* Back Link */}
        <button
          onClick={() => onNavigate && onNavigate('home')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'none',
            border: 'none',
            color: '#7C3AED',
            fontSize: '13.5px',
            fontWeight: 700,
            cursor: 'pointer',
            padding: '8px 0',
            marginBottom: '20px'
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </button>

        {/* Hero Card */}
        <div style={{
          background: '#FFFFFF',
          border: '1.5px solid rgba(124, 58, 237, 0.14)',
          borderRadius: '24px',
          padding: '36px 40px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.04)',
          marginBottom: '32px'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(124, 58, 237, 0.08)',
            color: '#7C3AED',
            padding: '4px 12px',
            borderRadius: '999px',
            fontSize: '12px',
            fontWeight: 800,
            marginBottom: '14px',
            letterSpacing: '0.04em'
          }}>
            <ShieldCheck size={14} />
            <span>TERMS OF SERVICE</span>
          </div>

          <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#0F172A', margin: '0 0 10px', lineHeight: 1.25 }}>
            Terms &amp; Conditions of Use
          </h1>

          <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
            Last Updated: <strong>October 13, 2026</strong> &bull; Governing all use of <strong>{siteConfig.brand.name}</strong> interactive learning platform.
          </p>
        </div>

        {/* Content Body */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '24px',
          padding: '40px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
          display: 'flex',
          flexDirection: 'column',
          gap: '28px',
          fontSize: '14.5px',
          color: '#334155',
          lineHeight: 1.7
        }}>
          <section>
            <h2 style={{ fontSize: '19px', fontWeight: 800, color: '#0F172A', marginBottom: '10px' }}>
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using <strong>{siteConfig.brand.name}</strong>, you agree to be bound by these Terms of Service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '19px', fontWeight: 800, color: '#0F172A', marginBottom: '10px' }}>
              2. Educational Use License
            </h2>
            <p>
              Permission is granted to view the curriculum, study notes, code examples, architecture diagrams, and execute code problems on {siteConfig.brand.name} for personal, non-commercial educational purposes only. You may not:
            </p>
            <ul style={{ paddingLeft: '22px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li>Modify or copy source material for commercial resale without prior written authorization;</li>
              <li>Attempt to decompile or reverse engineer any sandbox or evaluation backend infrastructure;</li>
              <li>Remove any copyright or proprietary notations from curriculum documents;</li>
              <li>Engage in automated scraping or denial-of-service activities against the server endpoints.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '19px', fontWeight: 800, color: '#0F172A', marginBottom: '10px' }}>
              3. Student Code Submissions &amp; Conduct
            </h2>
            <p>
              Students are solely responsible for code executed within our practical sandbox. While our compilers run inside secure execution containers, you agree not to submit malicious scripts, worms, virus routines, or attempt unauthorized port scanning.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '19px', fontWeight: 800, color: '#0F172A', marginBottom: '10px' }}>
              4. Disclaimer of Warranties
            </h2>
            <p>
              The materials on {siteConfig.brand.name} are provided on an 'as is' basis. {siteConfig.brand.name} makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '19px', fontWeight: 800, color: '#0F172A', marginBottom: '10px' }}>
              5. Governing Law &amp; Contact
            </h2>
            <p>
              These terms are governed by and construed in accordance with the laws of India. For any legal inquiries, contact <strong>{siteConfig.creator.name}</strong> at <a href={`mailto:${siteConfig.creator.email}`} style={{ color: '#7C3AED', fontWeight: 700 }}>{siteConfig.creator.email}</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
