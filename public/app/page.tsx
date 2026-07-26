const Arrow = () => <span aria-hidden="true">↗</span>;

function InfrastructureMap() {
  return (
    <div className="infrastructure-map" aria-label="Marketplace distribution infrastructure visualization">
      <div className="map-grid" />
      <div className="map-label label-product">
        <span>PRODUCT MODULE</span><b>PRD_3498</b><em>ACTIVE</em>
      </div>
      <div className="map-label label-region">
        <span>DISTRIBUTION NODE</span><b>REGION EU-1</b><em>98% HEALTH</em>
      </div>
      <div className="map-label label-core">
        <span>MARKETPLACE CORE</span><b>12.4K REQ/S</b><em>LIVE</em>
      </div>
      <div className="map-label label-audit">
        <span>AUDIT TRAIL</span><b>8,214 EVENTS</b><em>VERIFIED</em>
      </div>
      <svg className="network" viewBox="0 0 760 620" role="img" aria-hidden="true">
        <defs>
          <filter id="glow"><feGaussianBlur stdDeviation="5" result="blur" /></filter>
        </defs>
        <g className="planes">
          <path d="M172 212v203l88 50V262z" />
          <path d="M312 95v294l92 52V147z" />
          <path d="M466 145v238l88 50V195z" />
          <path d="M570 276v198l78 44V320z" />
          <path d="M172 212l88 50 52-30-88-50zM260 465l98 56 46-27-98-56zM404 441l92 52 74-43-92-52z" />
        </g>
        <g className="routes">
          <path d="M86 342L366 340L518 248" />
          <path d="M366 340L366 492" />
          <path d="M366 340L612 346" />
          <path d="M366 340L244 274" />
        </g>
        <g className="nodes">
          <circle cx="86" cy="342" r="4" />
          <circle cx="244" cy="274" r="4" />
          <circle cx="366" cy="340" r="11" className="core-glow" />
          <circle cx="366" cy="492" r="5" />
          <circle cx="518" cy="248" r="6" />
          <circle cx="612" cy="346" r="4" />
        </g>
        <g className="markers">
          <path d="M183 296h24M184 308h16M320 198h20M476 340h28M580 399h24" />
          <path className="lime" d="M221 214l18-10M426 479l22-12M598 308l20-12" />
        </g>
      </svg>
      <span className="map-caption">Distribution infrastructure / system view 01</span>
    </div>
  );
}

const deploymentModels = [
  {
    id: "01",
    title: "Independent Deploy",
    copy: "A custom marketplace for your brand, infrastructure and commercial model.",
    tag: "Full ownership",
  },
  {
    id: "02",
    title: "Axodus Tenant",
    copy: "A tailored storefront inside Axodus, with curated lists, categories and display rules.",
    tag: "Ecosystem-native",
  },
  {
    id: "03",
    title: "Official Marketplace",
    copy: "marketplace.country as the official public portal for ecosystem consumption.",
    tag: "Curated distribution",
  },
];

const categories = [
  ["01", "Digital Products", "Software · Licenses · Tools"],
  ["02", "AI Services", "ACS · Agents · MCP · Automation"],
  ["03", "Digital Assets", "Certificates · Rights · Licenses"],
  ["04", "Enterprise", "Infrastructure · Managed Services"],
  ["05", "Academy", "Courses · Training · Certification"],
  ["06", "DAO", "Governance · Operations · Community"],
];

const capabilities = [
  "Product Discovery",
  "Secure Licensing",
  "Subscription Management",
  "Enterprise Provisioning",
  "Digital Assets",
  "Governance Integration",
  "Treasury-aware Commerce",
  "Operational Transparency",
];

const flow = [
  ["01", "Partner", "Enter as an organization, DAO, provider or developer."],
  ["02", "Publish", "Structure a product, service, license or subscription."],
  ["03", "Validate", "Apply catalog, governance and operational requirements."],
  ["04", "Distribute", "Reach the selected storefronts and customer segments."],
  ["05", "Access", "Provision subscriptions, licenses and entitlements."],
  ["06", "Support", "Maintain service continuity and operational visibility."],
];

