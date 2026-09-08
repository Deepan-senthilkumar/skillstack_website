import React, { useState } from 'react';
import {
  Globe, Server, GitBranch, Cpu, Database, Layout, ArrowRight,
  ShieldCheck, Layers, FileCode, Sparkles, CheckCircle2, Info
} from 'lucide-react';

const DIAGRAMS = {
  'mvt-cycle': {
    title: 'Django MVT Architecture & Request-Response Lifecycle',
    subtitle: 'How a user request travels through Django to generate an HTML response',
    nodes: [
      {
        id: 'client',
        title: '1. User Browser',
        badge: 'HTTP Client',
        icon: Globe,
        color: '#54A0FF',
        desc: 'User types URL (e.g. https://site.com/blog/) and sends HTTP GET request.',
        details: 'The browser initiates an HTTP connection to the web server, carrying request headers, cookies, and optional payload.'
      },
      {
        id: 'wsgi',
        title: '2. WSGI / ASGI',
        badge: 'Web Gateway',
        icon: Server,
        color: '#A29BFE',
        desc: 'Gunicorn / uWSGI receives request and translates it to Django WSGIRequest.',
        details: 'The gateway acts as the bridge between standard HTTP web servers and Python application code.'
      },
      {
        id: 'router',
        title: '3. urls.py',
        badge: 'Traffic Police',
        icon: GitBranch,
        color: '#E5A444',
        desc: 'URL Dispatcher matches URL against urlpatterns and finds target view.',
        details: 'Extracts dynamic parameters like <int:id> or <slug:slug> and prepares arguments for the view function.'
      },
      {
        id: 'view',
        title: '4. views.py',
        badge: 'Brain / Controller',
        icon: Cpu,
        color: '#3E9C74',
        desc: 'View function handles request, coordinates ORM data, and prepares context.',
        details: 'Executes business logic, checks permissions, calls ORM methods, and constructs context dictionary for templates.'
      },
      {
        id: 'orm',
        title: '5. ORM & DB',
        badge: 'Data Layer',
        icon: Database,
        color: '#48B385',
        desc: 'models.py translates Python QuerySets into SQL and queries Supabase DB.',
        details: 'Django ORM lazily evaluates QuerySets, formats clean SQL queries, and hydrates records into Python class objects.'
      },
      {
        id: 'template',
        title: '6. Template / DTL',
        badge: 'Presenter',
        icon: Layout,
        color: '#E06C75',
        desc: 'HTML template combined with context using Django Template Language (DTL).',
        details: 'Renders {{ variables }}, evaluates {% if %}/{% for %} tags, resolves template inheritance (base.html), and produces pure HTML.'
      },
      {
        id: 'response',
        title: '7. HTTP Response',
        badge: 'Output (200 OK)',
        icon: CheckCircle2,
        color: '#5CC194',
        desc: 'Django packages HTML/JSON into HttpResponse and sends back to browser.',
        details: 'Includes HTTP status code (200 OK, 302 Redirect, 404), content-type headers, and session cookies.'
      },
    ]
  },

  'orm-pipeline': {
    title: 'Django ORM to PostgreSQL Pipeline',
    subtitle: 'From Python QuerySet to SQL execution in Supabase',
    nodes: [
      {
        id: 'queryset',
        title: '1. Python QuerySet',
        badge: 'Python Syntax',
        icon: FileCode,
        color: '#3E9C74',
        desc: 'Post.objects.filter(is_published=True).order_by("-published_on")',
        details: 'QuerySets are lazy! No database interaction occurs until you iterate, slice, or convert to a list.'
      },
      {
        id: 'compiler',
        title: '2. SQL Compiler',
        badge: 'Django Core Engine',
        icon: Cpu,
        color: '#E5A444',
        desc: 'Translates Django ORM lookups (__icontains, __gte) into dialect SQL.',
        details: 'Generates secure parameterized SQL queries with automatic SQL-injection prevention.'
      },
      {
        id: 'db',
        title: '3. Supabase PostgreSQL',
        badge: 'Database Server',
        icon: Database,
        color: '#54A0FF',
        desc: 'Runs compiled SQL statement and returns table rows over SSL connection.',
        details: 'Executes indexed lookups, joins, transactions, and returns raw binary/text row results.'
      },
      {
        id: 'hydration',
        title: '4. Model Hydration',
        badge: 'Python Objects',
        icon: Layers,
        color: '#A29BFE',
        desc: 'Django converts database rows into Post model class instances.',
        details: 'Instantiates model objects with typed attributes accessible directly in Python (e.g. post.title).'
      },
    ]
  },

  'drf-serializer': {
    title: 'Django REST Framework (DRF) Pipeline',
    subtitle: 'Full roundtrip data transformation for modern APIs',
    nodes: [
      {
        id: 'client-json',
        title: '1. JSON Request',
        badge: 'HTTP REST',
        icon: Globe,
        color: '#54A0FF',
        desc: 'Frontend / Client sends JSON payload to API endpoint.',
        details: 'Contains authentication headers (Bearer token) and request body formatted as application/json.'
      },
      {
        id: 'viewset',
        title: '2. APIView / ViewSet',
        badge: 'API Controller',
        icon: Cpu,
        color: '#E5A444',
        desc: 'Checks permissions and passes data to Serializer.',
        details: 'Evaluates IsAuthenticated and custom permissions before invoking serializers or handlers.'
      },
      {
        id: 'serializer',
        title: '3. Serializer Validation',
        badge: 'Data Guard',
        icon: ShieldCheck,
        color: '#3E9C74',
        desc: 'Validates fields, types, and constraints (serializer.is_valid()).',
        details: 'Validates required fields, formats, and executes custom validate_<field>() methods.'
      },
      {
        id: 'save',
        title: '4. ORM Persistence',
        badge: 'Database Save',
        icon: Database,
        color: '#48B385',
        desc: 'serializer.save() writes data to database through Django ORM.',
        details: 'Creates or updates model records with transactional integrity.'
      },
      {
        id: 'response-json',
        title: '5. JSON Response',
        badge: '201 Created',
        icon: CheckCircle2,
        color: '#5CC194',
        desc: 'Converts Model to JSON and returns 200/201 Response to frontend.',
        details: 'Renders response data dictionary back into JSON format transmitted over HTTP.'
      },
    ]
  }
};

