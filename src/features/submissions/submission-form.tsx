'use client';
import { useState, FormEvent } from 'react';
import Link from 'next/link';
export function SubmissionForm() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [reference, setReference] = useState('');
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError('');
    const data = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, consent: data.consent === 'on' }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || 'Submission failed');
      setReference(body.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Please try again');
    } finally {
      setBusy(false);
    }
  }
  if (reference)
    return (
      <div className="form-success" role="status">
        <span className="eyebrow">Received for review</span>
        <h2>Thanks for putting Chennai on the map.</h2>
        <p>
          Your company will appear after an administrator checks the source and Chennai address.
        </p>
        <p>
          Reference: <code>{reference}</code>
        </p>
        <Link href="/" className="primary-button">
          Back to the map
        </Link>
      </div>
    );
  return (
    <form className="public-form" onSubmit={submit}>
      {[
        ['name', 'Company name', 'text', '100'],
        ['website', 'Official website', 'url', '500'],
        ['sector', 'Sector', 'text', '80'],
        ['area', 'Chennai neighbourhood', 'text', '80'],
        ['address', 'Chennai office address', 'text', '300'],
        ['email', 'Your email (kept private)', 'email', '200'],
        ['careersUrl', 'Official careers page (optional)', 'url', '500'],
      ].map(([name, label, type, max]) => (
        <label key={name}>
          {label}
          <input
            name={name}
            type={type}
            required={name !== 'careersUrl'}
            maxLength={Number(max)}
            placeholder={type === 'url' ? 'https://…' : undefined}
          />
        </label>
      ))}
      <label className="full-width">
        What does the company do?
        <textarea name="description" required minLength={15} maxLength={500} rows={4} />
      </label>
      <label className="form-trap" aria-hidden="true">
        Leave empty
        <input name="websiteConfirm" tabIndex={-1} autoComplete="off" />
      </label>
      <label className="checkbox-label full-width">
        <input type="checkbox" name="consent" required />
        <span>
          I agree to the <Link href="/privacy">privacy notice</Link> and confirm that the company
          has a Chennai-area presence.
        </span>
      </label>
      {error && (
        <p role="alert" className="notice error-notice full-width">
          {error}
        </p>
      )}
      <div className="full-width">
        <button className="primary-button" disabled={busy}>
          {busy ? 'Submitting…' : 'Submit for review'}
        </button>
      </div>
    </form>
  );
}