const faqs = [
  ["What is Axodus Marketplace?", "A digital distribution infrastructure for ecosystem products, AI services, subscriptions, licenses, enterprise solutions and digital assets."],
  ["Can I sell products through it?", "The platform is being designed for approved partners and providers to publish and distribute eligible digital offerings. Commercial onboarding is not yet generally available."],
  ["Can companies request a dedicated marketplace?", "Yes. Organizations can discuss an independent branded deployment or, when affiliated with Axodus, a customized tenant deployment within the ecosystem."],
  ["How do subscriptions and licenses work?", "The architecture supports recurring access, licensing and entitlement flows with visible operational records. These capabilities are being developed in live mode."],
  ["How does AI integration work?", "ACS capabilities are intended to distribute AI agents, MCP systems, automation, orchestration and compute-backed services through governed commercial flows."],
  ["How can I become a partner?", "Start a conversation with the Axodus team to discuss distribution, tenancy, custom deployment or ecosystem integration."],
];

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Axodus Marketplace",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "Digital distribution infrastructure for products, AI services, subscriptions, licensing and enterprise solutions.",
    url: "https://marketplace.country",
    sameAs: [
      "https://dev.marketplace.country",
      "https://github.com/Axodus/Marketplace",
    ],
    publisher: {
      "@type": "Organization",
      name: "Axodus",
    },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Axodus Marketplace home">
          <img src="/assets/Axodus_logo.svg" alt="Axodus" />
          <span>MARKETPLACE</span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#platform">Platform</a>
          <a href="#deployments">Deployments</a>
          <a href="#capabilities">Capabilities</a>
          <a href="#developers">Developers</a>
        </nav>
        <a className="live-link" href="https://dev.marketplace.country" target="_blank" rel="noreferrer">
          <i /> LIVE DEVELOPMENT <span>dev.marketplace.country</span>
        </a>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">AXODUS MARKETPLACE <span>/</span> LIVE DEVELOPMENT</p>
          <h1>Build, Distribute and Scale Digital Products</h1>
          <p className="hero-lead">
            Marketplace infrastructure for digital products, AI services,
            enterprise solutions and ecosystem capabilities.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="https://dev.marketplace.country" target="_blank" rel="noreferrer">
              Explore Live Marketplace <Arrow />
            </a>
            <a className="button secondary" href="#deployments">
              Deployment Models <Arrow />
            </a>
          </div>
          <p className="development-note">
            <span>OPEN BUILD</span>
            Follow the platform as it is designed, tested and evolved in public.
          </p>
        </div>
        <InfrastructureMap />
      </section>

      <section className="deployment-rail" id="deployments" aria-label="Deployment models">
        {deploymentModels.map((model) => (
          <article key={model.id}>
            <span className="model-id">{model.id}</span>
            <div>
              <p>{model.tag}</p>
              <h2>{model.title}</h2>
              <span>{model.copy}</span>
            </div>
            <Arrow />
          </article>
        ))}
      </section>

      <section className="platform-intro section" id="platform">
        <div className="section-index">01 / PLATFORM</div>
        <div className="section-heading">
          <p className="eyebrow">DIGITAL DISTRIBUTION INFRASTRUCTURE</p>
          <h2>One marketplace core.<br />Multiple paths to market.</h2>
        </div>
        <p className="section-lead">
          Axodus Marketplace connects organizations, developers and users through
          one distribution layer for products, services, subscriptions, licenses,
          AI capabilities, digital assets and enterprise solutions.
        </p>
        <div className="statement-grid">
          <div><span>01</span><b>Publish</b><p>Structure market-ready digital offerings.</p></div>
          <div><span>02</span><b>Distribute</b><p>Route them to the right catalog and audience.</p></div>
          <div><span>03</span><b>Operate</b><p>Maintain visible access, billing and governance.</p></div>
        </div>
      </section>

      <section className="categories section" id="capabilities">
        <div className="section-index">02 / CATEGORIES</div>
        <div className="section-heading compact">
          <p className="eyebrow">MARKETPLACE DOMAINS</p>
          <h2>Built to distribute<br />ecosystem capacity.</h2>
        </div>
        <div className="category-grid">
          {categories.map(([id, title, items]) => (
            <article key={id}>
              <span>{id}</span>
              <h3>{title}</h3>
              <p>{items}</p>
              <i aria-hidden="true">↗</i>
            </article>
          ))}
        </div>
      </section>

      <section className="features section">
        <div className="section-index">03 / CAPABILITIES</div>
        <div className="feature-heading">
          <div className="section-heading compact">
            <p className="eyebrow">GOVERNANCE-READY COMMERCE</p>
            <h2>Commerce with<br />operational memory.</h2>
          </div>
          <p className="section-lead">
            The infrastructure is designed to make distribution legible:
            from discovery and provisioning to treasury-aware activity and audit.
          </p>
        </div>
        <div className="capability-list">
          {capabilities.map((item, index) => (
            <div key={item}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <b>{item}</b>
              <i />
            </div>
          ))}
        </div>
      </section>

      <section className="enterprise section">
        <div className="section-index">04 / ENTERPRISE</div>
        <div className="enterprise-copy">
          <p className="eyebrow">ENTERPRISE READY</p>
          <h2>Dedicated when the operating model demands it.</h2>
          <p>
            Infrastructure for organizations that require scalable digital
            commerce, subscriptions, AI services and operational governance
            without losing control of presentation or catalog policy.
          </p>
          <a className="text-link" href="mailto:contact@axodus.country">Discuss an enterprise deployment <Arrow /></a>
        </div>
        <div className="enterprise-spec">
          <p><span>DEPLOYMENT</span><b>Dedicated / Tenant</b></p>
          <p><span>CATALOG</span><b>Custom lists + categories</b></p>
          <p><span>OPERATIONS</span><b>Managed or independent</b></p>
          <p><span>VISIBILITY</span><b>Billing + audit trace</b></p>
          <div className="spec-status"><i /> ARCHITECTURE AVAILABLE FOR DISCUSSION</div>
        </div>
      </section>

      <section className="ai-section section">
        <div className="section-index">05 / AI INFRASTRUCTURE</div>
        <div className="neurons-mark">
          <img src="/assets/neurons-logo.svg" alt="Neurons" />
          <span>AI CAPABILITY LAYER</span>
        </div>
        <div className="ai-layout">
          <div className="section-heading compact">
            <p className="eyebrow">ACS DISTRIBUTION</p>
            <h2>AI services become<br />distributable products.</h2>
          </div>
          <p className="section-lead">
            The Marketplace is the commercial surface for Axodus AI capacity:
            agents, MCP systems, automation, orchestration and compute services.
          </p>
        </div>
        <div className="ai-modules">
          {["AI Agents", "MCP Systems", "Automation", "Orchestration", "Compute Services"].map((item, i) => (
            <div key={item}><span>ACS/{String(i + 1).padStart(2, "0")}</span><b>{item}</b><i /></div>
          ))}
        </div>
      </section>

      <section className="flow-section section">
        <div className="section-index">06 / DISTRIBUTION FLOW</div>
        <div className="section-heading compact">
          <p className="eyebrow">FROM PARTNER TO ACCESS</p>
          <h2>A visible path<br />through distribution.</h2>
        </div>
        <div className="flow-grid">
          {flow.map(([id, title, copy]) => (
            <article key={id}>
              <span>{id}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="developers section" id="developers">
        <div className="section-index">07 / DEVELOPERS</div>
        <div className="developer-panel">
          <div>
            <p className="eyebrow">DEVELOPER SURFACE</p>
            <h2>Integration designed<br />as infrastructure.</h2>
            <p className="section-lead">
              APIs, SDKs and documentation will provide programmatic access to
              marketplace catalogs, products, entitlements and operational data.
            </p>
          </div>
          <div className="code-window" aria-label="Developer integration example">
            <div><span>marketplace.api</span><i>LIVE MODE / SPEC EVOLVING</i></div>
            <pre><code>{`const catalog = await axodus.marketplace({
  tenant: "your-project",
  categories: ["ai", "enterprise"],
  visibility: "curated"
});

await catalog.distribute(product);`}</code></pre>
            <p><span>SDK</span><span>REST</span><span>GRAPHQL</span><span>MCP</span></p>
          </div>
        </div>
        <a className="button secondary" href="https://github.com/Axodus/Marketplace" target="_blank" rel="noreferrer">
          Follow Development on GitHub <Arrow />
        </a>
      </section>

      <section className="trust section">
        <div className="section-index">08 / TRUST</div>
        <div className="section-heading compact">
          <p className="eyebrow">SECURITY PRINCIPLES</p>
          <h2>No opaque<br />commercial flows.</h2>
        </div>
        <div className="trust-grid">
          {[
            ["Governance", "Policy-aware operation"],
            ["Transparency", "Visible state and decisions"],
            ["Auditability", "Reviewable event history"],
            ["Billing Visibility", "Legible commercial activity"],
            ["Traceability", "Operational cause and effect"],
          ].map(([title, copy], i) => (
            <article key={title}><span>0{i + 1}</span><h3>{title}</h3><p>{copy}</p></article>
          ))}
        </div>
      </section>

      <section className="roadmap section">
        <div className="section-index">09 / ROADMAP</div>
        <div className="section-heading compact">
          <p className="eyebrow">BUILD SEQUENCE</p>
          <h2>Infrastructure before<br />expansion.</h2>
        </div>
        <div className="timeline">
          {["Architecture", "Marketplace", "ACS", "Academy", "Enterprise", "Ecosystem"].map((item, i) => (
            <div key={item} className={i < 2 ? "active" : ""}>
              <span>0{i + 1}</span><i /><b>{item}</b>
              <small>{i === 0 ? "Foundation" : i === 1 ? "Live development" : "Planned sequence"}</small>
            </div>
          ))}
        </div>
      </section>

      <section className="faq section">
        <div className="section-index">10 / FAQ</div>
        <div className="faq-layout">
          <div className="section-heading compact">
            <p className="eyebrow">COMMON QUESTIONS</p>
            <h2>Clear context.<br />No false finish line.</h2>
          </div>
          <div className="faq-list">
            {faqs.map(([question, answer], i) => (
              <details key={question}>
                <summary><span>{String(i + 1).padStart(2, "0")}</span>{question}<i>+</i></summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="final-cta section">
        <img src="/assets/Axodus_logo.svg" alt="" aria-hidden="true" />
        <p className="eyebrow">AXODUS MARKETPLACE / LIVE DEVELOPMENT</p>
        <h2>Build your path<br />to distribution.</h2>
        <p>
          Explore the platform in development or start a conversation about
          independent, tenant and ecosystem deployment.
        </p>
        <div className="hero-actions">
          <a className="button primary" href="https://dev.marketplace.country" target="_blank" rel="noreferrer">Explore Live Marketplace <Arrow /></a>
          <a className="button secondary" href="mailto:contact@axodus.country">Become a Partner <Arrow /></a>
        </div>
      </section>

      <footer>
        <div className="footer-brand">
          <img src="/assets/Axodus_logo.svg" alt="Axodus" />
          <p>The digital distribution infrastructure for the Axodus ecosystem.</p>
        </div>
        <div className="footer-links">
          <div><span>PRODUCT</span><a href="#platform">Marketplace</a><a href="#deployments">Deployments</a><a href="#capabilities">Capabilities</a></div>
          <div><span>ECOSYSTEM</span><a href="https://academy.country">Academy</a><a href="#capabilities">ACS</a><a href="#platform">Business</a></div>
          <div><span>BUILD</span><a href="https://dev.marketplace.country">Live Marketplace</a><a href="https://github.com/Axodus/Marketplace">GitHub</a><a href="#developers">Developers</a></div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 AXODUS</span>
          <span>PRODUCT INFRASTRUCTURE / DEVELOPMENT IN PUBLIC</span>
          <a href="#top">BACK TO TOP ↑</a>
        </div>
      </footer>
    </main>
  );
}
