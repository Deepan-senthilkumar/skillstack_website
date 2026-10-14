import React, { useRef } from 'react';
import { Award, CheckCircle2, Download, Printer, Share2, X, Shield, Calendar, BookOpen, UserCheck, Sparkles } from 'lucide-react';

export default function CertificateModal({ certificate, onClose }) {
  if (!certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = certificate.issued_at
    ? new Date(certificate.issued_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

  const studentName = certificate.student_name || certificate.student_name_display || 'Student Fellow';
  const courseName = certificate.course_name || certificate.course_name_display || 'C Programming Masterclass';
  const certId = certificate.certificate_id || 'CERT-SKILLSTACK-C-2026-LIVE';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        overflowY: 'auto'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '920px',
          background: '#FFFFFF',
          borderRadius: '24px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.4)',
          overflow: 'hidden',
          position: 'relative',
          animation: 'fadeIn 0.3s ease'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Action Toolbar (Hidden in Print) */}
        <div
          className="no-print"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 24px',
            background: '#F8FAFC',
            borderBottom: '1px solid #E2E8F0'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={20} color="#7C3AED" />
            <span style={{ fontWeight: 800, fontSize: '15px', color: '#0F172A' }}>
              Official Course Completion Certificate
            </span>
            <span style={{
              fontSize: '11px',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '999px',
              background: '#DCFCE7',
              color: '#166534',
              border: '1px solid #16A34A'
            }}>
              ✓ Verified Credential
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={handlePrint}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 16px',
                borderRadius: '999px',
                background: '#7C3AED',
                color: '#FFFFFF',
                border: 'none',
                fontWeight: 700,
                fontSize: '12.5px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(124, 58, 237, 0.25)'
              }}
            >
              <Printer size={14} /> Print / Save PDF
            </button>

            <button
              onClick={onClose}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#FFFFFF',
                border: '1px solid #CBD5E1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#64748B'
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* PRINTABLE CERTIFICATE CANVAS */}
        <div
          id="printable-certificate"
          style={{
            padding: '44px 50px',
            background: 'linear-gradient(145deg, #FFFCF7 0%, #FFFFFF 50%, #FFFDF9 100%)',
            position: 'relative',
            border: '12px solid #FFFFFF',
            boxShadow: 'inset 0 0 0 2px #E2C974, inset 0 0 0 6px #FFFFFF, inset 0 0 0 8px #E2C974',
            margin: '12px',
            borderRadius: '16px',
            textAlign: 'center',
            fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
          }}
        >
          {/* Subtle Guilloché Watermark Background */}
          <div style={{
            position: 'absolute',
            inset: '20px',
            border: '1px dashed rgba(226, 201, 116, 0.45)',
            pointerEvents: 'none',
            borderRadius: '10px'
          }} />

          {/* Certificate Header Lockup */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                fontWeight: 900,
                fontSize: '22px',
                boxShadow: '0 6px 16px rgba(124, 58, 237, 0.25)'
              }}>
                ⚡
              </div>
              <span style={{
                fontSize: '18px',
                fontWeight: 900,
                letterSpacing: '0.12em',
                color: '#1E293B',
                textTransform: 'uppercase'
              }}>
                SkillStack Academy
              </span>
            </div>

            <div style={{
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#94A3B8'
            }}>
              Advanced Software Engineering &bull; Center of Excellence
            </div>
          </div>

          {/* Title */}
          <div style={{ margin: '22px 0 16px' }}>
            <span style={{
              display: 'inline-block',
              padding: '6px 20px',
              borderRadius: '999px',
              background: 'linear-gradient(90deg, rgba(226, 201, 116, 0.18), rgba(124, 58, 237, 0.12), rgba(226, 201, 116, 0.18))',
              color: '#7C3AED',
              fontSize: '12px',
              fontWeight: 800,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              border: '1px solid rgba(226, 201, 116, 0.5)'
            }}>
              Certificate of Completion &amp; Mastery
            </span>
          </div>

          <p style={{
            fontSize: '14px',
            color: '#64748B',
            fontStyle: 'italic',
            margin: '0 0 14px'
          }}>
            This is proudly and formally conferred upon
          </p>

          {/* Student Name */}
          <h1 style={{
            fontSize: '34px',
            fontWeight: 900,
            color: '#0F172A',
            margin: '0 0 16px',
            letterSpacing: '-0.02em',
            borderBottom: '2px solid #E2C974',
            display: 'inline-block',
            paddingBottom: '6px',
            minWidth: '280px'
          }}>
            {studentName}
          </h1>

          {/* Award Text */}
          <p style={{
            fontSize: '14.5px',
            color: '#475569',
            lineHeight: 1.7,
            maxWidth: '620px',
            margin: '0 auto 24px'
          }}>
            for demonstrating verified technical competency, solving all mandatory hands-on practical compilation challenges, and scoring exemplary mastery across all modules in
          </p>

          {/* Course Name */}
          <div style={{
            display: 'inline-block',
            padding: '10px 28px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.08) 0%, rgba(253, 192, 41, 0.1) 100%)',
            border: '1.5px solid rgba(124, 58, 237, 0.2)',
            marginBottom: '32px'
          }}>
            <h2 style={{
              fontSize: '22px',
              fontWeight: 850,
              color: '#7C3AED',
              margin: 0,
              letterSpacing: '-0.01em'
            }}>
              {courseName}
            </h2>
          </div>

          {/* Metadata Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
            maxWidth: '640px',
            margin: '0 auto 36px',
            padding: '16px',
            background: '#F8FAFC',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            textAlign: 'left'
          }}>
            <div>
              <div style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase' }}>Issue Date</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#1E293B', marginTop: '2px' }}>{formattedDate}</div>
            </div>

            <div>
              <div style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase' }}>Credential ID</div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#7C3AED', marginTop: '2px', fontFamily: 'monospace' }}>
                {certId}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase' }}>Grade / Status</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#16A34A', marginTop: '2px' }}>
                100% Mastery (Pass)
              </div>
            </div>
          </div>

          {/* Signatures & Seal */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            paddingTop: '16px',
            borderTop: '1px solid #E2E8F0',
            maxWidth: '680px',
            margin: '0 auto'
          }}>
            {/* Signature 1 */}
            <div style={{ textAlign: 'center', width: '180px' }}>
              <div style={{
                fontFamily: "'Brush Script MT', cursive, sans-serif",
                fontSize: '24px',
                color: '#1E293B',
                marginBottom: '4px'
              }}>
                Deepan M.
              </div>
              <div style={{ width: '100%', height: '1px', background: '#CBD5E1', marginBottom: '6px' }} />
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#0F172A' }}>Lead Curriculum Director</div>
              <div style={{ fontSize: '10px', color: '#64748B' }}>SkillStack Engineering</div>
            </div>

            {/* Official Gold Seal Badge */}
            <div style={{
              width: '74px',
              height: '74px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #FFE27D 0%, #D4AF37 60%, #AA820A 100%)',
              border: '3px solid #FFF',
              boxShadow: '0 4px 16px rgba(170, 130, 10, 0.35)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#3B2F04',
              fontWeight: 900,
              fontSize: '9px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              textAlign: 'center',
              flexShrink: 0
            }}>
              <span>★ ★ ★</span>
              <span style={{ fontSize: '10px', fontWeight: 950, margin: '2px 0' }}>VERIFIED</span>
              <span style={{ fontSize: '8px' }}>SKILLSTACK</span>
            </div>

            {/* Signature 2 */}
            <div style={{ textAlign: 'center', width: '180px' }}>
              <div style={{
                fontFamily: "'Brush Script MT', cursive, sans-serif",
                fontSize: '24px',
                color: '#1E293B',
                marginBottom: '4px'
              }}>
                Academic Board
              </div>
              <div style={{ width: '100%', height: '1px', background: '#CBD5E1', marginBottom: '6px' }} />
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#0F172A' }}>Dean of Evaluation</div>
              <div style={{ fontSize: '10px', color: '#64748B' }}>Continuous Certification</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
