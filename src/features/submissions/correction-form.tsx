'use client';
import { useState, FormEvent } from 'react';
import type { Company } from '@/lib/catalog/types';
export function CorrectionForm({
  companies,
  selected,
}: {
  companies: Company[];
  selected: string;
}) {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const data = Object.fromEntries(new FormData(e.currentTarget));
      const res = await fetch('/api/corrections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, consent: data.consent === 'on' }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error);
      setMessage('Your correction is saved for review. Reference: ' + body.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to submit');
    } finally {
      setBusy(false);
    }
  }
  if (message)
    return (
      <p className="notice success-notice" role="status">
        {message}
      </p>
    );
  return (
    <form className="public-form" onSubmit={submit}>
      <label>
        Company
        <select name="companySlug" defaultValue={selected} required>
          <option value="">Select a company</option>
          {companies.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Your email (private)
        <input name="email" type="email" required maxLength={200} />
      </label>
      <label className="full-width">
        What should we change?
        <textarea name="description" rows={4} minLength={15} maxLength={1500} required />
      </label>
      <label className="full-width">
        Official source supporting the correction
        <input name="sourceUrl" type="url" placeholder="https://…" required maxLength={500} />
      </label>
      <label className="checkbox-label full-width">
        <input type="checkbox" name="consent" required />I agree to the privacy notice and
        understand this request will be reviewed.
      </label>
      {error && (
        <p className="notice error-notice full-width" role="alert">
          {error}
        </p>
      )}
      <div className="full-width">
        <button className="primary-button" disabled={busy}>
          {busy ? 'Sending…' : 'Send correction'}
        </button>
      </div>
    </form>
  );
}
