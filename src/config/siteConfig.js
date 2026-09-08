/**
 * Nexura Institute of Technology — Centralized Platform Configuration
 * All titles, metrics, faculty rosters, support channels, and platform metadata
 * are dynamically configurable through this module.
 */

export const siteConfig = {
  brand: {
    name: "SkillStack",
    fullName: "SkillStack Learning Platform",
    shortName: "SkillStack",
    logo: "/skillstack.png",
    tagline: "Master Software Engineering & Modern Tech Stacks",
    description: "Interactive technology learning academy featuring hands-on modules, real-time code evaluation, and industry-grade curriculum.",
    established: 2026,
    version: "v3.4.0-enterprise",
    status: "Operational — All Systems Normal",
    dbEngine: "PostgreSQL on Supabase Cloud",
    deployment: "Vercel Edge & Render Production Clusters"
  },

  // Dynamic Live Metrics
  metrics: {
    enrolledFellows: "1,240+",
    activeLabProblems: "64+",
    seniorFacultyCount: "10",
    automatedPassRate: "99.4%",
    codeEvaluationsToday: "8,950+",
    partnerEnterprises: "45+"
  },

  // Institutional Capabilities & Strategic Pillars
  capabilities: [
    {
      id: "cap-1",
      number: "01",
      title: "Distributed Systems & MVT Topology",
      shortDesc: "Architectural Visual Models",
      desc: "Full conceptual mastery of WSGI/ASGI gateways, reverse proxies, ORM query pipelines, and event-driven architectures with high-fidelity system diagrams."
    },
    {
      id: "cap-2",
      number: "02",
      title: "Real-Time Output Verification Engine",
      shortDesc: "Automated Sandbox Evaluator",
      desc: "Sub-second code execution harness that validates computational outputs, memory constraints, and structural patterns without human intervention."
    },
    {
      id: "cap-3",
      number: "03",
      title: "Applied Cognitive Systems Pedagogy",
      shortDesc: "Dual-Language Mental Models",
      desc: "Complex engineering abstractions structured into intuitive mental representations, bridging computer science theory and enterprise production code."
    },
    {
      id: "cap-4",
      number: "04",
      title: "Continuous Faculty-Supervised Mentorship",
      shortDesc: "10 Domain Specialists",
      desc: "Dedicated senior architects overseeing individual track curricula, conducting architectural reviews, and monitoring student mastery trajectories."
    }
  ],

  // Faculty Directory & Domain Specialists
  faculty: [
    {
      id: "fac-1",
      name: "Prof. Deepan S.",
      role: "Lead Systems Architect & Chief Technical Officer",
      domain: "Distributed Python & Django Systems",
      credentials: "M.Tech (Software Eng), 10+ Yrs Enterprise Exp",
      tag: "Core Systems"
    },
    {
      id: "fac-2",
      name: "Dr. K. Vignesh",
      role: "Principal Algorithms & Runtime Specialist",
      domain: "Advanced Python Data Structures & Concurrency",
      credentials: "Ph.D. in Computer Science, 8 Yrs Research Exp",
      tag: "Algorithms"
    },
    {
      id: "fac-3",
      name: "Eng. S. Anitha",
      role: "Microservices & Distributed APIs Lead",
      domain: "RESTful Standards, DRF & gRPC Services",
      credentials: "Former Senior Staff Engineer, 7 Yrs Exp",
      tag: "APIs & Services"
    },
    {
      id: "fac-4",
      name: "M. Karthik",
      role: "Database Systems & Performance Architect",
      domain: "PostgreSQL Query Optimization & ORM Internals",
      credentials: "PostgreSQL Certified Professional, 6 Yrs Exp",
      tag: "Databases"
    },
    {
      id: "fac-5",
      name: "P. Priya",
      role: "Full-Stack Integration & React Specialist",
      domain: "Modern SPAs, State Management & Vite Runtimes",
      credentials: "Lead Frontend Architect, 5 Yrs Exp",
      tag: "Full Stack"
    },
    {
      id: "fac-6",
      name: "R. Balaji",
      role: "DevOps & Cloud Infrastructure Lead",
      domain: "Docker, Kubernetes, Vercel Edge & Render CI/CD",
      credentials: "AWS Certified Solutions Architect, 7 Yrs Exp",
      tag: "DevOps & Cloud"
    },
    {
      id: "fac-7",
      name: "T. Meenakshi",
      role: "Quality Assurance & Evaluation Harness Lead",
      domain: "Automated Test Suites, Pytest & Performance QA",
      credentials: "Senior QA Architect, 6 Yrs Exp",
      tag: "Automated QA"
    },
    {
      id: "fac-8",
      name: "V. Sundar",
      role: "Cybersecurity & Identity Systems Lead",
      domain: "JWT Auth, OAuth2, RBAC & High-Security Systems",
      credentials: "CISSP Certified Security Engineer, 8 Yrs Exp",
      tag: "Security & Auth"
    },
    {
      id: "fac-9",
      name: "N. Shalini",
      role: "Asynchronous Pipelines & Messaging Specialist",
      domain: "Celery Workers, Redis Broker & Event Streaming",
      credentials: "Cloud Data Architect, 5 Yrs Exp",
      tag: "Async Pipelines"
    },
    {
      id: "fac-10",
      name: "A. Sathish",
      role: "Real-Time Streaming & WebSockets Lead",
      domain: "Django Channels, ASGI & Real-Time Telemetry",
      credentials: "Real-Time Systems Consultant, 6 Yrs Exp",
      tag: "WebSockets"
    }
  ],

  // Verified Fellow Endorsements & Reviews
  testimonials: [
    {
      id: "test-1",
      name: "Anand K.",
      role: "Cloud Backend Engineer at FinTech Global",
      cohort: "Engineering Fellow '25",
      text: "The architectural flow diagrams combined with instant automated output verification transformed how I reason about backend services. I passed my enterprise technical interviews on the first attempt.",
      stars: 5,
      verified: true
    },
    {
      id: "test-2",
      name: "Priya Sundaram",
      role: "Systems Trainee at SaaS Microservices",
      cohort: "Engineering Fellow '26",
      text: "Having dedicated faculty who actually review your automated execution outputs and step-by-step problem workbenches makes SkillStack stand leagues apart from ordinary tutorial sites.",
      stars: 5,
      verified: true
    },
    {
      id: "test-3",
      name: "Karthikeyan R.",
      role: "Associate DevOps & Backend Engineer",
      cohort: "Engineering Fellow '25",
      text: "The dual-mode workbench with immediate feedback loops allowed me to build real intuition for backend development execution cycles. The curriculum is rigorous, practical, and highly rewarding.",
      stars: 5,
      verified: true
    }
  ],

  // Official Channels & Contact Information
  contact: {
    email: "admissions@skillstack.com",
    supportEmail: "support@skillstack.com",
    facultyDesk: "faculty@skillstack.com",
    phone: "+91 44 2850 4900",
    tollFree: "1800 572 8900",
    campus: "SkillStack Tech Hub, OMR Cyber Corridor, Chennai, Tamil Nadu, India",
    workingHours: "Monday – Saturday: 09:00 AM – 07:00 PM IST",
    socials: {
      github: "https://github.com/skillstack-learning",
      linkedin: "https://linkedin.com/company/skillstack-learning",
      twitter: "https://twitter.com/SkillStackLearn"
    }
  }
};
