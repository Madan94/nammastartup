import Link from 'next/link';
export const metadata = { title: 'Data & privacy | Chennai Startup Map' };
export default function PrivacyPage() {
  return (
    <main id="main-content" className="page-wrap prose-page">
      <span className="eyebrow">Data & privacy</span>
      <h1>Know what you share.</h1>
      <p className="lead">
        This notice describes how this directory currently handles information.
      </p>
      <h2>Browsing</h2>
      <p>
        You can browse public company, job, and news pages without a directory account. The hosting
        provider may process technical request information to serve and secure the site.
        OpenStreetMap receives map-tile requests when the map is displayed.
      </p>
      <h2>Company submissions and corrections</h2>
      <p>
        We store the information you submit, your email, a reference ID, timestamps, and review
        status. Your email stays in the protected review workspace. Only approved company
        information is published. Submitting a form does not subscribe you to marketing emails.
      </p>
      <h2>Security and cookies</h2>
      <p>
        Administrator sign-in uses a secure session cookie that expires after eight hours. Write
        endpoints use request-origin checks and request limits. Rate-limit keys use a hash of the
        visitor address when the hosting provider supplies it.
      </p>
      <h2>Sources and external sites</h2>
      <p>
        Profiles link to company websites. Job applications and news articles open on their original
        sites, which handle your information under their own policies. We do not collect resumes or
        job applications.
      </p>
      <h2>Corrections and deletion</h2>
      <p>
        Submissions remain available to the administrator for review until deleted. To request a
        correction, listing removal, or removal of submitted contact information, use the{' '}
        <Link href="/correct">correction form</Link> and identify the company and submission
        reference. Include only the information necessary to handle your request.
      </p>
    </main>
  );
}