export default function ArchitectureFlowDiagram({ diagramType = 'mvt-cycle' }) {
  const diagram = DIAGRAMS[diagramType] || DIAGRAMS['mvt-cycle'];
  const [activeNodeId, setActiveNodeId] = useState(diagram.nodes[0].id);

  const activeNode = diagram.nodes.find(n => n.id === activeNodeId) || diagram.nodes[0];

  return (
    <div className="flow-diagram-container">
      {/* Diagram Header */}
      <div className="flow-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <Sparkles size={16} color="var(--blue-vibrant)" />
          <span style={{ fontSize: '11.5px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--blue-vibrant)' }}>
            Interactive Architecture Flow Diagram
          </span>
        </div>
        <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>{diagram.title}</h3>
        <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
          {diagram.subtitle} &bull; Click any step to inspect the mental model.
        </p>
      </div>

      {/* Interactive Node Flow Rail */}
      <div className="flow-rail">
        {diagram.nodes.map((node, index) => {
          const Icon = node.icon;
          const isActive = node.id === activeNodeId;
          const isLast = index === diagram.nodes.length - 1;

          return (
            <React.Fragment key={node.id}>
              {/* Step Card Node */}
              <div
                className={`flow-node-card ${isActive ? 'active' : ''}`}
                onClick={() => setActiveNodeId(node.id)}
                style={{
                  borderColor: isActive ? 'var(--blue-vibrant)' : 'var(--border-subtle)',
                  boxShadow: isActive ? '0 8px 24px var(--blue-glow)' : 'var(--shadow-sm)',
                  background: isActive ? '#FFFFFF' : '#FFFFFF',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <div
                    className="flow-node-icon"
                    style={{
                      background: 'var(--blue-soft)',
                      borderColor: 'var(--blue-border)',
                      color: 'var(--blue-primary)'
                    }}
                  >
                    <Icon size={16} />
                  </div>
                  <span
                    className="flow-badge"
                    style={{
                      background: 'var(--blue-soft)',
                      color: 'var(--blue-primary)',
                      borderColor: 'var(--blue-border)'
                    }}
                  >
                    {node.badge}
                  </span>
                </div>

                <div style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--text-primary)' }}>
                  {node.title}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.45 }}>
                  {node.desc}
                </div>
              </div>

              {/* Animated Curvy Connector Line */}
              {!isLast && (
                <div className="flow-connector-wrapper">
                  <svg width="44" height="28" viewBox="0 0 44 28" fill="none">
                    <path
                      d="M 0 14 C 22 14, 22 14, 44 14"
                      stroke="url(#blueFlowGradient)"
                      strokeWidth="2.5"
                      strokeDasharray="4 4"
                      className="animated-flow-path"
                    />
                    <circle cx="22" cy="14" r="3.5" fill="var(--blue-vibrant)" className="pulsing-flow-dot" />
                    <defs>
                      <linearGradient id="blueFlowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#7B1C6E" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#7B1C6E" stopOpacity="0.95" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Detailed Mental Model Inspector Box */}
      {activeNode && (
        <div className="flow-detail-box">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Info size={17} color="var(--blue-vibrant)" />
            <strong style={{ fontSize: '14.5px', color: 'var(--text-primary)' }}>
              Deep Dive: {activeNode.title} ({activeNode.badge})
            </strong>
          </div>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
            {activeNode.details}
          </p>
        </div>
      )}
    </div>
  );
}
