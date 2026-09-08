import React from 'react';
import {
  Sparkles, ArrowRight, BookOpen, Shield, Code, Cpu, Award,
  CheckCircle2, Users, Flame, Star, Play, Terminal, Layers,
  ChevronRight, Laptop, MessageSquare, Phone, Mail, MapPin,
  Compass, ExternalLink, Activity, CheckCircle, Database
} from 'lucide-react';
import BrandLogo from '../components/BrandLogo';
import { siteConfig } from '../config/siteConfig';

export default function HomePage({
  subjects,
  onSelectSubject,
  onNavigate,
  onOpenStudentAuth,
  onOpenStaffAuth,
  user
}) {
  return (
    <div className="homepage-wrapper">
      {/* =========================================================================
          SECTION 1: HERO CANONICAL BANNER (Pure Light Layered Ocean Canvas)
          ========================================================================= */}
      <section className="hero-section">
        {/* Decorative Layer 1: Curvy Fluid Waves */}
        <div className="curvy-bg-layer-1" />
        <div className="curvy-bg-layer-2" />

        {/* Decorative Layer 2: Concentric Orbital Rings */}
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

        {/* Decorative Layer 3: Watermark Tech Grid */}
        <div className="watermark-tech-grid" />

        {/* Floating Subtle Watermark Badges */}
        <div style={{
          position: 'absolute',
          top: '12%',
          right: '38%',
          pointerEvents: 'none',
          opacity: 0.18,
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '11px',
          fontWeight: 700,
          color: '#7B1C6E',
          letterSpacing: '0.1em',
          transform: 'rotate(-12deg)'
        }}>
          &lt;ASGI::Distributed_Cluster&gt;
        </div>
        <div style={{
          position: 'absolute',
          bottom: '18%',
          left: '5%',
          pointerEvents: 'none',
          opacity: 0.18,
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '11px',
          fontWeight: 700,
          color: '#7B1C6E',
          letterSpacing: '0.1em',
          transform: 'rotate(8deg)'
        }}>
          SELECT * FROM skillstack_engine;
        </div>

        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <Sparkles size={15} color="#FDC029" />
              <span>{siteConfig.brand.tagline}</span>
            </div>

            <h1 className="hero-title">
              Master Distributed Backend Engineering{' '}
              <span className="hero-gradient-text">
                From First Principles to Scale
              </span>
            </h1>

            <p className="hero-subtitle">
              Enterprise Systems Topology &bull; Sub-Second Automated Code Assertion Engine &bull; Dual-Language Applied Cognitive Pedagogy supervised by 10 Senior Engineering Faculty.
            </p>

            <div className="hero-cta-group">
              <button
                className="hero-btn btn-primary"
                onClick={() => onNavigate('courses')}
              >
                <BookOpen size={16} /> Explore Curriculum Tracks <ArrowRight size={15} />
              </button>

              {!user ? (
                <button
                  className="hero-btn btn-secondary"
                  onClick={() => onOpenStudentAuth(true)}
                >
                  <Users size={16} /> Enroll as Fellow (Free Access)
                </button>
              ) : user.is_instructor ? (
                <button
                  className="hero-btn btn-secondary"
                  onClick={() => onNavigate('staff')}
                >
                  <Shield size={16} /> Faculty Console
                </button>
              ) : (
                <button
                  className="hero-btn btn-secondary"
                  onClick={() => onNavigate('learning')}
                >
                  <Play size={16} /> Launch Engineering Workbench
                </button>
              )}
            </div>

            {/* Dynamic Live Platform Metrics */}
            <div className="hero-stats-strip">
              <div className="hero-stat-item">
                <span className="stat-number">{siteConfig.metrics.seniorFacultyCount}</span>
                <span className="stat-label">Senior Faculty</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat-item">
                <span className="stat-number">{siteConfig.metrics.activeLabProblems}</span>
                <span className="stat-label">Enterprise Labs</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat-item">
                <span className="stat-number">{siteConfig.metrics.automatedPassRate}</span>
                <span className="stat-label">Output Accuracy</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat-item">
                <span className="stat-number">{siteConfig.metrics.enrolledFellows}</span>
                <span className="stat-label">Trained Fellows</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Terminal Execution Card */}
          <div className="hero-visual-card">
            <div className="visual-card-topbar">
              <span className="card-dot dot-red" />
              <span className="card-dot dot-yellow" />
              <span className="card-dot dot-green" />
              <span className="card-title-bar">nexura_runtime_harness.py &bull; Automated Assertions</span>
            </div>

            <div className="visual-card-body">
              <div className="code-snippet-preview">
                <span className="code-line"><span className="kw">from</span> nexura.core.evaluation <span className="kw">import</span> AutomatedHarness</span>
                <span className="code-line"><span className="kw">from</span> nexura.models <span className="kw">import</span> DistributedModule, TestCase</span>
                <span className="code-line">&nbsp;</span>
                <span className="code-line"><span className="func">def</span> <span className="def-name">verify_fellow_solution</span>(submission_payload):</span>
                <span className="code-line indent">harness = AutomatedHarness(timeout_ms=<span className="num">500</span>)</span>
                <span className="code-line indent">result = harness.execute_assertions(submission_payload)</span>
                <span className="code-line indent"><span className="kw">return</span> {'{'}</span>
                <span className="code-line indent-2"><span className="str">"status"</span>: <span className="str">"ALL_ASSERTIONS_PASSED"</span>,</span>
                <span className="code-line indent-2"><span className="str">"execution_latency_ms"</span>: <span className="num">12.4</span>,</span>
                <span className="code-line indent-2"><span className="str">"benchmark_score"</span>: <span className="num">10.0</span></span>
                <span className="code-line indent">{'}'}</span>
              </div>

              <div className="visual-floating-badge">
                <div className="badge-pulse-icon">
                  <CheckCircle2 size={18} color="#16A34A" />
                </div>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#16A34A', letterSpacing: '0.04em' }}>
                    ⚡ Real-Time Auto Evaluation
                  </div>
                  <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#0F172A' }}>
                    10.0 / 10.0 Benchmark Verified
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Curvy Wave Transition 1 */}
      <div className="curvy-wave-divider" style={{ background: '#F8FAFC' }}>
        <svg viewBox="0 0 1440 64" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0,20 C320,60 720,0 1100,45 C1280,60 1380,30 1440,20 L1440,64 L0,64 Z" fill="#FFFFFF"/>
        </svg>
      </div>

      {/* =========================================================================
          SECTION 2: STRATEGIC PEDAGOGY & INSTITUTIONAL VISION (Pure Light Canvas)
          ========================================================================= */}
      <section className="home-about-section">
        <div className="watermark-tech-grid" />
        <div className="curvy-bg-layer-1" style={{ width: '400px', height: '400px', top: '10%', right: '-60px' }} />
        <div className="section-container">
          <div className="about-grid">
            <div className="about-left">
              <div className="section-tag">
                <Shield size={14} /> The SkillStack Standard
              </div>
              <h2 className="section-heading">
                Engineering Rigor Meets Continuous Production Verification
              </h2>
              <p className="section-para">
                Conventional engineering courses emphasize memorization over computational reasoning. At <strong>SkillStack Academy</strong>, fellows construct scalable systems through 
                <strong> dual-language cognitive architecture</strong>, interactive visual execution topologies, and immediate automated output assertions.
              </p>
              <p className="section-para">
                Our faculty of 10 domain specialists leads you through foundational network protocols, ORM internals, distributed microservices, and asynchronous event streams deployed to enterprise cloud clusters on Vercel and Render.
              </p>

              <div className="about-highlights-list">
                <div className="highlight-row">
                  <div className="highlight-icon"><CheckCircle2 size={16} color="var(--blue-vibrant)" /></div>
                  <div><strong>Zero-To-Architect Trajectory:</strong> Rigorously calibrated syllabus starting from core Python fundamentals to distributed multi-tenant architectures.</div>
                </div>
                <div className="highlight-row">
                  <div className="highlight-icon"><CheckCircle2 size={16} color="var(--blue-vibrant)" /></div>
                  <div><strong>Sub-Second Execution Harness:</strong> Run real terminal workloads with instant syntax, structural, and output assertions.</div>
                </div>
                <div className="highlight-row">
                  <div className="highlight-icon"><CheckCircle2 size={16} color="var(--blue-vibrant)" /></div>
                  <div><strong>Senior Faculty Governance:</strong> 10 specialized domain chairs continuously maintaining academic quality and office hours.</div>
                </div>
              </div>

              <button className="btn-secondary" onClick={() => onNavigate('about')} style={{ marginTop: '20px', borderRadius: 'var(--radius-full)' }}>
                Inspect Institutional Governance & Faculty <ChevronRight size={15} />
              </button>
            </div>

            <div className="about-right-cards">
              <div className="pillar-mini-card">
                <div className="pillar-icon"><Layers size={22} color="var(--blue-vibrant)" /></div>
                <h4>Systems Architecture Topologies</h4>
                <p>Master HTTP lifecycles, ASGI event loops, ORM query compilers, and REST/gRPC microservice boundaries visually.</p>
              </div>
              <div className="pillar-mini-card">
                <div className="pillar-icon"><Terminal size={22} color="#16A34A" /></div>
                <h4>Automated Evaluation Sandbox</h4>
                <p>Execute test cases in an isolated browser environment with instant verification and terminal diagnostics.</p>
              </div>
              <div className="pillar-mini-card">
                <div className="pillar-icon"><Award size={22} color="var(--blue-primary)" /></div>
                <h4>Automated Competency Analytics</h4>
                <p>Real-time mastery tracking, algorithm pass metrics, and academic observatory rankings.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Curvy Wave Transition 2 */}
      <div className="curvy-wave-divider" style={{ background: '#FFFFFF' }}>
        <svg viewBox="0 0 1440 50" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0,0 C380,45 1060,5 1440,35 L1440,50 L0,50 Z" fill="#F8FAFC"/>
        </svg>
      </div>

      {/* =========================================================================
          SECTION 3: ACADEMIC CURRICULA & TRACKS SHOWCASE (Dynamic API Tracks)
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
                    {subject.short_description || subject.description?.slice(0, 130) + '...'}
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
                      <span className="meta-label">Syllabus</span>
                      <span className="meta-value">{subject.total_modules || 8} Modules</span>
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

      {/* Curvy Wave Transition 3: Into Light Features */}
      <div className="curvy-wave-divider" style={{ background: '#F8FAFC' }}>
        <svg viewBox="0 0 1440 70" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0,40 C420,80 980,10 1440,50 L1440,70 L0,70 Z" fill="#FDF5FD"/>
        </svg>
      </div>

      {/* =========================================================================
          SECTION 4: INSTITUTIONAL CAPABILITIES (Pure Light Layered Canvas)
          ========================================================================= */}
      <section className="home-features-section">
        {/* Layer: Concentric Orbital Circles */}
        <div className="concentric-rings-layer" style={{ top: '10%', right: '5%', width: '450px', height: '450px', opacity: 0.5 }}>
          <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
            <circle cx="200" cy="200" r="180" stroke="rgba(123, 28, 110, 0.1)" strokeWidth="1.5" strokeDasharray="6 8" />
            <circle cx="200" cy="200" r="120" stroke="rgba(123, 28, 110, 0.14)" strokeWidth="1.5" />
            <circle cx="200" cy="60" r="4" fill="#7B1C6E" />
            <circle cx="320" cy="200" r="4" fill="#FDC029" />
          </svg>
        </div>
        <div className="curvy-bg-layer-2" style={{ width: '500px', height: '500px', top: '15%', left: '-100px' }} />
        <div className="watermark-tech-grid" />

        <div className="section-container">
          <div className="section-header-center">
            <div className="section-tag">
              <Sparkles size={14} /> Engineering Capabilities
            </div>
            <h2 className="section-heading">Why Software Fellows Excel at SkillStack</h2>
            <p className="section-para" style={{ maxWidth: '640px', margin: '0 auto' }}>
              We unify computer science architectural discipline with enterprise production tooling and continuous automated validation.
            </p>
          </div>

          {(siteConfig.capabilities && siteConfig.capabilities.length > 0) ? (
            <div className="features-quad-grid">
              {siteConfig.capabilities.map(cap => (
                <div key={cap.id} className="feature-quad-card">
                  <div className="feature-number">{cap.number}</div>
                  <h3>{cap.title}</h3>
                  <p>{cap.desc}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="features-quad-grid">
              <div className="feature-quad-card">
                <div className="feature-number">01</div>
                <h3>Distributed Architecture & Syllabus</h3>
                <p>Full conceptual mastery of backend system gateways, ORM pipelines, and event-driven architectures with high-fidelity system models.</p>
              </div>
              <div className="feature-quad-card">
                <div className="feature-number">02</div>
                <h3>Real-Time Output Verification Engine</h3>
                <p>Sub-second code execution harness that validates computational outputs, memory constraints, and structural patterns dynamically.</p>
              </div>
              <div className="feature-quad-card">
                <div className="feature-number">03</div>
                <h3>Dynamic Problem Workbenches</h3>
                <p>Complex engineering problems structured into interactive execution environments with immediate feedback loops.</p>
              </div>
              <div className="feature-quad-card">
                <div className="feature-number">04</div>
                <h3>Continuous Automated Mentorship</h3>
                <p>Comprehensive course modules, test evaluation, progress analytics, and automated certificate generation.</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Curvy Wave Transition 4: Out of Features */}
      <div className="curvy-wave-divider" style={{ background: '#FDF5FD' }}>
        <svg viewBox="0 0 1440 64" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0,20 C360,60 1020,0 1440,30 L1440,64 L0,64 Z" fill="#FFFFFF"/>
        </svg>
      </div>

      {/* =========================================================================
          SECTION 5: VERIFIED FELLOW PLACEMENTS & TESTIMONIALS (Dynamic siteConfig)
          ========================================================================= */}
      <section className="home-stats-reviews-section">
        <div className="watermark-tech-grid" />
        <div className="section-container">
          <div className="stats-banner-card">
            <div className="stat-box">
              <span className="big-stat">{subjects?.length || 0}</span>
              <span className="stat-desc">Active Academic Tracks</span>
            </div>
            <div className="stat-box">
              <span className="big-stat">100%</span>
              <span className="stat-desc">Dynamic API Driven</span>
            </div>
            <div className="stat-box">
              <span className="big-stat">24/7</span>
              <span className="stat-desc">Automated Sandbox</span>
            </div>
            <div className="stat-box">
              <span className="big-stat">Live</span>
              <span className="stat-desc">Cloud Platform</span>
            </div>
          </div>

          {(siteConfig.testimonials && siteConfig.testimonials.length > 0) && (
            <>
              <div className="section-header-center" style={{ marginTop: '54px' }}>
                <h3 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '8px', color: '#0F172A' }}>Verified Engineering Fellow Endorsements</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14.5px' }}>Authentic feedback from graduates functioning in global cloud and backend engineering teams</p>
              </div>

              <div className="reviews-grid">
                {siteConfig.testimonials.map(item => (
                  <div key={item.id} className="review-card">
                    <div className="review-stars">★★★★★</div>
                    <p className="review-quote">"{item.text}"</p>
                    <div className="reviewer-info">
                      <strong>{item.name}</strong> &bull; <span>{item.role}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Curvy Wave Transition 5: Into Corporate Footer */}
      <div className="curvy-wave-divider" style={{ background: '#FFFFFF' }}>
        <svg viewBox="0 0 1440 64" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0,35 C380,70 1060,10 1440,40 L1440,64 L0,64 Z" fill="#F8FAFC"/>
        </svg>
      </div>

      {/* =========================================================================
          SECTION 6: ENTERPRISE CORPORATE FOOTER (High-End Light Slate & Azure)
          ========================================================================= */}
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
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }} />
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
                <li><button onClick={() => onOpenStudentAuth(false)}>Fellow Portal Login</button></li>
                <li><button onClick={() => onOpenStudentAuth(true)}>New Fellow Enrollment</button></li>
                <li><button onClick={() => onOpenStaffAuth()}>Faculty Command Center</button></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Admissions & Operations Desk</h4>
              <div style={{ fontSize: '13px', color: '#64748B', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Mail size={14} color="#7B1C6E" />
                  <span>{siteConfig.contact.email}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Phone size={14} color="#7B1C6E" />
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
    </div>
  );
}
