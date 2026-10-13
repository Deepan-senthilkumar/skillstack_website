import React, { useEffect } from 'react';
import { Shield, Lock, Eye, FileText, ArrowLeft, CheckCircle2, Globe, Server } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

export default function PrivacyPolicyPage({ onNavigate }) {
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
            background: 'rgba(123, 28, 110, 0.08)',
            color: '#7B1C6E',
            padding: '4px 12px',
            borderRadius: '999px',
            fontSize: '12px',
            fontWeight: 800,
            marginBottom: '14px',
            letterSpacing: '0.04em'
          }}>
            <Shield size={14} />
            <span>LEGAL &amp; COMPLIANCE DISCLOSURE</span>
          </div>

          <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#0F172A', margin: '0 0 10px', lineHeight: 1.25 }}>
            Privacy Policy &amp; Cookie Disclosure
          </h1>

          <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
            Last Updated: <strong>October 13, 2026</strong> &bull; Effective for all learners, visitors, and users of <strong>{siteConfig.brand.name}</strong>.
          </p>
        </div>

        {/* Policy Body */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '24px',
          padding: '40px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
          display: 'flex',
          flexDirection: 'column',
          gap: '32px',
          fontSize: '14.5px',
          color: '#334155',
          lineHeight: 1.7
        }}>
          {/* Section 1 */}
          <section>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={20} color="#7B1C6E" />
              <span>1. Introduction &amp; Scope</span>
            </h2>
            <p>
              Welcome to <strong>{siteConfig.brand.name}</strong> (accessible from our website domain). At {siteConfig.brand.name}, we prioritize the privacy of our visitors. This Privacy Policy document outlines the types of information collected and recorded by {siteConfig.brand.name} and how we utilize it in compliance with global standards, including the General Data Protection Regulation (GDPR), California Consumer Privacy Act (CCPA), and Google AdSense Publisher Policies.
            </p>
          </section>

          {/* Section 2 - GOOGLE ADSENSE DISCLOSURE (CRUCIAL FOR APPROVAL) */}
          <section style={{
            background: 'linear-gradient(135deg, rgba(123, 28, 110, 0.04) 0%, rgba(253, 192, 41, 0.06) 100%)',
            border: '1.5px solid rgba(123, 28, 110, 0.2)',
            borderRadius: '16px',
            padding: '24px 28px'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#7B1C6E', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Globe size={20} color="#7B1C6E" />
              <span>2. Google AdSense &amp; Third-Party Advertising Partners</span>
            </h2>
            <p style={{ fontWeight: 600, color: '#0F172A' }}>
              Please review the following essential disclosures regarding advertisements served on this website:
            </p>
            <ul style={{ paddingLeft: '22px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>
                <strong>Third-Party Vendors &amp; Cookies:</strong> Third-party vendors, including <strong>Google</strong>, use cookies to serve ads based on a user's prior visits to our website or other websites on the Internet.
              </li>
              <li>
                <strong>Google's DoubleClick DART Cookie:</strong> Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visits to {siteConfig.brand.name} and/or other sites on the Internet.
              </li>
              <li>
                <strong>Opting Out of Personalized Advertising:</strong> Users may opt out of personalized advertising by visiting Google's <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#7B1C6E', fontWeight: 700 }}>Ads Settings</a>. Alternatively, users can opt out of a third-party vendor's use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" style={{ color: '#7B1C6E', fontWeight: 700 }}>www.aboutads.info</a>.
              </li>
              <li>
                <strong>Ad Network Technologies:</strong> Third-party ad servers or ad networks use technologies like cookies, JavaScript, or Web Beacons in their respective advertisements and links that appear on {siteConfig.brand.name}, which are sent directly to users' browsers. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see.
              </li>
              <li>
                <strong>Control:</strong> Note that {siteConfig.brand.name} has no access to or control over these cookies that are used by third-party advertisers.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Server size={20} color="#7B1C6E" />
              <span>3. Log Files &amp; Web Analytics</span>
            </h2>
            <p>
              Like most standard website operators, {siteConfig.brand.name} follows standard log file routines. These logs record visitors when they access pages. Information gathered by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date/time stamps, referring/exit pages, and number of clicks. This data is not linked to any personally identifiable information and is used solely for analyzing trends, administering the site, tracking user movement on the website, and gathering demographic information.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lock size={20} color="#7B1C6E" />
              <span>4. Student Accounts &amp; Data Security</span>
            </h2>
            <p>
              When students create an account to access our interactive code playground, curriculum tracks, or quizzes, we securely store their name, email address, password hash, code submissions, and quiz completion records. We employ strict enterprise encryption (HTTPS / SSL and bcrypt password hashing) to ensure that student records remain confidential and secure. We never sell, rent, or trade your personal data to third parties.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Eye size={20} color="#7B1C6E" />
              <span>5. GDPR &amp; CCPA Privacy Rights</span>
            </h2>
            <p>
              Under data protection regulations, you are entitled to the following rights:
            </p>
            <ul style={{ paddingLeft: '22px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><strong>Right to Access:</strong> You have the right to request copies of your personal data.</li>
              <li><strong>Right to Rectification:</strong> You have the right to request correction of inaccurate or incomplete information.</li>
              <li><strong>Right to Erasure:</strong> You have the right to request that we erase your personal data under certain conditions.</li>
              <li><strong>Right to Restrict Processing:</strong> You have the right to request restriction of the processing of your personal data.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section style={{ borderTop: '1px solid #E2E8F0', paddingTop: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
              6. Contacting the Site Administrator
            </h2>
            <p style={{ margin: 0 }}>
              If you have additional questions or require more information about our Privacy Policy or cookie usage, please contact our Lead Trainer and Administrator, <strong>{siteConfig.creator.name}</strong>, via email at <a href={`mailto:${siteConfig.creator.email}`} style={{ color: '#7B1C6E', fontWeight: 700 }}>{siteConfig.creator.email}</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
