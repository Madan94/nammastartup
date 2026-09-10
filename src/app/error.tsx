'use client';
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="main-content" className="page-wrap">
      <div className="empty-state">
        <h1>We couldn’t load this page.</h1>
        <p>The directory is temporarily unavailable. Please try again.</p>
        <button className="primary-button" onClick={reset}>
          Try again
        </button>
      </div>
    </main>
  );
}
