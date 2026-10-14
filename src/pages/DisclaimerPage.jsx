import React, { useEffect } from 'react';
import { AlertTriangle, ArrowLeft, ShieldCheck, CheckCircle2, ExternalLink } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

export default function DisclaimerPage({ onNavigate }) {
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
            color: '#7B1C6E',
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
          border: '1.5px solid rgba(123, 28, 110, 0.14)',
          borderRadius: '24px',
          padding: '36px 40px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.04)',
          marginBottom: '32px'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(217, 119, 6, 0.08)',
            color: '#B45309',
            padding: '4px 12px',
            borderRadius: '999px',
            fontSize: '12px',
            fontWeight: 800,
            marginBottom: '14px',
            letterSpacing: '0.04em'
          }}>
            <AlertTriangle size={14} />
            <span>DISCLAIMER NOTICE</span>
          </div>

          <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#0F172A', margin: '0 0 10px', lineHeight: 1.25 }}>
            Legal &amp; Educational Disclaimer
          </h1>

          <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
            Important notices regarding code executions, third-party software, and educational references on <strong>{siteConfig.brand.name}</strong>.
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
              1. Educational Purpose Only
            </h2>
            <p>
              The information and interactive curriculum provided on <strong>{siteConfig.brand.name}</strong> is strictly for general educational and skill-building purposes. All code snippets, architecture diagrams, and problem exercises are created by <strong>{siteConfig.creator.name}</strong> to illustrate software engineering patterns.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '19px', fontWeight: 800, color: '#0F172A', marginBottom: '10px' }}>
              2. No Financial, Legal, or Certified Professional Advice
            </h2>
            <p>
              While {siteConfig.brand.name} issues internal course completion certificates to learners who pass the required tests, these certificates represent personal platform milestones and do not constitute university academic degrees or statutory engineering licenses.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '19px', fontWeight: 800, color: '#0F172A', marginBottom: '10px' }}>
              3. External Links &amp; Third-Party Resources
            </h2>
            <p>
              {siteConfig.brand.name} may contain links to external websites that are not provided or maintained by or in any way affiliated with us (including GitHub, compiler documentations, and technology vendor pages). Please note that we do not guarantee the accuracy, relevance, timeliness, or completeness of any information on these external websites.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '19px', fontWeight: 800, color: '#0F172A', marginBottom: '10px' }}>
              4. Fair Use &amp; Trademarks
            </h2>
            <p>
              All trademarks, product names, logos, and brands mentioned (such as Python, Java, C, C++, Dart, Django, React, PostgreSQL) are property of their respective owners and are referenced solely for descriptive, educational identification under Fair Use principles.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
