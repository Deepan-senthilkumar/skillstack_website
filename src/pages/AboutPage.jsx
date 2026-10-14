import React from 'react';
import {
  Sparkles, Award, Code, Cpu, Target, CheckCircle2, ArrowRight,
  Layers, ShieldCheck, Zap, XCircle, Check, DollarSign, BookOpen,
  Terminal, Compass, Flame, HelpCircle
} from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

export default function AboutPage({ onNavigate }) {
  return (
    <div style={{ maxWidth: '1240px', width: '100%', margin: '0 auto', padding: '36px 20px 80px', position: 'relative', overflow: 'hidden', boxSizing: 'border-box' }}>
      {/* Decorative Ambient Background Blobs */}
      <div className="curvy-floating-orb orb-blue" style={{ top: '60px', left: '0px', width: 'min(380px, 80vw)', height: 'min(380px, 80vw)' }} />
      <div className="curvy-floating-orb orb-cyan" style={{ top: '240px', right: '0px', width: 'min(340px, 75vw)', height: 'min(340px, 75vw)' }} />

      {/* HERO BANNER: THE REAL PURPOSE */}
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
            <span>Why SkillStack Was Built &bull; Our Mission</span>
          </div>

          <h1 style={{ fontSize: 'clamp(28px, 3.6vw, 44px)', fontWeight: 850, color: '#FFFFFF', marginBottom: '16px', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
            Cut the Fluff:{' '}
            <span style={{
              background: 'linear-gradient(135deg, #FDC029 0%, #FB7185 50%, #C084FC 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline'
            }}>
              Learn Only What Gets You Hired.
            </span>
          </h1>

          <p style={{ color: '#E2E8F0', fontSize: '16px', lineHeight: 1.75, marginBottom: '24px' }}>
            Most learning platforms trap you in 80-hour video playlists, charge heavy subscriptions, or overwhelm you with hundreds of complex theoretical topics that companies never ask for. <strong>SkillStack was built to fix this:</strong> 100% Free, Zero Bloat, focusing purely on the high-impact concepts and practical labs needed to get hired and excel in software engineering.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div className="catalog-hero-pill-feature">
              <CheckCircle2 size={15} color="#10B981" /> 100% Free & Open Forever
            </div>
            <div className="catalog-hero-pill-feature">
              <CheckCircle2 size={15} color="#FDC029" /> Job-Critical Topics Only — No Waste
            </div>
            <div className="catalog-hero-pill-feature">
              <CheckCircle2 size={15} color="#A855F7" /> In-Browser Sandboxes & Instant Tests
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: THE REAL PROBLEM IN TECH LEARNING */}
      <div style={{ marginBottom: '64px' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div className="section-tag" style={{ margin: '0 auto 12px' }}>
            <Target size={14} /> The Problem We Are Solving
          </div>
          <h2 style={{ fontSize: '32px', color: '#0F172A', fontWeight: 850 }}>
            Why Most Online Platforms Fail Students
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15.5px', maxWidth: '720px', margin: '0 auto', lineHeight: 1.7 }}>
            Learning to code shouldn't cost a fortune or feel like memorizing a dusty encyclopedia. Here are the 3 major roadblocks beginners face today:
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          {/* Problem 1 */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            border: '1.5px solid #FEE2E2',
            padding: '32px 28px',
            boxShadow: '0 8px 24px rgba(239, 68, 68, 0.05)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              background: '#FEF2F2',
              color: '#DC2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '18px'
            }}>
              <DollarSign size={22} />
            </div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#DC2626', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
              Barrier #1: Cost & Subscriptions
            </div>
            <h3 style={{ fontSize: '19px', fontWeight: 800, color: '#0F172A', marginBottom: '10px' }}>
              Expensive Paywalls & Locked Content
            </h3>
            <p style={{ color: '#64748B', fontSize: '14px', lineHeight: 1.65 }}>
              Big e-learning portals advertise "free learning", but gate practical compiler sandboxes, quizzes, and certificates behind <strong>$30 to $80 monthly subscriptions</strong>. Passionate students without budget are locked out of real hands-on practice.
            </p>
          </div>

          {/* Problem 2 */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            border: '1.5px solid #FEF3C7',
            padding: '32px 28px',
            boxShadow: '0 8px 24px rgba(245, 158, 11, 0.05)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              background: '#FFFBEB',
              color: '#D97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '18px'
            }}>
              <BookOpen size={22} />
            </div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
              Barrier #2: Academic Bloat
            </div>
            <h3 style={{ fontSize: '19px', fontWeight: 800, color: '#0F172A', marginBottom: '10px' }}>
              "Tutorial Hell" & Unnecessary Theory
            </h3>
            <p style={{ color: '#64748B', fontSize: '14px', lineHeight: 1.65 }}>
              Courses often dump hundreds of complicated theoretical topics and archaic syntax. Students spend months studying academic trivia that <strong>tech companies never test or care about</strong> during job interviews.
            </p>
          </div>

          {/* Problem 3 */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            border: '1.5px solid #EDE9FE',
            padding: '32px 28px',
            boxShadow: '0 8px 24px rgba(124, 58, 237, 0.05)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              background: '#F5F3FF',
              color: '#7C3AED',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '18px'
            }}>
              <Terminal size={22} />
            </div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#7C3AED', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
              Barrier #3: Passive Watching
            </div>
            <h3 style={{ fontSize: '19px', fontWeight: 800, color: '#0F172A', marginBottom: '10px' }}>
              Watching Videos &ne; Writing Code
            </h3>
            <p style={{ color: '#64748B', fontSize: '14px', lineHeight: 1.65 }}>
              Watching someone else write code on YouTube creates a false sense of mastery. The moment a student sits in an interview or opens an empty terminal, they get stuck because they haven't practiced solving real test cases.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 2: HOW SKILLSTACK SOLVES IT (OUR CORE PHILOSOPHY) */}
      <div style={{
        background: 'linear-gradient(135deg, #FAF5FF 0%, #FFFFFF 50%, #F5F3FF 100%)',
        borderRadius: '32px',
        border: '1.5px solid #DDD6FE',
        boxShadow: '0 12px 36px rgba(124, 58, 237, 0.06)',
        padding: '48px 36px',
        marginBottom: '64px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center', marginBottom: '40px' }}>
          <div className="section-tag" style={{ margin: '0 auto 12px' }}>
            <Zap size={14} /> The SkillStack Difference
          </div>
          <h2 style={{ fontSize: '32px', color: '#0F172A', fontWeight: 850, marginBottom: '12px' }}>
            How SkillStack is Built Differently
          </h2>
          <p style={{ color: '#475569', fontSize: '15.5px', lineHeight: 1.7 }}>
            We engineered SkillStack around a simple rule: <strong>If a topic doesn't help you write production code or pass technical interviews, it doesn't belong here.</strong>
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '24px'
        }}>
          {/* Solution 1 */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            border: '1.5px solid #E2E8F0',
            padding: '24px',
            boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)'
          }}>
            <div style={{ fontSize: '28px', marginBottom: '12px' }}>🎯</div>
            <h4 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
              High-Yield Job Topics
            </h4>
            <p style={{ fontSize: '13.5px', color: '#64748B', lineHeight: 1.65 }}>
              We teach only the exact 20% of core concepts that drive 80% of real engineering and technical interview success. Zero textbook filler.
            </p>
          </div>

          {/* Solution 2 */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            border: '1.5px solid #E2E8F0',
            padding: '24px',
            boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)'
          }}>
            <div style={{ fontSize: '28px', marginBottom: '12px' }}>💡</div>
            <h4 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
              Simplified & Easy to Grasp
            </h4>
            <p style={{ fontSize: '13.5px', color: '#64748B', lineHeight: 1.65 }}>
              Complex topics like pointers, memory layout, and async handling are broken down into plain-English analogies, bite-sized notes, and visual diagrams.
            </p>
          </div>

          {/* Solution 3 */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            border: '1.5px solid #E2E8F0',
            padding: '24px',
            boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)'
          }}>
            <div style={{ fontSize: '28px', marginBottom: '12px' }}>⚡</div>
            <h4 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
              Hands-On Sandboxes
            </h4>
            <p style={{ fontSize: '13.5px', color: '#64748B', lineHeight: 1.65 }}>
              Every lesson is paired with immediate interactive code challenges. Run code in the browser, see stdout results, and pass automated assertions instantly.
            </p>
          </div>

          {/* Solution 4 */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            border: '1.5px solid #E2E8F0',
            padding: '24px',
            boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)'
          }}>
            <div style={{ fontSize: '28px', marginBottom: '12px' }}>💎</div>
            <h4 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
              100% Free Forever
            </h4>
            <p style={{ fontSize: '13.5px', color: '#64748B', lineHeight: 1.65 }}>
              No credit card, no "free trial expires in 7 days", no locked solutions. High-quality developer training should be accessible to everyone who wants to learn.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 3: SIDE-BY-SIDE COMPARISON TABLE */}
      <div style={{ marginBottom: '64px' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div className="section-tag" style={{ margin: '0 auto 12px' }}>
            <Compass size={14} /> The Direct Comparison
          </div>
          <h2 style={{ fontSize: '30px', color: '#0F172A', fontWeight: 850 }}>
            Traditional E-Learning vs. SkillStack
          </h2>
          <p style={{ color: '#64748B', fontSize: '15px', maxWidth: '640px', margin: '0 auto' }}>
            See why students choose our job-focused approach over bloated, expensive alternatives.
          </p>
        </div>

        <div style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          border: '1.5px solid #E2E8F0',
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(15, 23, 42, 0.04)'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr 1fr',
            background: '#F8FAFC',
            padding: '16px 24px',
            borderBottom: '1.5px solid #E2E8F0',
            fontWeight: 800,
            fontSize: '13.5px',
            color: '#475569',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            <div>Learning Feature</div>
            <div style={{ color: '#DC2626' }}>❌ Traditional Platforms</div>
            <div style={{ color: '#7C3AED' }}>⚡ SkillStack</div>
          </div>

          {[
            {
              feature: 'Access & Pricing',
              traditional: '$30 - $80 / month paywalls',
              skillstack: '100% Free & Open Forever'
            },
            {
              feature: 'Curriculum Focus',
              traditional: 'Bloated 80+ hour academic trivia',
              skillstack: 'Job-critical topics only to get hired'
            },
            {
              feature: 'Learning Method',
              traditional: 'Passive video watching & sleepiness',
              skillstack: 'Active coding in sandbox & instant tests'
            },
            {
              feature: 'Setup & Tools',
              traditional: 'Complex IDE installation headaches',
              skillstack: 'Zero setup — runs inside browser'
            },
            {
              feature: 'Student Doubts',
              traditional: 'Ignored comments on forums',
              skillstack: 'Direct 1-on-1 trainer clarification desk'
            },
            {
              feature: 'Completion Goal',
              traditional: 'Keep you subscribed as long as possible',
              skillstack: 'Fastest path to job-ready competence'
            }
          ].map((row, idx) => (
            <div
              key={idx}
              style={{
                display: 'grid',
                gridTemplateColumns: '1.2fr 1fr 1fr',
                padding: '18px 24px',
                borderBottom: idx === 5 ? 'none' : '1px solid #F1F5F9',
                fontSize: '14.5px',
                alignItems: 'center',
                background: idx % 2 === 0 ? '#FFFFFF' : '#FAFAFA'
              }}
            >
              <div style={{ fontWeight: 700, color: '#0F172A' }}>{row.feature}</div>
              <div style={{ color: '#64748B', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <XCircle size={16} color="#DC2626" style={{ flexShrink: 0 }} />
                <span>{row.traditional}</span>
              </div>
              <div style={{ color: '#7C3AED', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="#10B981" style={{ flexShrink: 0 }} />
                <span>{row.skillstack}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4: TECHNOLOGY UNDER THE HOOD */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '32px',
        border: '1.5px solid rgba(124, 58, 237, 0.14)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04)',
        padding: '38px 32px',
        marginBottom: '64px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div className="section-tag" style={{ margin: '0 auto 12px' }}>
            <Cpu size={14} /> Technology Under The Hood
          </div>
          <h2 style={{ fontSize: '26px', color: '#0F172A', fontWeight: 800 }}>
            Built With Modern, Production-Grade Engineering
          </h2>
          <p style={{ color: '#64748B', fontSize: '14.5px', maxWidth: '600px', margin: '0 auto' }}>
            SkillStack isn't just an e-learning website; it's a real-time cloud compiler, progress tracker, and automated grading engine.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px'
        }}>
          <div style={{ padding: '20px', borderRadius: '16px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#7C3AED', textTransform: 'uppercase', marginBottom: '6px' }}>Frontend Layer</div>
            <div style={{ fontWeight: 800, fontSize: '16px', color: '#0F172A', marginBottom: '6px' }}>React.js & Vite</div>
            <div style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.6 }}>Ultra-fast client architecture, modern CSS design system, and instant state caching.</div>
          </div>

          <div style={{ padding: '20px', borderRadius: '16px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#16A34A', textTransform: 'uppercase', marginBottom: '6px' }}>Backend API</div>
            <div style={{ fontWeight: 800, fontSize: '16px', color: '#0F172A', marginBottom: '6px' }}>Django REST Framework</div>
            <div style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.6 }}>Python 3 endpoints for curriculum hierarchy, progress matrix, and student logs.</div>
          </div>

          <div style={{ padding: '20px', borderRadius: '16px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#2563EB', textTransform: 'uppercase', marginBottom: '6px' }}>Database Engine</div>
            <div style={{ fontWeight: 800, fontSize: '16px', color: '#0F172A', marginBottom: '6px' }}>PostgreSQL on Supabase</div>
            <div style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.6 }}>Cloud relational database with strict foreign keys, indexing, and persistent records.</div>
          </div>

          <div style={{ padding: '20px', borderRadius: '16px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#D97706', textTransform: 'uppercase', marginBottom: '6px' }}>Code Execution</div>
            <div style={{ fontWeight: 800, fontSize: '16px', color: '#0F172A', marginBottom: '6px' }}>Sandboxed Runners</div>
            <div style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.6 }}>Automated stdout and keyword assertions for C & Python practical challenges.</div>
          </div>
        </div>
      </div>

      {/* FINAL CALL TO ACTION BAR */}
      <div style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #4C1D95 100%)',
        borderRadius: '32px',
        padding: '52px 40px',
        color: '#FFFFFF',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 20px 45px -15px rgba(76, 29, 149, 0.4)'
      }}>
        <div className="dotted-layer-navy" />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '680px', margin: '0 auto' }}>
          <h2 style={{
            color: '#FFFFFF',
            fontSize: 'clamp(26px, 3.2vw, 36px)',
            fontWeight: 850,
            marginBottom: '14px',
            lineHeight: 1.25,
            letterSpacing: '-0.02em'
          }}>
            Ready to Master Job-Ready Skills for Free?
          </h2>
          <p style={{ color: '#E2E8F0', fontSize: '15.5px', lineHeight: 1.7, marginBottom: '28px' }}>
            Zero paywalls. No fluff. Jump straight into the curated courses, interactive MCQs, and hands-on coding sandboxes.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              className="hero-btn btn-primary"
              onClick={() => onNavigate('courses')}
              style={{
                background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 50%, #EC4899 100%)',
                color: '#FFFFFF',
                borderRadius: '9999px',
                border: 'none',
                boxShadow: '0 8px 24px rgba(124, 58, 237, 0.35)'
              }}
            >
              Explore Course Tracks <ArrowRight size={15} />
            </button>
            <button
              className="hero-btn btn-secondary"
              onClick={() => onNavigate('curriculum')}
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                color: '#FFFFFF',
                borderRadius: '9999px',
                border: '1.5px solid rgba(255, 255, 255, 0.25)',
                backdropFilter: 'blur(8px)'
              }}
            >
              Browse Complete Syllabus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
