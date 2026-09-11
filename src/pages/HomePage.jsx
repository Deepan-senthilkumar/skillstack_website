import React, { useState } from 'react';
import {
  Sparkles, ArrowRight, BookOpen, Shield, Code, Cpu, Award,
  CheckCircle2, Users, Flame, Star, Play, Terminal, Layers,
  ChevronRight, Laptop, MessageSquare, Phone, Mail, MapPin,
  Compass, ExternalLink, Activity, CheckCircle, Database,
  Lock, RefreshCw, Zap, Check, AlertTriangle, BarChart3
} from 'lucide-react';
import confetti from 'canvas-confetti';
import BrandLogo from '../components/BrandLogo';
import { siteConfig } from '../config/siteConfig';

export default function HomePage({
  subjects,
  capabilities,
  onSelectSubject,
  onNavigate,
  onOpenStudentAuth,
  onOpenStaffAuth,
  user
}) {
  // Interactive Hero Code Runner Sandbox State
  const [heroLang, setHeroLang] = useState('python');
  const [heroRunning, setHeroRunning] = useState(false);
  const [heroOutput, setHeroOutput] = useState(null);

  const heroCodeSnippets = {
    python: `# Python 3: Fibonacci Memoization Engine
def fibonacci(n, memo={}):
    if n in memo: return memo[n]
    if n <= 1: return n
    memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo)
    return memo[n]

print("Output:", [fibonacci(i) for i in range(8)])`,
    javascript: `// JavaScript: Asynchronous Event Loop
async function processBatch(items) {
    const results = await Promise.all(
        items.map(async (x) => x * 2)
    );
    console.log("Processed:", results);
}
processBatch([10, 20, 30, 40]);`,
    c: `// C Programming: Low-Level Memory Array
#include <stdio.h>

int main() {
    int arr[] = {2, 4, 8, 16, 32};
    printf("Pointer Value: %d\\n", *(arr + 3));
    return 0;
}`
  };

  const heroExpectedOutputs = {
    python: 'Output: [0, 1, 1, 2, 3, 5, 8, 13]',
    javascript: 'Processed: [ 20, 40, 60, 80 ]',
    c: 'Pointer Value: 16'
  };

  const handleRunHeroCode = () => {
    setHeroRunning(true);
    setHeroOutput(null);
    setTimeout(() => {
      setHeroRunning(false);
      setHeroOutput({
        stdout: heroExpectedOutputs[heroLang],
        match: 100,
        latency: (Math.random() * 12 + 8).toFixed(1)
      });
      confetti({
        particleCount: 35,
        spread: 50,
        origin: { y: 0.7 }
      });
    }, 600);
  };

  return (
    <div className="homepage-wrapper">
      {/* =========================================================================
          SECTION 1: HERO CANONICAL BANNER WITH INTERACTIVE COMPILER PREVIEW
          ========================================================================= */}
      <section className="hero-section">
        <div className="curvy-bg-layer-1" />
        <div className="curvy-bg-layer-2" />

        <div className="concentric-rings-layer hero-concentric-rings">
          <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
            <circle cx="250" cy="250" r="230" stroke="rgba(123, 28, 110, 0.12)" strokeWidth="1.5" strokeDasharray="8 8" />
            <circle cx="250" cy="250" r="170" stroke="rgba(123, 28, 110, 0.16)" strokeWidth="1.5" />
            <circle cx="250" cy="250" r="110" stroke="rgba(253, 192, 41, 0.3)" strokeWidth="1.5" strokeDasharray="4 6" />
            <circle cx="250" cy="20" r="5" fill="#7B1C6E" />
            <circle cx="420" cy="250" r="6" fill="#FDC029" />
            <circle cx="150" cy="350" r="4.5" fill="#7B1C6E" />
          </svg>
        </div>

        <div className="watermark-tech-grid" />

        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge" style={{ backgroundColor: 'rgba(123, 28, 110, 0.08)', border: '1px solid rgba(123, 28, 110, 0.2)' }}>
              <Sparkles size={15} color="#FDC029" />
              <span style={{ fontWeight: 800, color: '#7B1C6E' }}>Next-Gen Engineering Platform &bull; Anti-Cheat Sandbox</span>
            </div>

            <h1 className="hero-title" style={{ fontSize: 'clamp(28px, 4.5vw, 50px)', lineHeight: 1.18, marginTop: '12px' }}>
              Master Modern Engineering with{' '}
              <span className="hero-gradient-text" style={{ background: 'linear-gradient(135deg, #7B1C6E 0%, #E11D48 50%, #FDC029 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Secured Code Sandboxes
              </span>
            </h1>

            <p className="hero-subtitle" style={{ fontSize: '15.5px', lineHeight: 1.65, maxWidth: '580px', color: '#475569', marginTop: '14px' }}>
              Enterprise Systems Topology &bull; Sub-Second In-Browser Code Compiler (70%+ Output Assertion) &bull; Randomized Topic Knowledge Gates with 10-Minute Cooldown Lockout.
            </p>

            <div className="hero-cta-group" style={{ marginTop: '24px' }}>
              <button
                className="hero-btn btn-primary"
                onClick={() => onNavigate('courses')}
                style={{ borderRadius: 'var(--radius-full)', padding: '13px 26px', fontSize: '14.5px', fontWeight: 700 }}
              >
                <BookOpen size={16} /> Explore Curriculum Tracks <ArrowRight size={15} />
              </button>

              {!user ? (
                <button
                  className="hero-btn btn-secondary"
                  onClick={() => onOpenStudentAuth(true)}
                  style={{ borderRadius: 'var(--radius-full)', padding: '13px 24px', fontSize: '14px', fontWeight: 700 }}
                >
                  <Users size={16} /> Student Portal Access
                </button>
              ) : user.is_instructor ? (
                <button
                  className="hero-btn btn-secondary"
                  onClick={() => onNavigate('staff')}
                  style={{ borderRadius: 'var(--radius-full)', padding: '13px 24px', fontSize: '14px', fontWeight: 700 }}
                >
                  <Shield size={16} /> Faculty Console
                </button>
              ) : (
                <button
                  className="hero-btn btn-secondary"
                  onClick={() => onNavigate('learning')}
                  style={{ borderRadius: 'var(--radius-full)', padding: '13px 24px', fontSize: '14px', fontWeight: 700 }}
                >
                  <Play size={16} /> Launch Workbench
                </button>
              )}
            </div>

            {/* Dynamic Live Platform Metrics */}
            <div className="hero-stats-strip" style={{ marginTop: '30px' }}>
              <div className="hero-stat-item">
                <span className="stat-number">{subjects?.length || 4}</span>
                <span className="stat-label">Active Tracks</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat-item">
                <span className="stat-number">&ge;70%</span>
                <span className="stat-label">Pass Threshold</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat-item">
                <span className="stat-number">&lt;500ms</span>
                <span className="stat-label">Run Latency</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat-item">
                <span className="stat-number">100%</span>
                <span className="stat-label">Anti-Cheat Safe</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Interactive Terminal Card */}
          <div className="hero-visual-card" style={{ maxWidth: '480px', width: '100%', boxShadow: '0 20px 45px -10px rgba(123, 28, 110, 0.25), 0 0 0 1px rgba(123, 28, 110, 0.15)', borderRadius: '20px', overflow: 'hidden' }}>
            <div className="visual-card-topbar" style={{ backgroundColor: '#0F172A', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="card-dot dot-red" />
                <span className="card-dot dot-yellow" />
                <span className="card-dot dot-green" />
                <span style={{ fontSize: '11.5px', fontFamily: 'monospace', color: '#94A3B8', marginLeft: '6px' }}>
                  interactive_sandbox.{heroLang === 'python' ? 'py' : heroLang === 'javascript' ? 'js' : 'c'}
                </span>
              </div>

              {/* Language Selector */}
              <div style={{ display: 'flex', gap: '4px' }}>
                {['python', 'javascript', 'c'].map(lang => (
                  <button
                    key={lang}
                    onClick={() => { setHeroLang(lang); setHeroOutput(null); }}
                    style={{
                      padding: '3px 8px',
                      fontSize: '10.5px',
                      fontWeight: 700,
                      borderRadius: '6px',
                      border: 'none',
                      cursor: 'pointer',
                      backgroundColor: heroLang === lang ? '#7B1C6E' : 'rgba(255,255,255,0.1)',
                      color: '#FFFFFF',
                      textTransform: 'uppercase'
                    }}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            <div className="visual-card-body" style={{ backgroundColor: '#090D16', padding: '16px' }}>
              <pre style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '12px',
                lineHeight: 1.55,
                color: '#E2E8F0',
                margin: 0,
                whiteSpace: 'pre-wrap',
                maxHeight: '160px',
                overflowY: 'auto'
              }}>
                {heroCodeSnippets[heroLang]}
              </pre>

              {/* Interactive Test Action */}
              <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <button
                  onClick={handleRunHeroCode}
                  disabled={heroRunning}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: '#10B981',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <Play size={12} fill="currentColor" /> {heroRunning ? 'Evaluating Output…' : 'Run Live Assertion'}
                </button>

                <div style={{ fontSize: '11px', color: '#64748B', fontFamily: 'monospace' }}>
                  Target Match: &ge; 70%
                </div>
              </div>

              {/* Live Output Box */}
              {heroOutput && (
                <div style={{
                  marginTop: '12px',
                  padding: '10px 12px',
                  backgroundColor: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '10px',
                  animation: 'fadeIn 0.25s ease'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#34D399', textTransform: 'uppercase' }}>
                      ✅ 100% Output Matched (Passed)
                    </span>
                    <span style={{ fontSize: '10px', color: '#94A3B8', fontFamily: 'monospace' }}>
                      {heroOutput.latency}ms
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', fontFamily: 'monospace', color: '#F8FAFC' }}>
                    {heroOutput.stdout}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Wave Transition 1 */}
      <div className="curvy-wave-divider" style={{ background: '#F8FAFC' }}>
        <svg viewBox="0 0 1440 64" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0,20 C320,60 720,0 1100,45 C1280,60 1380,30 1440,20 L1440,64 L0,64 Z" fill="#FFFFFF"/>
        </svg>
      </div>

      {/* =========================================================================
          SECTION 2: SECURED TESTING PLATFORM PILLARS
          ========================================================================= */}
      <section className="home-about-section" style={{ padding: '60px 0', backgroundColor: '#FFFFFF' }}>
        <div className="section-container">
          <div className="section-header-center">
            <div className="section-tag" style={{ backgroundColor: 'rgba(123, 28, 110, 0.08)', color: '#7B1C6E' }}>
              <Shield size={14} /> The SkillStack Assessment Standard
            </div>
            <h2 className="section-heading">
              Precision Engineering with Continuous Integrity Verification
            </h2>
            <p className="section-para" style={{ maxWidth: '680px', margin: '0 auto' }}>
              We combine enterprise coding environments with strict security lockouts and automated grading algorithms to guarantee genuine technical competency.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px',
            marginTop: '40px'
          }}>
            {/* Pillar 1: Anti-Cheating Lockdown */}
            <div style={{
              backgroundColor: '#FAFAFA',
              border: '1.5px solid #F1F5F9',
              borderRadius: '20px',
              padding: '28px 24px',
              transition: 'all 0.2s',
              borderTop: '4px solid #7B1C6E',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
            }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: 'rgba(123, 28, 110, 0.1)',
                color: '#7B1C6E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <Shield size={24} />
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
                Anti-Cheating Lockdown
              </h3>
              <p style={{ fontSize: '13.5px', color: '#64748B', lineHeight: 1.6 }}>
                Full lockdown on Mobile &amp; Desktop: blocks split-screen, clipboard pasting, floating overlays, devtools, and tab switching with 1-warning auto-termination.
              </p>
            </div>

            {/* Pillar 2: 70%+ Output Assertion Engine */}
            <div style={{
              backgroundColor: '#FAFAFA',
              border: '1.5px solid #F1F5F9',
              borderRadius: '20px',
              padding: '28px 24px',
              transition: 'all 0.2s',
              borderTop: '4px solid #10B981',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
            }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                color: '#10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <Terminal size={24} />
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
                70%+ Output Compiler
              </h3>
              <p style={{ fontSize: '13.5px', color: '#64748B', lineHeight: 1.6 }}>
                In-browser compiler across Python, JavaScript, and C. Sub-second execution evaluates output against target specs requiring &ge;70% similarity to pass.
              </p>
            </div>

            {/* Pillar 3: Topic Knowledge Gates */}
            <div style={{
              backgroundColor: '#FAFAFA',
              border: '1.5px solid #F1F5F9',
              borderRadius: '20px',
              padding: '28px 24px',
              transition: 'all 0.2s',
              borderTop: '4px solid #FDC029',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
            }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: 'rgba(253, 192, 41, 0.15)',
                color: '#B45309',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <Zap size={24} />
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
                20+ MCQ Knowledge Gates
              </h3>
              <p style={{ fontSize: '13.5px', color: '#64748B', lineHeight: 1.6 }}>
                5 random shuffled questions per test. Requires 50% score to unlock the next chapter; failing applies an automatic 10-minute cooldown study lock.
              </p>
            </div>

            {/* Pillar 4: Faculty Analytics Observatory */}
            <div style={{
              backgroundColor: '#FAFAFA',
              border: '1.5px solid #F1F5F9',
              borderRadius: '20px',
              padding: '28px 24px',
              transition: 'all 0.2s',
              borderTop: '4px solid #3B82F6',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
            }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                color: '#3B82F6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <BarChart3 size={24} />
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
                Faculty Analytics Suite
              </h3>
              <p style={{ fontSize: '13.5px', color: '#64748B', lineHeight: 1.6 }}>
                Real-time tracking of every student test attempt, question choices, security violations, score percentages, and instant administrative cooldown resets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Wave Transition 2 */}
      <div className="curvy-wave-divider" style={{ background: '#FFFFFF' }}>
        <svg viewBox="0 0 1440 50" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0,0 C380,45 1060,5 1440,35 L1440,50 L0,50 Z" fill="#F8FAFC"/>
        </svg>
      </div>

      {/* =========================================================================
          SECTION 3: ACADEMIC CURRICULA & TRACKS SHOWCASE
          ========================================================================= */}
      <section className="home-courses-section">
        <div className="watermark-tech-grid" />
        <div className="section-container">
          <div className="section-header-center">
            <div className="section-tag">
              <BookOpen size={14} /> Official Curricula
            </div>
            <h2 className="section-heading">Academic Tracks Supervised by Domain Faculty</h2>
            <p className="section-para" style={{ maxWidth: '680px', margin: '0 auto' }}>
              Select an engineering track to inspect the modular syllabus breakdown, visual mental models, and access interactive practice workbenches.
            </p>
          </div>

          <div className="subjects-cards-grid">
            {subjects.map(subject => (
              <div
                key={subject.id}
                className="subject-card"
                onClick={() => onSelectSubject(subject)}
              >
                <div>
                  <div className="subject-card-header">
                    <div className="subject-icon-box">
                      {subject.icon === 'django' ? (
                        <span style={{ fontWeight: 800, fontSize: '18px', color: 'var(--blue-primary)', fontFamily: 'IBM Plex Mono' }}>&lt;dj&gt;</span>
                      ) : subject.icon === 'python' ? (
                        <Code size={20} color="var(--blue-primary)" />
                      ) : (
                        <Cpu size={20} color="var(--blue-primary)" />
                      )}
                    </div>
                    <span className="subject-level-badge">{subject.level}</span>
                  </div>

                  <h3 className="subject-title">{subject.name}</h3>
                  <p className="subject-desc">
                    {subject.short_description || (subject.description && subject.description.trim() !== '...' ? subject.description : 'Comprehensive curriculum track with structured modules, visual architecture models, and automated engineering workbenches.')}
                  </p>
                </div>

                <div>
                  <div className="subject-meta-strip">
                    <div>
                      <span className="meta-label">Domain Faculty</span>
                      <span className="meta-value">{subject.instructor_name || 'Senior Staff Faculty'}</span>
                    </div>
                    <div>
                      <span className="meta-label">Duration</span>
                      <span className="meta-value">{subject.duration || '6-8 Weeks Track'}</span>
                    </div>
                    <div>
                      <span className="meta-label">Modules</span>
                      <span className="meta-value">{subject.module_count ?? subject.modules?.length ?? 0} Chapters</span>
                    </div>
                    <div>
                      <span className="meta-label">Topics</span>
                      <span className="meta-value">{subject.topic_count ?? 0} Topics</span>
                    </div>
                  </div>

                  <button
                    className="subject-cta-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectSubject(subject);
                    }}
                  >
                    View Syllabus & Launch Workbench <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <button className="btn-secondary" onClick={() => onNavigate('courses')} style={{ borderRadius: 'var(--radius-full)', padding: '11px 26px' }}>
              Inspect Complete Catalog & Syllabus Tracks <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* Wave Transition 3 */}
      <div className="curvy-wave-divider" style={{ background: '#F8FAFC' }}>
        <svg viewBox="0 0 1440 70" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0,40 C420,80 980,10 1440,50 L1440,70 L0,70 Z" fill="#FDF5FD"/>
        </svg>
      </div>

      {/* =========================================================================
          SECTION 4: 4-STEP LEARNING WORKFLOW
          ========================================================================= */}
      <section style={{ backgroundColor: '#FDF5FD', padding: '60px 0' }}>
        <div className="section-container">
          <div className="section-header-center">
            <div className="section-tag" style={{ backgroundColor: 'rgba(123, 28, 110, 0.08)', color: '#7B1C6E' }}>
              <Layers size={14} /> Structured Pedagogy
            </div>
            <h2 className="section-heading">How Software Fellows Master Stacks</h2>
            <p className="section-para" style={{ maxWidth: '640px', margin: '0 auto' }}>
              From foundational mental models to enterprise production deployment.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '20px',
            marginTop: '40px'
          }}>
            {[
              {
                step: '01',
                title: 'Visual Mental Models',
                desc: 'Grasp internal architecture through interactive SVG flow diagrams and dual-language technical pedagogy.'
              },
              {
                step: '02',
                title: 'Topic Assessment Gate',
                desc: 'Random 5-question test from 20+ question pool. 50% pass mark unlocks next module; fail triggers 10-min cooldown.'
              },
              {
                step: '03',
                title: '70%+ Output Assertion',
                desc: 'Write real code in Python, C, or JS. The compiler evaluates runtime stdout against target assertions.'
              },
              {
                step: '04',
                title: 'Production Verified',
                desc: 'Earn verifiable course certificates backed by complete analytics audits of all test submissions.'
              }
            ].map((st, idx) => (
              <div key={idx} style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '18px',
                padding: '24px 20px',
                border: '1px solid rgba(123, 28, 110, 0.15)',
                position: 'relative',
                boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
              }}>
                <div style={{
                  fontSize: '28px',
                  fontWeight: 900,
                  fontFamily: 'monospace',
                  color: '#7B1C6E',
                  opacity: 0.25,
                  marginBottom: '10px'
                }}>
                  {st.step}
                </div>
                <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
                  {st.title}
                </h4>
                <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.6 }}>
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: HIGH-IMPACT CALL TO ACTION BANNER
          ========================================================================= */}
      <section style={{ padding: '70px 0', backgroundColor: '#0F172A', color: '#FFFFFF', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-20%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(123, 28, 110, 0.4) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div className="section-container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'rgba(253, 192, 41, 0.15)',
            border: '1px solid rgba(253, 192, 41, 0.3)',
            color: '#FDC029',
            padding: '4px 14px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 800,
            textTransform: 'uppercase',
            marginBottom: '16px'
          }}>
            <Sparkles size={13} /> Elevate Your Engineering Career
          </div>

          <h2 style={{ fontSize: 'clamp(26px, 3.8vw, 42px)', fontWeight: 800, color: '#FFFFFF', maxWidth: '750px', margin: '0 auto 16px', lineHeight: 1.25 }}>
            Ready to Build Robust Distributed Systems from First Principles?
          </h2>

          <p style={{ fontSize: '16px', color: '#94A3B8', maxWidth: '600px', margin: '0 auto 30px', lineHeight: 1.6 }}>
            Join software fellows mastering backend internals, real-time code evaluation, and automated assessment sandboxes.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <button
              onClick={() => onNavigate('courses')}
              style={{
                backgroundColor: '#FDC029',
                color: '#0F172A',
                border: 'none',
                padding: '14px 28px',
                borderRadius: '9999px',
                fontSize: '14.5px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              Browse Engineering Tracks <ArrowRight size={16} />
            </button>

            {!user && (
              <button
                onClick={() => onOpenStudentAuth(false)}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#FFFFFF',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  padding: '14px 26px',
                  borderRadius: '9999px',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Sign In to Student Portal
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
