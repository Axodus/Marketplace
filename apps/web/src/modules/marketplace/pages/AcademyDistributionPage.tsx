import type { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { useAcademyDistributionOverview } from "../hooks/useMarketplace";
import type { AcademyCertificationView, AcademyCourseView, AcademySubscriptionView } from "../services/marketplaceService";

const badges = ["mock academy", "config-first academy", "Learning Entitlement mock", "no LMS", "no progress tracking", "no learning analytics", "no credential issuance", "no billing", "no entitlement"];

export function AcademyDistributionPage() {
  const { academySlug } = useParams();
  const query = useAcademyDistributionOverview();

  if (query.isLoading || !query.data) {
    return (
      <section className="rounded border border-slate-200 bg-white p-6 shadow-sm" role="status" aria-live="polite">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Academy Distribution</p>
        <h1 className="mt-2 text-2xl font-semibold">Loading academy mock context</h1>
        <p className="mt-2 text-sm text-slate-600">No LMS, course player, credential issuance, billing or entitlement is executing.</p>
      </section>
    );
  }

  const selectedCourse = query.data.courses.find((entry) => entry.course.slug === academySlug || entry.course.id === academySlug);
  const selectedCertification = query.data.certifications.find((entry) => entry.certification.slug === academySlug || entry.certification.id === academySlug);
  const selectedSubscription = query.data.subscriptions.find((entry) => entry.subscription.slug === academySlug || entry.subscription.id === academySlug);

  if (academySlug && !selectedCourse && !selectedCertification && !selectedSubscription) {
    return (
      <section className="rounded border border-amber-200 bg-amber-50 p-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">Academy Distribution</p>
        <h1 className="mt-2 text-2xl font-semibold">Academy preview not found</h1>
        <p className="mt-2 text-sm text-amber-900">No Academy Distribution runtime, LMS, credential verification, billing or entitlement was attempted.</p>
        <Link to="/marketplace/academy" className="mt-4 inline-flex text-sm font-semibold text-teal-800">
          Back to Academy Distribution
        </Link>
      </section>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded border border-teal-200 bg-teal-50 p-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Academy Distribution</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-950">Mock/config-first learning commerce previews</h1>
        <p className="mt-3 max-w-4xl text-sm text-slate-700">
          Courses, modules, lessons, learning paths, certifications, credential previews and learning subscriptions are static Marketplace records.
          They preserve tenant, curated catalog, distribution, revenue sharing and intelligence context without activating LMS real, credential real,
          billing real or entitlement productive.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {badges.map((badge) => <NeutralBadge key={badge}>{badge}</NeutralBadge>)}
        </div>
      </section>

      {selectedCourse ? <CourseDetail view={selectedCourse} /> : null}
      {selectedCertification ? <CertificationDetail view={selectedCertification} /> : null}
      {selectedSubscription ? <SubscriptionDetail view={selectedSubscription} /> : null}

      {!academySlug ? (
        <>
          <section className="grid gap-4 md:grid-cols-5">
            <Metric label="Courses" value={query.data.courses.length} />
            <Metric label="Certifications" value={query.data.certifications.length} />
            <Metric label="Subscriptions" value={query.data.subscriptions.length} />
            <Metric label="Learning Entitlement mock" value={query.data.learningEntitlementMocks.length} />
            <Metric label="Data Boundaries" value={query.data.dataBoundaries.length} />
          </section>

          <section className="grid gap-4 lg:grid-cols-3">
            {query.data.courses.map((view) => <CourseCard key={view.course.id} view={view} />)}
            {query.data.certifications.map((view) => <CertificationCard key={view.certification.id} view={view} />)}
            {query.data.subscriptions.map((view) => <SubscriptionCard key={view.subscription.id} view={view} />)}
          </section>

          <section className="rounded border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold">Academy Data Boundaries</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {query.data.dataBoundaries.map((boundary) => (
                <div key={boundary.id} className="rounded border border-slate-200 p-4">
                  <p className="text-sm font-semibold text-slate-900">{boundary.boundaryLabel}</p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">{boundary.status}</p>
                  <p className="mt-2 text-sm text-slate-600">{boundary.disclaimers.join(" ")}</p>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}

function CourseCard({ view }: { view: AcademyCourseView }) {
  return (
    <article className="rounded border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">Course</p>
      <h2 className="mt-2 text-lg font-semibold">{view.course.title}</h2>
      <p className="mt-2 text-sm text-slate-600">{view.course.description}</p>
      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <Metric label="Modules" value={view.modules.length} />
        <Metric label="Lessons" value={view.lessons.length} />
      </div>
      <BoundaryLine notes={view.boundaryNotes} />
      <Link to={`/marketplace/academy/${view.course.slug}`} className="mt-4 inline-flex text-sm font-semibold text-teal-700">
        Open Course Detail
      </Link>
    </article>
  );
}

function CertificationCard({ view }: { view: AcademyCertificationView }) {
  return (
    <article className="rounded border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">Certification</p>
      <h2 className="mt-2 text-lg font-semibold">{view.certification.title}</h2>
      <p className="mt-2 text-sm text-slate-600">{view.certification.description}</p>
      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <Metric label="Requirements" value={view.requirements.length} />
        <Metric label="Verifiable" value={String(view.certificateBadgeMock?.isVerifiable ?? false)} />
      </div>
      <BoundaryLine notes={view.boundaryNotes} />
      <Link to={`/marketplace/academy/${view.certification.slug}`} className="mt-4 inline-flex text-sm font-semibold text-teal-700">
        Open Certification Detail
      </Link>
    </article>
  );
}

function SubscriptionCard({ view }: { view: AcademySubscriptionView }) {
  return (
    <article className="rounded border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Learning Subscription</p>
      <h2 className="mt-2 text-lg font-semibold">{view.subscription.name}</h2>
      <p className="mt-2 text-sm text-slate-600">{view.subscription.description}</p>
      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <Metric label="Courses" value={view.courses.length} />
        <Metric label="Certifications" value={view.certifications.length} />
      </div>
      <BoundaryLine notes={view.boundaryNotes} />
      <Link to={`/marketplace/academy/${view.subscription.slug}`} className="mt-4 inline-flex text-sm font-semibold text-teal-700">
        Open Subscription Detail
      </Link>
    </article>
  );
}

function CourseDetail({ view }: { view: AcademyCourseView }) {
  return (
    <section className="rounded border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Course Detail</p>
      <h2 className="mt-2 text-2xl font-semibold">{view.course.title}</h2>
      <ContextGrid items={[
        ["Tenant", view.tenant?.displayName ?? "none"],
        ["Curated catalog", view.curatedCatalog?.displayName ?? "none"],
        ["Distribution", view.distributionChannel?.displayName ?? "none"],
        ["Revenue policy", view.revenuePolicy?.policy.slug ?? "none"],
        ["Intelligence snapshot", view.intelligenceSnapshot?.snapshot.title ?? "none"],
        ["Access preview", view.accessPreview?.status ?? "missing"]
      ]} />
      <h3 className="mt-6 font-semibold">Modules and Lessons</h3>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {view.modules.map((module) => (
          <div key={module.id} className="rounded border border-slate-200 p-4">
            <p className="font-semibold">{module.title}</p>
            <p className="mt-1 text-sm text-slate-600">{module.description}</p>
            <p className="mt-2 text-xs text-slate-500">{module.disclaimers.join(" ")}</p>
          </div>
        ))}
      </div>
      <BoundaryLine notes={view.boundaryNotes} />
    </section>
  );
}

function CertificationDetail({ view }: { view: AcademyCertificationView }) {
  return (
    <section className="rounded border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-wide text-indigo-700">Certification Detail</p>
      <h2 className="mt-2 text-2xl font-semibold">{view.certification.title}</h2>
      <ContextGrid items={[
        ["Issuer", view.certification.issuerLabel],
        ["Credential Preview", view.credentialPreview?.verificationLabel ?? "missing"],
        ["Certificate Badge mock", view.certificateBadgeMock?.badgeLabel ?? "missing"],
        ["Revenue policy", view.revenuePolicy?.policy.slug ?? "none"],
        ["Can issue credential", String(view.certification.canIssueCredential)],
        ["Can verify credential", String(view.certification.canVerifyCredential)]
      ]} />
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {view.requirements.map((requirement) => (
          <div key={requirement.id} className="rounded border border-slate-200 p-4">
            <p className="font-semibold">{requirement.title}</p>
            <p className="mt-1 text-sm text-slate-600">{requirement.description}</p>
            <p className="mt-2 text-xs text-slate-500">{requirement.disclaimers.join(" ")}</p>
          </div>
        ))}
      </div>
      <BoundaryLine notes={view.boundaryNotes} />
    </section>
  );
}

function SubscriptionDetail({ view }: { view: AcademySubscriptionView }) {
  return (
    <section className="rounded border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Learning Subscription Detail</p>
      <h2 className="mt-2 text-2xl font-semibold">{view.subscription.name}</h2>
      <ContextGrid items={[
        ["Tier count", String(view.tiers.length)],
        ["Included courses", String(view.courses.length)],
        ["Included certifications", String(view.certifications.length)],
        ["Can bill", String(view.subscription.canBill)],
        ["Can grant entitlement", String(view.subscription.canGrantEntitlement)],
        ["Learning Entitlement mock", view.learningEntitlementMock?.status ?? "missing"],
        ["Can settle", String(view.subscription.canSettle)]
      ]} />
      {view.learningEntitlementMock ? (
        <div className="mt-5 rounded border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-900">{view.learningEntitlementMock.entitlementLabel}</p>
          <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">{view.learningEntitlementMock.status}</p>
          <p className="mt-2 text-sm text-slate-600">{view.learningEntitlementMock.disclaimers.join(" ")}</p>
        </div>
      ) : null}
      <BoundaryLine notes={view.boundaryNotes} />
    </section>
  );
}

function ContextGrid({ items }: { items: Array<[string, string]> }) {
  return (
    <dl className="mt-5 grid gap-3 md:grid-cols-3">
      {items.map(([label, value]) => (
        <div key={label} className="rounded border border-slate-200 bg-slate-50 p-3">
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
          <dd className="mt-1 text-sm font-semibold text-slate-900">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function BoundaryLine({ notes }: { notes: string[] }) {
  return <p className="mt-4 text-xs text-slate-500">{notes.join(" ")}</p>;
}

function NeutralBadge({ children }: { children: ReactNode }) {
  return <span className="rounded border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-700">{children}</span>;
}
