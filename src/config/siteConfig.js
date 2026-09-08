/**
 * SkillStack — Dynamic Platform Configuration
 * All metrics, faculty rosters, capabilities, and platform metadata
 * are dynamically loaded via the Backend API.
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

  // Dynamic Live Metrics (Updated via API)
  metrics: {
    enrolledFellows: "0",
    activeLabProblems: "0",
    seniorFacultyCount: "0",
    automatedPassRate: "100%",
    codeEvaluationsToday: "0",
    partnerEnterprises: "0"
  },

  // Dynamic Capabilities (Managed via Admin / API)
  capabilities: [],

  // Dynamic Faculty Directory (Loaded from Backend /api/staff/faculty/)
  faculty: [],

  // Dynamic Fellow Testimonials & Reviews (Loaded via API)
  testimonials: [],

  // Contact & Platform Info
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
