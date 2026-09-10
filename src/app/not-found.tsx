import Link from 'next/link';
export default function NotFound() {
  return (
    <main id="main-content" className="page-wrap">
      <div className="empty-state">
        <span className="eyebrow">Not on this map</span>
        <h1>We couldn’t find that page.</h1>
        <p>The listing may have moved or been removed.</p>
        <Link href="/" className="primary-button">
          Explore Chennai
        </Link>
      </div>
    </main>
  );
}
